\# Drone Ops \& Compliance (ChatGPT App Store Submission)



\## What it is

A read-only advisory preflight assistant for drone operations.



Given a location and flight parameters, it returns:

\- Airspace/LAANC indication (best-effort, conservative)

\- Latest nearby weather observation and compliance hints

\- Temporary Flight Restriction (TFR) advisory status

\- A generated go/no-go checklist



\## Who it is for

\- Recreational drone pilots who want a quick conservative check

\- Part 107 operators who want a preflight sanity check (not a substitute for official sources)



\## What it is NOT

\- Not legal advice

\- Not authorization to fly

\- Not flight control software

\- Not an official FAA tool



\## Safety \& compliance design

\- Conservative recommendations (NO-GO on uncertain critical restrictions)

\- Clear disclosure of limitations (coarse TFR relevance; airspace class may be unknown)

\- Requires users to verify with authoritative sources / approved providers



\## Tools exposed

\- check\_airspace (FAA datasets; conservative fallback heuristics)

\- analyze\_weather\_conditions (NOAA/NWS)

\- check\_tfrs (FAA TFR list; coarse relevance)

\- generate\_preflight\_checklist (rules engine)

\- generate\_laanc\_links (provider links + copy/paste flight details; does not submit)



\## Data \& privacy

\- Minimal inputs: lat/lon, altitude, time, mission type

\- No account required, no identity required

\- No conversation history collected



See: PRIVACY.md, SAFETY.md, SOURCES.md, LIMITATIONS.md



