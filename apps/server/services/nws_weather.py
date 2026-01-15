from __future__ import annotations

from typing import Any

import httpx

NWS_BASE = "https://api.weather.gov"

# NWS requires a descriptive User-Agent
DEFAULT_UA = "drone-ops-compliance/0.1 (contact: replace-before-prod)"


def _mps_to_knots(mps: float | None) -> float | None:
    return None if mps is None else mps * 1.9438444924406


def _meters_to_miles(m: float | None) -> float | None:
    return None if m is None else m / 1609.344


def _c_to_f(c: float | None) -> float | None:
    return None if c is None else (c * 9.0 / 5.0) + 32.0


def _meters_to_feet(m: float | None) -> float | None:
    return None if m is None else m * 3.280839895


def _parse_observation(obs: dict[str, Any], station_id: str) -> dict[str, Any]:
    p = obs.get("properties", {})

    wind_speed_kt = _mps_to_knots((p.get("windSpeed") or {}).get("value"))
    wind_gust_kt = _mps_to_knots((p.get("windGust") or {}).get("value"))
    wind_dir = (p.get("windDirection") or {}).get("value")
    visibility_sm = _meters_to_miles((p.get("visibility") or {}).get("value"))
    temp_f = _c_to_f((p.get("temperature") or {}).get("value"))

    ceiling_ft = None
    layers = p.get("cloudLayers") or []
    bases_m: list[float] = []
    for layer in layers:
        base = (layer.get("base") or {}).get("value")
        if base is not None:
            bases_m.append(base)
    if bases_m:
        ceiling_ft = _meters_to_feet(min(bases_m))

    parsed = {
        "wind_speed_kt": None if wind_speed_kt is None else round(wind_speed_kt, 1),
        "wind_gust_kt": None if wind_gust_kt is None else round(wind_gust_kt, 1),
        "wind_direction_deg": wind_dir,
        "visibility_sm": None if visibility_sm is None else round(visibility_sm, 2),
        "cloud_ceiling_ft": None if ceiling_ft is None else round(ceiling_ft),
        "temperature_f": None if temp_f is None else round(temp_f, 1),
        "conditions": p.get("textDescription") or "",
        "timestamp": p.get("timestamp"),
        "raw": {
            "nws_station_id": station_id,
            "observation_url": f"{NWS_BASE}/stations/{station_id}/observations/latest",
        },
    }
    return parsed


def _score_conditions(parsed: dict[str, Any]) -> int:
    """
    Prefer stations with more complete aviation-relevant fields.
    """
    score = 0
    if parsed.get("visibility_sm") is not None:
        score += 3
    if parsed.get("wind_speed_kt") is not None:
        score += 2
    if parsed.get("wind_direction_deg") is not None:
        score += 1
    if parsed.get("wind_gust_kt") is not None:
        score += 1
    if parsed.get("cloud_ceiling_ft") is not None:
        score += 2
    if parsed.get("temperature_f") is not None:
        score += 1
    if (parsed.get("conditions") or "").strip():
        score += 1
    if parsed.get("timestamp"):
        score += 1
    return score


async def fetch_latest_observation_by_latlon(
    latitude: float,
    longitude: float,
    user_agent: str = DEFAULT_UA,
    timeout_s: float = 10.0,
) -> tuple[dict[str, Any], dict[str, Any]]:
    """
    Picks the best available station (most complete observation) from the nearest stations list.

    Returns: (parsed_conditions, debug_meta)
    """
    headers = {"User-Agent": user_agent, "Accept": "application/geo+json"}

    async with httpx.AsyncClient(timeout=timeout_s, headers=headers) as client:
        # Step 1: Convert lat/lon to an NWS grid point
        points_url = f"{NWS_BASE}/points/{latitude:.4f},{longitude:.4f}"
        r_points = await client.get(points_url)
        r_points.raise_for_status()
        points = r_points.json()

        stations_url = points["properties"]["observationStations"]

        # Step 2: Get nearby observation stations
        r_stations = await client.get(stations_url)
        r_stations.raise_for_status()
        stations = r_stations.json()

        features = stations.get("features", [])
        if not features:
            raise RuntimeError("No observation stations returned by NWS for this location.")

        # Try the first N stations and choose the one with the best/most complete observation.
        max_candidates = min(8, len(features))
        best_parsed: dict[str, Any] | None = None
        best_station_id: str | None = None
        best_score = -1
        attempted: list[str] = []
        errors: list[str] = []

        for i in range(max_candidates):
            station_id = features[i]["properties"]["stationIdentifier"]
            attempted.append(station_id)
            latest_url = f"{NWS_BASE}/stations/{station_id}/observations/latest"
            try:
                r_obs = await client.get(latest_url)
                r_obs.raise_for_status()
                obs = r_obs.json()
                parsed = _parse_observation(obs, station_id)
                score = _score_conditions(parsed)

                if score > best_score:
                    best_score = score
                    best_parsed = parsed
                    best_station_id = station_id

                # Early exit: if we have good coverage, don't waste calls
                if best_score >= 8:
                    break

            except Exception as e:
                errors.append(f"{station_id}: {e}")

        if best_parsed is None or best_station_id is None:
            raise RuntimeError("Unable to retrieve a usable observation from nearby NWS stations.")

        debug = {
            "points_url": points_url,
            "stations_url": stations_url,
            "stations_attempted": attempted,
            "stations_errors": errors,
            "selected_station_id": best_station_id,
            "selected_score": best_score,
        }
        return best_parsed, debug


def part107_compliance_assessment(
    visibility_sm: float | None,
    cloud_ceiling_ft: float | None,
) -> dict[str, Any]:
    # Conservative and transparent checks.
    visibility_ok = None if visibility_sm is None else visibility_sm >= 3.0

    # Ceiling/cloud clearance is context-dependent; we only apply a conservative heuristic if we have a ceiling.
    cloud_ok = None if cloud_ceiling_ft is None else cloud_ceiling_ft >= 500

    overall = "UNKNOWN"
    if visibility_ok is False or cloud_ok is False:
        overall = "POOR"
    elif visibility_ok is True and (cloud_ok is True or cloud_ok is None):
        overall = "GOOD"

    return {
        "visibility_ok": visibility_ok,
        "cloud_clearance_ok": cloud_ok,
        "overall_status": overall,
        "notes": [
            "Advisory only - verify current conditions and regulatory requirements.",
            "Cloud clearance depends on operation context; conservative heuristics are used when ceiling is available.",
        ],
    }
