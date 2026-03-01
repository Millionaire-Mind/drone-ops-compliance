import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://drone-ops-compliance.onrender.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Convert datetime-local to ISO format if needed
    let isoDatetime = body.flight_datetime;
    if (!isoDatetime.includes('T')) {
      // If it's not already ISO format, convert it
      const flightDate = new Date(isoDatetime);
      isoDatetime = flightDate.toISOString();
    }

    // Call the new unified backend endpoint
    const response = await fetch(`${BACKEND_URL}/api/preflight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: body.latitude,
        longitude: body.longitude,
        altitude_ft: body.altitude_ft_agl,
        flight_datetime: isoDatetime,
        mission_type: body.mission_type,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Backend request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the response from the unified endpoint
    // The new endpoint returns { mode, hours_until_flight, recheck_deadline, airspace, weather, tfr, checklist, meta }
    return NextResponse.json(data);

  } catch (error) {
    console.error('Preflight API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}