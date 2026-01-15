\# Safety



\## Summary

Drone Ops \& Compliance is an advisory preflight checker. It does not provide legal advice and does not grant authorization to fly.



The system is designed to be conservative:

\- If critical data cannot be verified (e.g., TFR status UNKNOWN), the recommendation becomes NO-GO.

\- If airspace classification is uncertain, the output becomes GO\_WITH\_CONDITIONS and directs the user to verify in FAA-approved tools/providers.



\## Fail-safe behaviors

\### TFRs

\- If the TFR feed cannot be parsed or fetched: status = UNKNOWN and the checklist returns NO-GO.

\- V1 uses a coarse relevance filter (state-level) and always instructs the user to confirm exact boundaries/times.



\### Airspace / LAANC

\- If controlled airspace is detected (including conservative heuristics like Mode C veil naming), LAANC authorization is required.

\- If classification is uncertain, the tool does not claim a class letter and instructs verification in an FAA-approved provider app.



\### Weather

\- If observation fields are missing (wind/visibility/ceiling), compliance fields are set to UNKNOWN.

\- The tool provides advisory assessments only.



\## Non-goals for V1

\- No automated LAANC submission (links/instructions only)

\- No mission execution, navigation, flight control, or autonomous routing

\- No geometry-accurate TFR intersection (V1 relevance is coarse)



\## User messaging requirements

\- Always include disclaimers that the output is advisory only.

\- Always direct the user to authoritative sources for final verification.



\## Abuse prevention

\- Rate limit endpoints in production.

\- Do not accept full conversation history.

\- Do not store precise location history beyond transient request processing.



