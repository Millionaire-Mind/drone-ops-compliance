from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal


Status = Literal["GO", "GO_WITH_CONDITIONS", "NO_GO"]


@dataclass
class Decision:
    overall_status: Status
    required_actions: list[str]
    checklist_items: list[dict[str, Any]]
    rationale: list[str]
    disclaimers: list[str]


def _get(d: dict[str, Any], path: list[str]) -> Any | None:
    cur: Any = d
    for p in path:
        if not isinstance(cur, dict):
            return None
        cur = cur.get(p)
    return cur


def decide_preflight(
    mission_type: str,
    airspace_data: dict[str, Any],
    weather_data: dict[str, Any],
    tfr_data: dict[str, Any],
) -> Decision:
    """
    Phase 1: conservative advisory decision support.

    IMPORTANT:
    - Advisory only; never claims authorization.
    - If anything critical is missing/unknown, downgrade to GO_WITH_CONDITIONS or NO_GO.
    """

    required_actions: list[str] = []
    checklist: list[dict[str, Any]] = []
    rationale: list[str] = []

    disclaimers = [
        "Advisory only - not legal advice and not authorization to fly.",
        "Verify requirements and obtain any needed authorizations (e.g., LAANC) via an FAA-approved provider.",
        "If any data is missing or uncertain, do not fly until you verify with authoritative sources.",
    ]

    # -------------------------
    # TFR assessment (coarse)
    # -------------------------
    tfr_status = (tfr_data.get("status") or "UNKNOWN").upper()
    if tfr_status == "CLEAR":
        checklist.append(
            {
                "category": "Airspace",
                "item": "TFRs checked (no matches found by this checker)",
                "required": True,
                "status": "OK",
            }
        )
    elif tfr_status == "DO_NOT_FLY":
        checklist.append(
            {
                "category": "Airspace",
                "item": "TFR indicates restriction in effect",
                "required": True,
                "status": "ACTION_NEEDED",
            }
        )
        rationale.append("TFR restriction indicated. Do not fly until verified and resolved.")
        required_actions.append("Verify TFR boundaries/timing via official FAA sources before any operation.")
    else:
        checklist.append(
            {
                "category": "Airspace",
                "item": "TFR status unknown (verification required)",
                "required": True,
                "status": "UNKNOWN",
            }
        )
        rationale.append("TFR status could not be determined reliably.")

    # -------------------------
    # Airspace / LAANC assessment
    # -------------------------
    airspace_class = str(airspace_data.get("airspace_class") or "Unknown")
    laanc_required = airspace_data.get("laanc_required")

    checklist.append(
        {
            "category": "Airspace",
            "item": f"Airspace class: {airspace_class}",
            "required": True,
            "status": "OK" if airspace_class.lower() != "unknown" else "UNKNOWN",
        }
    )

    if laanc_required is True:
        checklist.append(
            {
                "category": "Regulatory",
                "item": "LAANC authorization required for controlled airspace",
                "required": True,
                "status": "ACTION_NEEDED",
            }
        )
        required_actions.append("Obtain LAANC authorization via an FAA-approved LAANC provider before flight.")
        rationale.append("Controlled airspace indicates authorization is required prior to flight.")
    elif laanc_required is False:
        checklist.append(
            {
                "category": "Regulatory",
                "item": "No LAANC authorization indicated by this checker",
                "required": True,
                "status": "OK",
            }
        )
    else:
        checklist.append(
            {
                "category": "Regulatory",
                "item": "LAANC requirement unknown",
                "required": True,
                "status": "ACTION_NEEDED",
            }
        )
        required_actions.append(
            "LAANC requirement unclear; verify airspace status in an FAA-approved provider before flight."
        )
        rationale.append("Airspace authorization requirement could not be determined from available data.")

    # -------------------------
    # Weather assessment (advisory)
    # -------------------------
    overall_wx = (weather_data.get("part107_compliance") or {}).get("overall_status") or "UNKNOWN"
    overall_wx = str(overall_wx).upper()

    if overall_wx == "GOOD":
        checklist.append(
            {"category": "Weather", "item": "Weather advisory check completed", "required": True, "status": "OK"}
        )
    elif overall_wx == "MARGINAL":
        checklist.append(
            {
                "category": "Weather",
                "item": "Weather appears marginal (verification required)",
                "required": True,
                "status": "ACTION_NEEDED",
            }
        )
        rationale.append("Weather advisory indicates marginal conditions.")
        required_actions.append("Verify weather at flight time using authoritative sources.")
    else:
        checklist.append(
            {
                "category": "Weather",
                "item": "Weather status unknown (verification required)",
                "required": True,
                "status": "UNKNOWN",
            }
        )
        rationale.append("Weather data was incomplete or could not be evaluated.")

    # -------------------------
    # Decide overall status (conservative)
    # -------------------------
    if tfr_status == "DO_NOT_FLY":
        overall = "NO_GO"
    elif "unknown" in [airspace_class.lower()] or laanc_required is None or overall_wx == "UNKNOWN" or tfr_status == "UNKNOWN":
        overall = "GO_WITH_CONDITIONS"
    else:
        # Still conservative: if any ACTION_NEEDED exists, downgrade.
        any_action_needed = any(item.get("status") == "ACTION_NEEDED" for item in checklist)
        overall = "GO_WITH_CONDITIONS" if any_action_needed else "GO"

    return Decision(
        overall_status=overall,
        required_actions=required_actions,
        checklist_items=checklist,
        rationale=rationale,
        disclaimers=disclaimers,
    )
