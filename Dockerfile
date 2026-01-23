FROM python:3.12-slim

# Prevents Python from writing .pyc files and enables unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install runtime deps
COPY pyproject.toml /app/pyproject.toml
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir fastapi uvicorn httpx pydantic supabase

# Copy app
COPY . /app

# Render provides $PORT
CMD ["sh", "-c", "python -m uvicorn apps.server.main:app --host 0.0.0.0 --port ${PORT:-8000}"]