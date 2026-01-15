from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal

Status = Literal["GO", "GO_WITH_CONDITIONS", "NO_GO", "INSUFFICIENT_DATA"]


@dataclass
class Decision:
    overall_status: Status
    required_actions: list[str]
    checklist_items: list[dict[str, Any]]
    rationale: list[str]
    disclaimers: list[str]


DEFAULT_DISCLAIMERS = [
    "Advisory only - not legal advice and not authorization to fly.",
    "Verify requirements and obtain any needed authorizations (e.g., LAANC) via an FAA-approved provider.",
    "If any data is missing or uncertain, do not fly until you verify with authoritative sources.",
]


def _get(d: dict[str, Any], path: list[str]) -> Any | None:
    cur: Any = d
    for p in path:
        if not isinstance(cur, dict) or p not in cur:
            return None
        cur = cur[p]
    return cur


def decide_preflight(
    mission_type: str,
    airspace_data: dict[str, Any],
    weather_data: dict[str, Any],
    tfr_data: dict[str, Any],
) -> Decision:
    required_actions: list[str] = []
    checklist: list[dict[str, Any]] = []
    rationale: list[str] = []

    # -------------------------
    # Data completeness checks
    # -------------------------
    if not airspace_data or not weather_data or not tfr_data:
        return Decision(
            overall_status="INSUFFICIENT_DATA",
            required_actions=[
                "Re-run checks; if still unavailable, verify manually using authoritative sources."
            ],
            checklist_items=[
                {
                    "category": "System",
                    "item": "Critical data missing (airspace/weather/TFR)",
                    "required": True,
                    "status": "ACTION_NEEDED",
                }
            ],
            rationale=["One or more critical data inputs were missing."],
            disclaimers=DEFAULT_DISCLAIMERS,
        )

    # -------------------------
    # TFR check: hard NO-GO if RESTRICTED or UNKNOWN
    # -------------------------
    tfr_status = tfr_data.get("status")  # CLEAR | RESTRICTED | UNKNOWN
    tfr_count = int(tfr_data.get("tfr_count", 0) or 0)

    if tfr_status == "UNKNOWN":
        checklist.append(
            {
                "category": "Airspace",
                "item": "TFR status unknown (lookup failed or incomplete)",
                "required": True,
                "status": "BLOCKING",
            }
        )
        rationale.append("TFR status could not be verified. Fail-safe: do not fly until verified.")
        return Decision(
            overall_status="NO_GO",
            required_actions=[
                "Do not fly until you verify TFR status at tfr.faa.gov (and/or other authoritative sources)."
            ],
            checklist_items=checklist,
            rationale=rationale,
            disclaimers=DEFAULT_DISCLAIMERS,
        )

    if tfr_status == "RESTRICTED" or tfr_count > 0:
        checklist.append(
            {
                "category": "Airspace",
                "item": f"Potentially active/relevant TFR(s) detected: {tfr_count}",
                "required": True,
                "status": "BLOCKING",
            }
        )
        rationale.append("TFRs were detected as potentially relevant for the planned area/time.")
        return Decision(
            overall_status="NO_GO",
            required_actions=[
                "Do not fly. Verify exact boundaries/times at tfr.faa.gov and reschedule or relocate."
            ],
            checklist_items=checklist,
            rationale=rationale,
            disclaimers=DEFAULT_DISCLAIMERS,
        )

    checklist.append(
        {
            "category": "Airspace",
            "item": "TFRs checked (no matches found by this checker)",
            "required": True,
            "status": "OK",
        }
    )

    # -------------------------
    # Weather checks (Part 107-style)
    # Conservative + transparent:
    # If unknown, proceed with conditions rather than hard GO.
    # -------------------------
    vis_ok = _get(weather_data, ["part107_compliance", "visibility_ok"])
    cloud_ok = _get(weather_data, ["part107_compliance", "cloud_clearance_ok"])

    if vis_ok is False:
        checklist.append(
            {
                "category": "Weather",
                "item": "Visibility below minimum threshold used by this checker",
                "required": True,
                "status": "BLOCKING",
            }
        )
        rationale.append("Visibility check failed based on available observation data.")
        return Decision(
            overall_status="NO_GO",
            required_actions=["Do not fly until visibility meets requirements and conditions improve."],
            checklist_items=checklist,
            rationale=rationale,
            disclaimers=DEFAULT_DISCLAIMERS,
        )

    if cloud_ok is False:
        checklist.append(
            {
                "category": "Weather",
                "item": "Cloud clearance/ceiling check failed based on available observation data",
                "required": True,
                "status": "BLOCKING",
            }
        )
        rationale.append("Cloud clearance/ceiling check failed based on available observation data.")
        return Decision(
            overall_status="NO_GO",
            required_actions=["Do not fly until cloud clearance/ceiling meets requirements."],
            checklist_items=checklist,
            rationale=rationale,
            disclaimers=DEFAULT_DISCLAIMERS,
        )

    if vis_ok is None or cloud_ok is None:
        checklist.append(
            {
                "category": "Weather",
                "item": "Some weather fields were unavailable; verify locally before flight",
                "required": True,
                "status": "ACTION_NEEDED",
            }
        )
        rationale.append("Some weather compliance checks are unknown due to missing observation fields.")

    # -------------------------
    # Airspace / LAANC logic
    # -------------------------
    laanc_required = airspace_data.get("laanc_required")
    laanc_available = airspace_data.get("laanc_available")
    airspace_class = airspace_data.get("airspace_class", "Unknown")

    checklist.append(
        {
            "category": "Airspace",
            "item": f"Airspace class: {airspace_class}",
            "required": True,
            "status": "OK" if airspace_class != "Unknown" else "UNKNOWN",
        }
    )

    if laanc_required is True:
        required_actions.append(
            "Obtain LAANC authorization via an FAA-approved LAANC provider before flight."
        )
        checklist.append(
            {
                "category": "Regulatory",
                "item": "LAANC authorization required for controlled airspace",
                "required": True,
                "status": "ACTION_NEEDED",
            }
        )
        rationale.append("Controlled airspace indicates authorization is required prior to flight.")

        if laanc_available is False:
            rationale.append("LAANC availability reported as unavailable.")
            return Decision(
                overall_status="NO_GO",
                required_actions=required_actions
                + ["LAANC not available via this checker; verify in provider app and/or relocate."],
                checklist_items=checklist,
                rationale=rationale,
                disclaimers=DEFAULT_DISCLAIMERS,
            )

        return Decision(
            overall_status="GO_WITH_CONDITIONS",
            required_actions=required_actions,
            checklist_items=checklist,
            rationale=rationale,
            disclaimers=DEFAULT_DISCLAIMERS,
        )

    if laanc_required is None:
        required_actions.append(
            "LAANC requirement unclear; verify airspace status in an FAA-approved provider app before flight."
        )
        checklist.append(
            {
                "category": "Regulatory",
                "item": "LAANC requirement unknown",
                "required": True,
                "status": "ACTION_NEEDED",
            }
        )
        rationale.append("Airspace authorization requirement could not be determined from available data.")
        return Decision(
            overall_status="GO_WITH_CONDITIONS",
            required_actions=required_actions,
            checklist_items=checklist,
            rationale=rationale,
            disclaimers=DEFAULT_DISCLAIMERS,
        )

    # If we reach here: no TFRs, weather not blocking, LAANC not required
    rationale.append("No TFR matches found and weather checks did not indicate blocking conditions.")
    return Decision(
        overall_status="GO",
        required_actions=["Proceed only if you maintain VLOS and comply with all applicable rules."],
        checklist_items=checklist,
        rationale=rationale,
        disclaimers=DEFAULT_DISCLAIMERS,
    )
