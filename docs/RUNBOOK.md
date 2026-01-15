\# Runbook



\## Local development (Windows PowerShell)



From repo root:

1\) Activate venv

&nbsp;  - .\\.venv\\Scripts\\Activate.ps1



2\) Run server

&nbsp;  - python -m uvicorn apps.server.main:app --reload --host 127.0.0.1 --port 8000



3\) Health check

&nbsp;  - Invoke-RestMethod http://127.0.0.1:8000/healthz | ConvertTo-Json -Depth 5



\## Common tests

\- check\_airspace

\- analyze\_weather\_conditions

\- check\_tfrs

\- generate\_preflight\_checklist



\## Troubleshooting

\- If localhost calls fail: confirm uvicorn window is running and port 8000 is not in use.

\- If FAA/NOAA calls fail: re-try; external services can be temporarily unavailable.

\- If tool returns UNKNOWN: follow the advisory to verify manually.



\## Production deployment (Render)

\- Start command:

&nbsp; python -m uvicorn apps.server.main:app --host 0.0.0.0 --port $PORT

\- Health check:

&nbsp; /healthz

\- Ensure TLS is enabled (Render provides this automatically).

\- Configure log retention to minimum needed.



\## Security

\- Do not hardcode API keys.

\- Add basic rate limiting / request size limits in production.



