\# Architecture



\## Overview

This project is a read-only advisory tool server that exposes tool endpoints for ChatGPT to call.



\## Components

\- apps/server

&nbsp; - FastAPI app with tool endpoints

&nbsp; - services/ modules for external data fetch and parsing

\- packages/core

&nbsp; - rules engine that generates a conservative checklist and recommendation

\- docs/

&nbsp; - submission, safety, privacy, limitations, and operational guidance



\## Data flow (typical request)

1\) check\_airspace → FAA datasets (best-effort) → conservative output

2\) analyze\_weather\_conditions → NOAA/NWS observation → compliance hints

3\) check\_tfrs → FAA export/json + NWS state lookup → coarse relevance result

4\) generate\_preflight\_checklist → rules engine → GO / GO\_WITH\_CONDITIONS / NO\_GO



\## Design principles

\- Conservative defaults

\- Transparent coverage and limitations in tool outputs

\- No persistence required for V1



