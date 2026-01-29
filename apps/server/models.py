from __future__ import annotations
from datetime import UTC, datetime
from typing import Any, Literal
from pydantic import BaseModel, Field

def utc_now_iso() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")

class ToolMeta(BaseModel):
    data_timestamp_utc: str = Field(default_factory=utc_now_iso)
    sources: list[str] = Field(default_factory=list)
    coverage: dict[str, Any] = Field(default_factory=dict)
    errors: list[str] = Field(default_factory=list)
    request_id: str | None = None

class ToolResponse(BaseModel):
    result: dict[str, Any]
    meta: ToolMeta

class CheckAirspaceInput(BaseModel):
    latitude: float = Field(..., description="Latitude in decimal degrees")
    longitude: float = Field(..., description="Longitude in decimal degrees")
    altitude_ft_agl: float = Field(..., ge=0, description="Planned altitude in feet AGL")
    flight_datetime: str = Field(
        ..., description="ISO 8601 datetime for planned flight (include timezone offset)"
    )

class AnalyzeWeatherInput(BaseModel):
    latitude: float = Field(..., description="Latitude in decimal degrees")
    longitude: float = Field(..., description="Longitude in decimal degrees")
    flight_datetime: str = Field(
        ..., description="ISO 8601 datetime for planned flight (include timezone offset)"
    )

class CheckTfrsInput(BaseModel):
    latitude: float = Field(..., description="Latitude in decimal degrees")
    longitude: float = Field(..., description="Longitude in decimal degrees")
    radius_nm: float = Field(5, gt=0, le=100, description="Search radius in nautical miles")
    flight_datetime: str = Field(
        ..., description="ISO 8601 datetime for planned flight (include timezone offset)"
    )

MissionType = Literal["recreational", "part107_commercial", "public_safety", "educational"]

class GenerateChecklistInput(BaseModel):
    mission_type: MissionType
    airspace_data: dict[str, Any]
    weather_data: dict[str, Any]
    tfr_data: dict[str, Any]

class GenerateLaancLinksInput(BaseModel):
    latitude: float
    longitude: float
    altitude_ft_agl: float = Field(..., ge=0)
    start_datetime: str = Field(..., description="ISO 8601 start time (include timezone offset)")
    duration_minutes: int = Field(..., ge=1, le=720)
    operation_description: str | None = None