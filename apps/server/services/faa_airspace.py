from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

import httpx

from .airport_database import classify_by_airport_proximity

DEFAULT_UA = "drone-ops-compliance/0.1 (contact: replace-before-prod)"

# FAA UAS Data Delivery System (ArcGIS) layers
UASFM_LAYER_URL = "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/FAA_UAS_FacilityMap_Data_V5/FeatureServer/0/query"
CLASS_AIRSPACE_LAYER_URL = (
    "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Class_Airspace/FeatureServer/0/query"
)


def utc_now_iso() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


@dataclass
class AirspaceResult:
    airspace_class: str
    airspace_name: str | None
    laanc_required: bool | None
    laanc_available: bool | None
    max_altitude_ft: int | None
    facility: str | None
    restrictions: list[str]
    raw: dict[str, Any]
    debug: dict[str, Any]


def _arcgis_point_geometry(latitude: float, longitude: float, wkid: int = 4326) -> str:
    return f'{{"x":{longitude},"y":{latitude},"spatialReference":{{"wkid":{wkid}}}}}'


async def _arcgis_query(
    url: str,
    latitude: float,
    longitude: float,
    out_fields: str,
    in_sr: int = 4326,
    out_sr: int = 4326,
    spatial_rel: str = "esriSpatialRelIntersects",
    distance_m: int | None = None,
    timeout_s: float = 15.0,
    user_agent: str = DEFAULT_UA,
) -> dict[str, Any]:
    headers = {"User-Agent": user_agent}
    params: dict[str, Any] = {
        "f": "json",
        "where": "1=1",
        "geometryType": "esriGeometryPoint",
        "geometry": _arcgis_point_geometry(latitude, longitude, wkid=in_sr),
        "inSR": str(in_sr),
        "outSR": str(out_sr),
        "spatialRel": spatial_rel,
        "outFields": out_fields,
        "returnGeometry": "false",
        "resultRecordCount": "10",
    }

    # Optional distance-based query (used when intersects returns 0)
    if distance_m is not None:
        params["distance"] = str(int(distance_m))
        params["units"] = "esriSRUnit_Meter"

    async with httpx.AsyncClient(timeout=timeout_s, headers=headers, follow_redirects=True) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()


def _pick_best_feature(features: list[dict[str, Any]]) -> dict[str, Any] | None:
    if not features:
        return None
    if len(features) == 1:
        return features[0]
    with_name = [f for f in features if isinstance((f.get("attributes") or {}).get("NAME"), str)]
    return with_name[0] if with_name else features[0]


def _normalize_class_letter(value: str | None) -> str | None:
    if not value or not isinstance(value, str):
        return None
    v = value.strip().upper()
    if v in {"B", "C", "D", "E", "G"}:
        return v
    for letter in ["B", "C", "D", "E", "G"]:
        if f"CLASS {letter}" in v or v.endswith(f" {letter}"):
            return letter
    return None


def _is_surface_area(attrs: dict[str, Any]) -> bool:
    lower_desc = attrs.get("LOWER_DESC")
    lower_code = attrs.get("LOWER_CODE")
    lower_val = attrs.get("LOWER_VAL")

    for v in [lower_desc, lower_code]:
        if isinstance(v, str) and "SFC" in v.upper():
            return True

    if isinstance(lower_val, (int, float)) and float(lower_val) == 0.0:
        return True

    return False


def _extract_uasfm_ceiling(attrs: dict[str, Any]) -> int | None:
    for key in ["CEILING", "CEILING_FT", "MAX_ALT", "MAX_ALT_FT"]:
        val = attrs.get(key)
        if isinstance(val, int):
            ceiling = val
        elif isinstance(val, float):
            ceiling = int(val)
        else:
            continue
        
        # Sanity check: UASFM ceilings should be 0-500ft typically
        # If >1000ft, it's likely wrong data (aviation altitude, not UAS ceiling)
        if ceiling > 1000:
            return None
        
        return ceiling
    
    return None

def _extract_laanc_available_from_uasfm(attrs: dict[str, Any]) -> bool | None:
    found_any = False
    any_ready = False
    for i in range(1, 6):
        key = f"APT{i}_LAANC"
        val = attrs.get(key)
        if val is None:
            continue
        found_any = True
        try:
            if int(val) == 1:
                any_ready = True
        except Exception:
            pass
    if not found_any:
        return None
    return any_ready


def _extract_primary_facility_from_uasfm(attrs: dict[str, Any]) -> str | None:
    name = attrs.get("APT1_NAME")
    if isinstance(name, str) and name.strip():
        return name.strip()
    icao = attrs.get("APT1_ICAO")
    if isinstance(icao, str) and icao.strip():
        return icao.strip()
    return None


def _name_implies_controlled(airspace_name: str | None) -> bool:
    if not airspace_name or not isinstance(airspace_name, str):
        return False
    n = airspace_name.upper()
    return ("MODE C" in n) or ("MODE-C" in n) or ("MODEC" in n)


async def analyze_airspace(latitude: float, longitude: float, altitude_ft_agl: float) -> AirspaceResult:
    raw: dict[str, Any] = {"class_airspace": None, "uasfm": None}
    debug: dict[str, Any] = {
        "class_features_count": 0,
        "uasfm_features_count": 0,
        "class_letter_found": False,
        "fallback_used": "none",
        "uasfm_query_mode": "intersects",
    }

    restrictions: list[str] = []
    airspace_name: str | None = None

    # 1) Class Airspace query (best-effort)
    class_out_fields = "CLASS,NAME,IDENT,ICAO_ID,LOWER_DESC,LOWER_VAL,LOWER_UOM,LOWER_CODE,UPPER_DESC,UPPER_VAL,UPPER_UOM,UPPER_CODE"
    class_resp = await _arcgis_query(
        CLASS_AIRSPACE_LAYER_URL,
        latitude=latitude,
        longitude=longitude,
        out_fields=class_out_fields,
        in_sr=4326,
        out_sr=4326,
    )
    raw["class_airspace"] = class_resp

    class_features = class_resp.get("features") or []
    debug["class_features_count"] = len(class_features)

    best_class_feature = _pick_best_feature(class_features)
    class_attrs = (best_class_feature or {}).get("attributes") or {}

    class_letter = _normalize_class_letter(class_attrs.get("CLASS"))
    debug["class_letter_found"] = class_letter is not None

    airspace_name = class_attrs.get("NAME") if isinstance(class_attrs.get("NAME"), str) else None

    # 2) UASFM query (intersects, then distance fallback)
    uasfm_out_fields = (
        "CEILING,CEILING_FT,MAX_ALT,MAX_ALT_FT,UNIT,MAP_EFF,LAST_EDIT,ARPT_COUNT,"
        "APT1_NAME,APT1_ICAO,APT1_LAANC,APT2_LAANC,APT3_LAANC,APT4_LAANC,APT5_LAANC,REGION"
    )

    uasfm_resp = await _arcgis_query(
        UASFM_LAYER_URL,
        latitude=latitude,
        longitude=longitude,
        out_fields=uasfm_out_fields,
        in_sr=4326,
        out_sr=4326,
        spatial_rel="esriSpatialRelIntersects",
        distance_m=None,
    )
    uasfm_features = uasfm_resp.get("features") or []

    # If we got nothing, try a nearby search (helps when boundaries are tiny or SR quirks occur)
    if len(uasfm_features) == 0:
        debug["uasfm_query_mode"] = "distance_2000m"
        uasfm_resp = await _arcgis_query(
            UASFM_LAYER_URL,
            latitude=latitude,
            longitude=longitude,
            out_fields=uasfm_out_fields,
            in_sr=4326,
            out_sr=4326,
            spatial_rel="esriSpatialRelIntersects",
            distance_m=2000,
        )
        uasfm_features = uasfm_resp.get("features") or []

    raw["uasfm"] = uasfm_resp
    debug["uasfm_features_count"] = len(uasfm_features)

    best_uasfm = _pick_best_feature(uasfm_features)
    uasfm_attrs = (best_uasfm or {}).get("attributes") or {}
    uasfm_feature_exists = best_uasfm is not None

    uasfm_ceiling = _extract_uasfm_ceiling(uasfm_attrs)
    laanc_available = _extract_laanc_available_from_uasfm(uasfm_attrs)
    facility = _extract_primary_facility_from_uasfm(uasfm_attrs) or airspace_name

    # 3) Determine LAANC requirement
    laanc_required: bool | None = None

    if class_letter in ["B", "C", "D"]:
        laanc_required = True
    elif class_letter == "E":
        laanc_required = True if _is_surface_area(class_attrs) else False
    elif class_letter == "G":
        laanc_required = False
    else:
        laanc_required = None

    # 4) Fallbacks (ordered, conservative)
    if laanc_required is None and uasfm_feature_exists:
        laanc_required = True
        debug["fallback_used"] = "uasfm_feature_or_nearby"

    if laanc_required is None and _name_implies_controlled(airspace_name):
        laanc_required = True
        debug["fallback_used"] = "mode_c_name"

    # 4b) Airport proximity fallback (if still unknown)
    if laanc_required is None or class_letter is None:
        (
            prox_class,
            prox_laanc_req,
            prox_ceiling,
            prox_facility,
            prox_distance_nm,
        ) = classify_by_airport_proximity(latitude, longitude, altitude_ft_agl)
        
        if prox_class is not None:
            if class_letter is None:
                airspace_class = prox_class
                class_letter = prox_class.replace("Class ", "")  # Extract letter
            if laanc_required is None:
                laanc_required = prox_laanc_req
            if uasfm_ceiling is None:
                uasfm_ceiling = prox_ceiling
            if facility is None:
                facility = prox_facility
            
            debug["fallback_used"] = "airport_proximity"
            debug["airport_proximity_distance_nm"] = round(prox_distance_nm, 2) if prox_distance_nm else None
            debug["airport_proximity_facility"] = prox_facility

    # 5) Display class string
    if class_letter:
        airspace_class = f"Class {class_letter}"
    else:
        airspace_class = "Controlled (heuristic)" if laanc_required is True else "Unknown"

    # 6) Restrictions
    if laanc_required is True:
        restrictions.append(
            "Controlled airspace indicated: authorization required prior to flight (often via LAANC)."
        )
        if airspace_name:
            restrictions.append(f"Airspace context name: {airspace_name}.")
        if uasfm_ceiling is not None:
            restrictions.append(f"UAS Facility Map (UASFM) ceiling guideline: {uasfm_ceiling} ft AGL.")
            try:
                if float(altitude_ft_agl) > float(uasfm_ceiling):
                    restrictions.append(
                        "Planned altitude exceeds UASFM value; approval may require additional coordination (not instant)."
                    )
            except Exception:
                pass
        else:
            restrictions.append("UASFM ceiling not available; verify limits in an FAA-approved provider app.")
    elif laanc_required is False:
        restrictions.append(
            "No controlled airspace indicated by this checker; still verify local restrictions and TFRs."
        )
    else:
        restrictions.append(
            "Airspace could not be determined confidently; verify in an FAA-approved provider app."
        )

    return AirspaceResult(
        airspace_class=airspace_class,
        airspace_name=airspace_name,
        laanc_required=laanc_required,
        laanc_available=laanc_available,
        max_altitude_ft=uasfm_ceiling,
        facility=facility,
        restrictions=restrictions,
        raw=raw,
        debug=debug,
    )