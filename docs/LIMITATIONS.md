\# Limitations (V1)



\## Airspace / LAANC

\- Airspace class may be UNKNOWN in some areas due to dataset ambiguity or query limitations.

\- UAS Facility Map ceilings may not be available for some points via FAA ArcGIS query. When unavailable, the tool instructs verification in an FAA-approved provider app.

\- The tool does not provide authorization to fly.



\## TFRs

\- V1 does not perform geometry-based matching between flight area and TFR boundaries.

\- V1 relevance is coarse (state-level) and must be confirmed via authoritative sources (tfr.faa.gov or approved providers).



\## Weather

\- Observations can be missing certain fields (wind/visibility/ceiling). In those cases, compliance checks are marked UNKNOWN.

\- Weather assessments are advisory only; microclimates and local conditions can differ.



\## Operational limits

\- No offline mode for authoritative data.

\- No persistent mission storage or flight log storage in V1.



