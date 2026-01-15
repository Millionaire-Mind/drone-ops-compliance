from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from apps.server.services.faa_airspace import analyze_airspace
from apps.server.services.faa_tfr import (
    determine_us_state_from_latlon,
    fetch_tfr_list_json,
    filter_tfrs_by_state,
)
from apps.server.services.nws_weather import (
    fetch_latest_observation_by_latlon,
    part107_compliance_assessment,
)
from packages.core.rules import decide_preflight

from .models import (
    AnalyzeWeatherInput,
    CheckAirspaceInput,
    CheckTfrsInput,
    GenerateChecklistInput,
    GenerateLaancLinksInput,
    ToolMeta,
    ToolResponse,
)

APP_NAME = "Drone Ops & Compliance Tool Server"

app = FastAPI(
    title=APP_NAME,
    version="0.5.0",
    description="Read-only advisory tools for drone preflight checks (airspace, weather, TFRs).",
)


def utc_now_iso() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


@app.get("/healthz")
def healthz() -> dict[str, Any]:
    return {"ok": True, "service": APP_NAME, "timestamp_utc": utc_now_iso()}


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["x-request-id"] = request_id
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "result": {},
            "meta": {
                "data_timestamp_utc": utc_now_iso(),
                "sources": [],
                "coverage": {},
                "errors": ["Internal error"],
                "request_id": getattr(request.state, "request_id", None),
            },
        },
    )


# ----------------------------
# TOOL: check_airspace
# ----------------------------
@app.post("/tools/check_airspace", response_model=ToolResponse)
async def check_airspace(payload: CheckAirspaceInput, request: Request):
    try:
        analysis = await analyze_airspace(
            latitude=payload.latitude,
            longitude=payload.longitude,
            altitude_ft_agl=payload.altitude_ft_agl,
        )

        if analysis.laanc_required is True:
            status = "AUTHORIZATION_REQUIRED"
        elif analysis.laanc_required is False:
            status = "CLEAR"
        else:
            status = "UNKNOWN"

        result = {
            "airspace_class": analysis.airspace_class,
            "facility": analysis.facility,
            "laanc_required": analysis.laanc_required,
            "laanc_available": analysis.laanc_available,
            "max_altitude_ft": analysis.max_altitude_ft,
            "restrictions": analysis.restrictions,
            "coordinates": {"lat": payload.latitude, "lon": payload.longitude},
            "status": status,
        }

        meta = ToolMeta(
            sources=[
                "FAA UAS Data Delivery System (ArcGIS) - Class_Airspace",
                "FAA UAS Data Delivery System (ArcGIS) - UAS Facility Map Data (UASFM)",
            ],
            coverage={
                "airspace_class_method": "faa_class_airspace_polygon_intersects_point",
                "uasfm_method": "faa_uasfm_polygon_intersects_point_or_distance_fallback",
                "debug_class_features_count": str(analysis.debug.get("class_features_count")),
                "debug_uasfm_features_count": str(analysis.debug.get("uasfm_features_count")),
                "debug_class_letter_found": str(analysis.debug.get("class_letter_found")),
                "debug_fallback_used": str(analysis.debug.get("fallback_used")),
                "debug_uasfm_query_mode": str(analysis.debug.get("uasfm_query_mode")),
            },
            errors=[],
            request_id=getattr(request.state, "request_id", None),
        )
        return ToolResponse(result=result, meta=meta)

    except Exception as e:
        result = {
            "airspace_class": "Unknown",
            "facility": None,
            "laanc_required": None,
            "laanc_available": None,
            "max_altitude_ft": None,
            "restrictions": ["Airspace lookup failed; verify in an FAA-approved provider app before flight."],
            "coordinates": {"lat": payload.latitude, "lon": payload.longitude},
            "status": "UNKNOWN",
        }
        meta = ToolMeta(
            sources=[
                "FAA UAS Data Delivery System (ArcGIS) - Class_Airspace",
                "FAA UAS Data Delivery System (ArcGIS) - UAS Facility Map Data (UASFM)",
            ],
            coverage={"airspace": "attempted"},
            errors=[str(e)],
            request_id=getattr(request.state, "request_id", None),
        )
        return ToolResponse(result=result, meta=meta)


# ----------------------------
# TOOL: analyze_weather_conditions
# ----------------------------
@app.post("/tools/analyze_weather_conditions", response_model=ToolResponse)
async def analyze_weather_conditions(payload: AnalyzeWeatherInput, request: Request):
    try:
        parsed, debug = await fetch_latest_observation_by_latlon(payload.latitude, payload.longitude)

        compliance = part107_compliance_assessment(
            visibility_sm=parsed.get("visibility_sm"),
            cloud_ceiling_ft=parsed.get("cloud_ceiling_ft"),
        )

        result = {
            "current_conditions": {
                "wind_speed_kt": parsed.get("wind_speed_kt"),
                "wind_gust_kt": parsed.get("wind_gust_kt"),
                "wind_direction_deg": parsed.get("wind_direction_deg"),
                "visibility_sm": parsed.get("visibility_sm"),
                "cloud_ceiling_ft": parsed.get("cloud_ceiling_ft"),
                "temperature_f": parsed.get("temperature_f"),
                "conditions": parsed.get("conditions"),
                "timestamp": parsed.get("timestamp"),
                "raw_source": parsed.get("raw"),
            },
            "part107_compliance": compliance,
            "station_id": parsed.get("raw", {}).get("nws_station_id"),
        }

        meta = ToolMeta(
            sources=["NOAA/NWS API (api.weather.gov)"],
            coverage={
                "weather": "latest_observation",
                "station_selection": "best_of_nearest_stations",
                "selected_station_id": str(debug.get("selected_station_id")),
                "stations_attempted": ", ".join(debug.get("stations_attempted", [])),
                "selected_score": str(debug.get("selected_score")),
            },
            errors=[],
            request_id=getattr(request.state, "request_id", None),
        )
        return ToolResponse(result=result, meta=meta)

    except Exception as e:
        meta = ToolMeta(
            sources=["NOAA/NWS API (api.weather.gov)"],
            coverage={"weather": "attempted"},
            errors=[str(e)],
            request_id=getattr(request.state, "request_id", None),
        )
        result = {
            "current_conditions": None,
            "part107_compliance": {
                "visibility_ok": None,
                "cloud_clearance_ok": None,
                "overall_status": "UNKNOWN",
                "notes": ["Weather lookup failed; verify manually before flight."],
            },
            "station_id": None,
        }
        return ToolResponse(result=result, meta=meta)


# ----------------------------
# TOOL: check_tfrs
# ----------------------------
@app.post("/tools/check_tfrs", response_model=ToolResponse)
async def check_tfrs(payload: CheckTfrsInput, request: Request):
    try:
        state = await determine_us_state_from_latlon(payload.latitude, payload.longitude)
        tfr_list = await fetch_tfr_list_json()
        matches = filter_tfrs_by_state(tfr_list, state)

        status = "CLEAR" if len(matches) == 0 else "RESTRICTED"

        result = {
            "query": {
                "latitude": payload.latitude,
                "longitude": payload.longitude,
                "radius_nm_requested": payload.radius_nm,
                "flight_datetime": payload.flight_datetime,
            },
            "relevance_method": "STATE_FILTER_ONLY",
            "state": state,
            "active_tfrs": matches,
            "tfr_count": len(matches),
            "status": status,
            "advisory": (
                "This check uses a state-level filter. Verify exact TFR boundaries and timing at tfr.faa.gov "
                "or an FAA-approved provider before flight."
            ),
        }

        meta = ToolMeta(
            sources=["FAA TFR (tfr.faa.gov export/json)", "NOAA/NWS points API (api.weather.gov)"],
            coverage={
                "tfr": "faa_export_json",
                "relevance": "state_filter_only_no_geometry",
                "radius_nm": "accepted_but_not_applied_in_v1",
            },
            errors=[],
            request_id=getattr(request.state, "request_id", None),
        )
        return ToolResponse(result=result, meta=meta)

    except Exception as e:
        result = {
            "query": {
                "latitude": payload.latitude,
                "longitude": payload.longitude,
                "radius_nm_requested": payload.radius_nm,
                "flight_datetime": payload.flight_datetime,
            },
            "relevance_method": "STATE_FILTER_ONLY",
            "state": None,
            "active_tfrs": [],
            "tfr_count": 0,
            "status": "UNKNOWN",
            "advisory": "TFR lookup failed. Verify manually at tfr.faa.gov before flight.",
        }
        meta = ToolMeta(
            sources=["FAA TFR (tfr.faa.gov export/json)", "NOAA/NWS points API (api.weather.gov)"],
            coverage={"tfr": "attempted"},
            errors=[str(e)],
            request_id=getattr(request.state, "request_id", None),
        )
        return ToolResponse(result=result, meta=meta)


# ----------------------------
# TOOL: generate_preflight_checklist
# ----------------------------
@app.post("/tools/generate_preflight_checklist", response_model=ToolResponse)
def generate_preflight_checklist(payload: GenerateChecklistInput, request: Request):
    decision = decide_preflight(
        mission_type=payload.mission_type,
        airspace_data=payload.airspace_data,
        weather_data=payload.weather_data,
        tfr_data=payload.tfr_data,
    )

    result = {
        "overall_status": decision.overall_status,
        "required_actions": decision.required_actions,
        "checklist_items": decision.checklist_items,
        "rationale": decision.rationale,
        "disclaimers": decision.disclaimers,
    }
    meta = ToolMeta(
        sources=["Internal rules engine (packages/core/rules.py)"],
        coverage={"checklist": "generated"},
        errors=[],
        request_id=getattr(request.state, "request_id", None),
    )
    return ToolResponse(result=result, meta=meta)


# ----------------------------
# TOOL: generate_laanc_links
# ----------------------------
@app.post("/tools/generate_laanc_links", response_model=ToolResponse)
def generate_laanc_links(payload: GenerateLaancLinksInput, request: Request):
    lat = payload.latitude
    lon = payload.longitude
    alt = payload.altitude_ft_agl

    flight_details_block = (
        f"Location: {lat:.6f}, {lon:.6f}\n"
        f"Altitude: {alt:.0f} ft AGL\n"
        f"Start: {payload.start_datetime}\n"
        f"Duration: {payload.duration_minutes} minutes\n"
        + (f"Notes: {payload.operation_description}\n" if payload.operation_description else "")
    )

    result = {
        "flight_summary": {
            "location": f"{lat:.6f}, {lon:.6f}",
            "altitude_ft_agl": alt,
            "start_datetime": payload.start_datetime,
            "duration_minutes": payload.duration_minutes,
        },
        "providers": [
            {"name": "Aloft Air Control", "url": "https://www.aloft.ai/air-control/", "primary": True},
            {"name": "Airspace Link", "url": "https://airspacelink.com/", "primary": False},
            {"name": "AirHub", "url": "https://www.airhub.com/", "primary": False},
        ],
        "prerequisites": [
            {"item": "FAA registration (if required)", "required": True},
            {"item": "Part 107 certificate (if commercial operation)", "required": False},
        ],
        "next_steps": [
            "Open an FAA-approved LAANC provider (one of the links above).",
            "Enter the flight details (copy/paste block below).",
            "Submit the authorization request in the provider app and wait for the provider’s response.",
        ],
        "copy_paste_flight_details": flight_details_block,
        "disclaimer": "This tool does not submit LAANC requests. It provides links and instructions only.",
    }
    meta = ToolMeta(
        sources=["Provider public websites (links only)"],
        coverage={"laanc": "links_and_instructions_only"},
        errors=[],
        request_id=getattr(request.state, "request_id", None),
    )
    return ToolResponse(result=result, meta=meta)
