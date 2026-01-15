\# Data Sources (V1)



\## NOAA / NWS Weather (api.weather.gov)

Used for:

\- Latest observation near the requested point (station selection, best-effort)



Notes:

\- Observations may be missing fields (wind/visibility/ceiling). The tool returns UNKNOWN where needed.

\- Advisory only.



\## FAA TFR (tfr.faa.gov export/json)

Used for:

\- Current list of TFR/NOTAM-style restrictions (V1 filters by US state only)



Notes:

\- V1 does not parse geometry; relevance is coarse.

\- Always verify boundaries/times at tfr.faa.gov or approved providers.



\## FAA UAS Data Delivery System (ArcGIS FeatureServer)

Used for:

\- Class\_Airspace layer: best-effort airspace context and naming

\- FAA\_UAS\_FacilityMap\_Data\_V5 layer: UAS Facility Map ceiling (when retrievable)



Notes:

\- UAS Facility Maps are informational and do not authorize flight.

\- Controlled airspace usually requires authorization (often via LAANC).



