export interface PreflightCheckRequest {
  latitude: number;
  longitude: number;
  altitude_ft_agl: number;
  flight_datetime: string;
  mission_type: 'recreational' | 'part107_commercial';
}

export interface AirspaceData {
  airspace_class: string;
  facility: string | null;
  laanc_required: boolean | null;
  laanc_available: boolean | null;
  max_altitude_ft: number | null;
  restrictions: string[];
  coordinates: {
    lat: number;
    lon: number;
  };
  status: string;
}

export interface WeatherData {
  current_conditions: {
    wind_speed_kt: number | null;
    wind_gust_kt: number | null;
    wind_direction_deg: number | null;
    visibility_sm: number | null;
    cloud_ceiling_ft: number | null;
    temperature_f: number | null;
    conditions: string | null;
    timestamp: string | null;
  } | null;
  part107_compliance: {
    visibility_ok: boolean | null;
    cloud_clearance_ok: boolean | null;
    overall_status: string;
    notes: string[];
  };
  station_id: string | null;
}

export interface TFRData {
  query: {
    latitude: number;
    longitude: number;
    radius_nm_requested: number;
    flight_datetime: string;
  };
  relevance_method: string;
  state: string | null;
  active_tfrs: any[];
  tfr_count: number;
  status: string;
  advisory: string;
}

export interface ChecklistData {
  overall_status: string;
  required_actions: string[];
  checklist_items: Array<{
    category: string;
    item: string;
    required: boolean;
    status: string;
  }>;
  rationale: string[];
  disclaimers: string[];
}

export interface PreflightCheckResponse {
  airspace: AirspaceData;
  weather: WeatherData;
  tfr: TFRData;
  checklist: ChecklistData;
}

export async function runPreflightCheck(
  data: PreflightCheckRequest
): Promise<PreflightCheckResponse> {
  // Call our Next.js API route (proxy)
  const response = await fetch('/api/preflight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Preflight check failed');
  }

  return await response.json();
}