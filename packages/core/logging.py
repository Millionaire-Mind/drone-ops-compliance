import uuid
from datetime import datetime
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

def log_advisory_snapshot(
    supabase_client,
    location_lat: float,
    location_lon: float,
    altitude_ft: Optional[int],
    mission_type: Optional[str],
    advisory_result: str,  # GO | GO_WITH_CONDITIONS | NO_GO
    full_response: Dict[Any, Any],
    tool_version: str = "v1.0.0",
    source: str = "web",
    user_id: Optional[str] = None
) -> Optional[str]:
    """
    Log an advisory snapshot to Supabase.
    
    This is informational only - not a compliance record or flight log.
    Failures are logged but do not block the advisory response.
    
    Returns:
        request_id if successful, None if failed
    """
    if not supabase_client:
        logger.warning("Supabase client not initialized - skipping advisory logging")
        return None
    
    try:
        request_id = str(uuid.uuid4())
        
        snapshot = {
            "request_id": request_id,
            "user_id": user_id,  # None for anonymous
            "timestamp_utc": datetime.utcnow().isoformat() + "Z",
            "location_lat": location_lat,
            "location_lon": location_lon,
            "altitude_ft": altitude_ft,
            "mission_type": mission_type,
            "advisory_result": advisory_result,
            "full_response": full_response,
            "tool_version": tool_version,
            "source": source
        }
        
        supabase_client.table("advisory_snapshots").insert(snapshot).execute()
        
        logger.info(f"Advisory snapshot logged: {request_id}")
        return request_id
        
    except Exception as e:
        # Never block the response if logging fails
        logger.error(f"Failed to log advisory snapshot: {e}")
        return None