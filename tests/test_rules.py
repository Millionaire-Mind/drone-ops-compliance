from packages.core.rules import decide_preflight


def test_tfr_unknown_is_no_go():
    decision = decide_preflight(
        mission_type="recreational",
        airspace_data={"laanc_required": False, "airspace_class": "Class G"},
        weather_data={"part107_compliance": {"visibility_ok": True, "cloud_clearance_ok": True}},
        tfr_data={"status": "UNKNOWN", "tfr_count": 0},
    )
    assert decision.overall_status == "NO_GO"


def test_laanc_required_go_with_conditions():
    decision = decide_preflight(
        mission_type="recreational",
        airspace_data={
            "laanc_required": True,
            "airspace_class": "Controlled (heuristic)",
            "laanc_available": None,
        },
        weather_data={"part107_compliance": {"visibility_ok": True, "cloud_clearance_ok": True}},
        tfr_data={"status": "CLEAR", "tfr_count": 0},
    )
    assert decision.overall_status == "GO_WITH_CONDITIONS"
    assert any("LAANC" in a for a in decision.required_actions)


def test_class_g_go():
    decision = decide_preflight(
        mission_type="recreational",
        airspace_data={"laanc_required": False, "airspace_class": "Class G"},
        weather_data={"part107_compliance": {"visibility_ok": True, "cloud_clearance_ok": True}},
        tfr_data={"status": "CLEAR", "tfr_count": 0},
    )
    assert decision.overall_status == "GO"
