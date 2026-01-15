\# Drone Ops \& Compliance



Read-only advisory preflight tools for drone operations:

\- Airspace/LAANC indication (best-effort, conservative)

\- Weather observations (NOAA/NWS)

\- TFR status (FAA TFR list; coarse relevance in V1)

\- Generated go/no-go checklist (rules engine)

\- LAANC provider links (instructions only; no submission)



\## Quickstart (Windows PowerShell)



From repo root:



```powershell

.\\.venv\\Scripts\\Activate.ps1

python -m uvicorn apps.server.main:app --reload --host 127.0.0.1 --port 8000



