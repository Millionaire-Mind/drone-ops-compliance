from __future__ import annotations

import os
import uuid
from datetime import datetime, UTC
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    AnalyzeWeatherInput,
    CheckAirspaceInput,
    CheckTfrsInput,
    GenerateChecklistInput,
    GenerateLaancLinksInput,
    ToolMeta,
    ToolResponse,
)
from apps.server.services.faa_airspace import analyze_airspace
from apps.server.services.faa_tfr import determine_us_state_from_latlon, fetch_tfr_list_json, filter_tfrs_by_state
from apps.server.services.nws_weather import fetch_latest_observation_by_latlon, part107_compliance_assessment
from packages.core.rules import decide_preflight

# Optional: Supabase logging (Phase 1 advisory snapshots)
_SUPABASE_URL = os.getenv("SUPABASE_URL")
_SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
_SUPABASE_TABLE = os.getenv("SUPABASE_TABLE", "advisory_snapshots")

_supabase_client = None


def utc_now_iso() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def _get_supabase():
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    if not _SUPABASE_URL or not _SUPABASE_SERVICE_KEY:
        return None
    try:
        from supabase import create_client  # type: ignore

        _supabase_client = create_client(_SUPABASE_URL, _SUPABASE_SERVICE_KEY)
        return _supabase_client
    except Exception:
        return None


async def _log_advisory_snapshot(payload: dict[str, Any]) -> str | None:
    """
    Best-effort logging. Must never break the advisory response.
    Returns snapshot_id (if inserted) or None.
    """
    sb = _get_supabase()
    if sb is None:
        return None

    try:
        # Note: keep naming neutral: "advisory snapshot" not "flight log".
        resp = sb.table(_SUPABASE_TABLE).insert(payload).execute()
        # supabase-py returns .data list on success
        if getattr(resp, "data", None) and isinstance(resp.data, list) and resp.data:
            inserted = resp.data[0]
            return inserted.get("id") or inserted.get("request_id")
        return None
    except Exception:
        return None


APP_NAME = "Drone Ops & Compliance Tool Server"
VERSION = os.getenv("APP_VERSION", "0.6.0")
GIT_COMMIT = os.getenv("GIT_COMMIT", "unknown")

app = FastAPI(title=APP_NAME, version=VERSION)

# CORS configuration for direct API access (mobile apps, external clients)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local Next.js dev
        "https://uasflightcheck.vercel.app",  # Production frontend (update with actual domain)
        "https://uasflightcheck.io",  # Production domain (when registered)
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz() -> dict[str, Any]:
    return {"ok": True, "service": APP_NAME, "timestamp_utc": utc_now_iso()}


@app.get("/version")
def version() -> dict[str, Any]:
    return {"service": APP_NAME, "version": VERSION, "git_commit": GIT_COMMIT, "timestamp_utc": utc_now_iso()}


def _tool_meta(sources: list[str], coverage: dict[str, str] | None = None, errors: list[str] | None = None, request_id: str | None = None) -> ToolMeta:
    return ToolMeta(
        data_timestamp_utc=utc_now_iso(),
        sources=sources,
        coverage=coverage or {},
        errors=errors or [],
        request_id=request_id,
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Conservative: never leak stack traces to the client.
    return JSONResponse(
        status_code=500,
        content={
            "result": {"status": "ERROR", "message": "Internal error"},
            "meta": _tool_meta(
                sources=["server"],
                coverage={"exception": "unhandled"},
                errors=[str(exc)],
                request_id=None,
            ).model_dump(),
        },
    )


@app.post("/tools/check_airspace", response_model=ToolResponse)
async def tool_check_airspace(inp: CheckAirspaceInput) -> ToolResponse:
    request_id = str(uuid.uuid4())
    res = await analyze_airspace(inp.latitude, inp.longitude, inp.altitude_ft_agl)
    return ToolResponse(
        result={
            "airspace_class": res.airspace_class,
            "facility": res.facility or res.airspace_name,
            "laanc_required": res.laanc_required,
            "laanc_available": res.laanc_available,
            "max_altitude_ft": res.max_altitude_ft,
            "restrictions": res.restrictions,
            "coordinates": {"lat": inp.latitude, "lon": inp.longitude},
            "status": "AUTHORIZATION_REQUIRED" if res.laanc_required else ("CLEAR" if res.laanc_required is False else "UNKNOWN"),
        },
        meta=_tool_meta(
            sources=["FAA UAS Data Delivery System (ArcGIS) - Class_Airspace", "FAA UAS Data Delivery System (ArcGIS) - UAS Facility Map Data (UASFM)"],
            coverage={"airspace": "best_effort"},
            errors=[],
            request_id=request_id,
        ),
    )


@app.post("/tools/analyze_weather_conditions", response_model=ToolResponse)
async def tool_weather(inp: AnalyzeWeatherInput) -> ToolResponse:
    request_id = str(uuid.uuid4())
    current, meta = await fetch_latest_observation_by_latlon(inp.latitude, inp.longitude)
    compliance = part107_compliance_assessment(
        visibility_sm=current.get("visibility_sm"),
        cloud_ceiling_ft=current.get("cloud_ceiling_ft"),
    )
    return ToolResponse(
        result={
            "current_conditions": current,
            "part107_compliance": compliance,
            "station_id": current.get("raw_source", {}).get("nws_station_id"),
        },
        meta=_tool_meta(
            sources=["NOAA/NWS API (api.weather.gov)"],
            coverage=meta,
            errors=[],
            request_id=request_id,
        ),
    )


@app.post("/tools/check_tfrs", response_model=ToolResponse)
async def tool_tfrs(inp: CheckTfrsInput) -> ToolResponse:
    request_id = str(uuid.uuid4())
    errors: list[str] = []
    coverage: dict[str, str] = {"tfr": "attempted"}

    state = None
    try:
        state = await determine_us_state_from_latlon(inp.latitude, inp.longitude)
    except Exception as e:
        errors.append(str(e))

    tfrs: list[dict[str, Any]] = []
    status = "UNKNOWN"
    advisory = "TFR lookup failed. Verify manually at tfr.faa.gov before flight."

    if state:
        try:
            full = await fetch_tfr_list_json()
            tfrs = filter_tfrs_by_state(full, state)
            status = "CLEAR" if len(tfrs) == 0 else "UNKNOWN"
            advisory = (
                "This check uses a state-level filter. Verify exact TFR boundaries and timing at tfr.faa.gov or an FAA-approved provider before flight."
            )
            coverage = {
                "tfr": "faa_export_json",
                "relevance": "state_filter_only_no_geometry",
                "radius_nm": "accepted_but_not_applied_in_v1",
            }
        except Exception as e:
            errors.append(str(e))

    return ToolResponse(
        result={
            "query": {
                "latitude": inp.latitude,
                "longitude": inp.longitude,
                "radius_nm_requested": float(inp.radius_nm or 5),
                "flight_datetime": inp.flight_datetime,
            },
            "relevance_method": "STATE_FILTER_ONLY",
            "state": state,
            "active_tfrs": tfrs,
            "tfr_count": len(tfrs),
            "status": status,
            "advisory": advisory,
        },
        meta=_tool_meta(
            sources=["FAA TFR (tfr.faa.gov export/json)", "NOAA/NWS points API (api.weather.gov)"],
            coverage=coverage,
            errors=errors,
            request_id=request_id,
        ),
    )


@app.post("/tools/generate_preflight_checklist", response_model=ToolResponse)
async def tool_generate_checklist(inp: GenerateChecklistInput) -> ToolResponse:
    """
    IMPORTANT: Do NOT splat kwargs into decide_preflight.
    Call explicitly to avoid UnrecognizedKwargsError.
    """
    request_id = str(uuid.uuid4())

    decision = decide_preflight(
        mission_type=inp.mission_type,
        airspace_data=inp.airspace_data,
        weather_data=inp.weather_data,
        tfr_data=inp.tfr_data,
    )

    result = {
        "overall_status": decision.overall_status,
        "required_actions": decision.required_actions,
        "checklist_items": decision.checklist_items,
        "rationale": decision.rationale,
        "disclaimers": decision.disclaimers,
    }

    # Extract coordinates from airspace_data for logging
    coords = inp.airspace_data.get("coordinates", {})
    lat = coords.get("lat")
    lon = coords.get("lon")

    # Best-effort: log advisory snapshot to Supabase (should NOT break response)
    if lat is not None and lon is not None:
        snapshot_payload = {
            "request_id": request_id,
            "user_id": None,  # Anonymous for Phase 1
            "timestamp_utc": utc_now_iso(),
            "location_lat": float(lat),
            "location_lon": float(lon),
            "altitude_ft": inp.airspace_data.get("altitude_ft_agl"),
            "mission_type": inp.mission_type,
            "advisory_result": decision.overall_status,
            "full_response": {
                "result": result,
                "inputs": {
                    "airspace_data": inp.airspace_data,
                    "weather_data": inp.weather_data,
                    "tfr_data": inp.tfr_data,
                },
            },
            "tool_version": VERSION,
            "source": "web",
        }
        
        snapshot_id = await _log_advisory_snapshot(snapshot_payload)
    else:
        snapshot_id = None

    meta = _tool_meta(
        sources=["Internal rules engine (packages/core/rules.py)"],
        coverage={"checklist": "generated", "supabase_snapshot": "inserted" if snapshot_id else "skipped_or_failed"},
        errors=[],
        request_id=request_id,
    )

    return ToolResponse(result=result, meta=meta)


@app.post("/tools/generate_laanc_deep_link", response_model=ToolResponse)
async def tool_generate_laanc(inp: GenerateLaancLinksInput) -> ToolResponse:
    request_id = str(uuid.uuid4())
    # Phase 1: official FAA links only; no provider names.
    return ToolResponse(
        result={
            "flight_summary": {
                "location": f"{inp.latitude}°, {inp.longitude}°",
                "altitude": f"{inp.altitude_ft_agl} feet AGL",
                "start_time": inp.start_datetime,
                "duration": f"{inp.duration_minutes} minutes",
            },
            "official_links": [
                {"name": "FAA LAANC Program", "url": "https://www.faa.gov/uas/programs_partnerships/data_exchange/laanc"},
                {"name": "FAA DroneZone", "url": "https://faadronezone-access.faa.gov/"},
            ],
            "next_steps": [
                "1. Verify the location and altitude in an FAA-approved LAANC provider.",
                "2. Request authorization for the planned time window (if eligible).",
                "3. If LAANC is unavailable, submit a request via FAA DroneZone.",
            ],
            "disclaimer": "Advisory only; this does not submit any authorization request.",
        },
        meta=_tool_meta(
            sources=["FAA public guidance (faa.gov)"],
            coverage={"links": "official_only"},
            errors=[],
            request_id=request_id,
        ),
    )