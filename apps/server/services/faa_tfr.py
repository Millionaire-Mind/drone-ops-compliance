from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from typing import Any

import httpx

# FAA TFR list export endpoint
FAA_TFR_JSON_URL = "https://tfr.faa.gov/tfr3/export/json"

# NWS points endpoint (used to map lat/lon -> US state)
NWS_POINTS_URL = "https://api.weather.gov/points/{lat:.4f},{lon:.4f}"

DEFAULT_UA = "drone-ops-compliance/0.1 (contact: replace-before-prod)"

# Simple in-memory cache to avoid hammering FAA on repeat calls.
_CACHE: dict[str, Any] = {
    "tfr_list": None,
    "tfr_list_fetched_at": None,
}


def _utc_now() -> datetime:
    return datetime.now(UTC)


def _cache_is_fresh(max_age_seconds: int) -> bool:
    fetched_at = _CACHE.get("tfr_list_fetched_at")
    if fetched_at is None:
        return False
    return (_utc_now() - fetched_at) <= timedelta(seconds=max_age_seconds)


def _extract_first_json_array(text: str) -> str:
    """
    Extract the first complete JSON array in a text blob by bracket balancing.
    Handles HTML wrappers, prefixes, and trailing content.
    Properly ignores brackets inside JSON strings.

    Returns the JSON array string, e.g. "[{...}, {...}]"
    Raises RuntimeError if none found.
    """
    s = (text or "").strip()
    start = s.find("[")
    if start == -1:
        raise RuntimeError("FAA TFR response did not contain '[' to start a JSON array.")

    in_string = False
    escape = False
    depth = 0
    end = None

    for i in range(start, len(s)):
        ch = s[i]

        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            continue

        # Not in string
        if ch == '"':
            in_string = True
            continue

        if ch == "[":
            depth += 1
            continue

        if ch == "]":
            depth -= 1
            if depth == 0:
                end = i
                break
            continue

    if end is None:
        raise RuntimeError("Found '[' but could not find a matching closing ']' for a complete JSON array.")

    return s[start : end + 1]


def _parse_faa_tfr_body_to_list(body_text: str) -> list[dict[str, Any]]:
    """
    FAA endpoint may return HTML-wrapped JSON or other non-JSON content types.
    This parser extracts the first valid JSON array and loads it.
    """
    candidate = _extract_first_json_array(body_text)
    data = json.loads(candidate)

    if not isinstance(data, list):
        raise RuntimeError("FAA TFR export returned JSON but not a list.")
    return data


async def fetch_tfr_list_json(user_agent: str = DEFAULT_UA, timeout_s: float = 20.0) -> list[dict[str, Any]]:
    """
    Fetches FAA TFR list from tfr.faa.gov export/json.

    Notes:
    - The endpoint sometimes responds with Content-Type text/html but includes JSON.
    - This function parses defensively using bracket balancing.
    - Cached briefly to reduce load.
    """
    if _cache_is_fresh(60) and isinstance(_CACHE.get("tfr_list"), list):
        return _CACHE["tfr_list"]

    headers = {
        "User-Agent": user_agent,
        "Accept": "application/json,text/html;q=0.9,*/*;q=0.8",
    }

    async with httpx.AsyncClient(timeout=timeout_s, headers=headers, follow_redirects=True) as client:
        r = await client.get(FAA_TFR_JSON_URL)
        r.raise_for_status()
        data = _parse_faa_tfr_body_to_list(r.text)

    _CACHE["tfr_list"] = data
    _CACHE["tfr_list_fetched_at"] = _utc_now()
    return data


async def determine_us_state_from_latlon(
    latitude: float, longitude: float, user_agent: str = DEFAULT_UA, timeout_s: float = 10.0
) -> str:
    """
    Uses NWS points API to determine US state for a lat/lon.
    Returns 2-letter state code (e.g., 'CA').
    """
    headers = {"User-Agent": user_agent, "Accept": "application/geo+json"}
    url = NWS_POINTS_URL.format(lat=latitude, lon=longitude)

    async with httpx.AsyncClient(timeout=timeout_s, headers=headers) as client:
        r = await client.get(url)
        r.raise_for_status()
        points = r.json()

    state = (points.get("properties") or {}).get("relativeLocation", {}).get("properties", {}).get("state")
    if not state:
        state = (points.get("properties") or {}).get("state")

    if not state or not isinstance(state, str):
        raise RuntimeError("Unable to determine US state from NWS points API for this location.")

    return state.upper()


def _normalize_tfr_item(item: dict[str, Any]) -> dict[str, Any]:
    """
    Normalize FAA export/json items without assuming a fixed schema.
    """
    notam_id = item.get("notam_id") or item.get("notam") or item.get("NOTAMID") or item.get("NOTAM")
    tfr_type = item.get("type") or item.get("TYPE")
    facility = item.get("facility") or item.get("FACILITY")
    state = item.get("state") or item.get("STATE")
    description = item.get("description") or item.get("DESCRIPTION")

    links = item.get("links") or item.get("LINKS") or {}
    details_url = links.get("details") if isinstance(links, dict) else None

    # Provide a safe canonical site link (no overpromising)
    if not details_url:
        details_url = "https://tfr.faa.gov/tfr3/"

    return {
        "id": str(notam_id) if notam_id is not None else None,
        "type": str(tfr_type) if tfr_type is not None else None,
        "facility": str(facility) if facility is not None else None,
        "state": str(state) if state is not None else None,
        "description": str(description) if description is not None else None,
        "details_url": details_url,
        "source": "tfr.faa.gov export/json",
    }


def filter_tfrs_by_state(tfr_list: list[dict[str, Any]], state: str) -> list[dict[str, Any]]:
    state = state.upper().strip()
    matches: list[dict[str, Any]] = []

    for item in tfr_list:
        normalized = _normalize_tfr_item(item)
        item_state = (normalized.get("state") or "").upper().strip()
        if item_state == state:
            matches.append(normalized)

    return matches
