import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://drone-ops-compliance.onrender.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Frontend received:', body);
    
    // Convert datetime-local to full ISO format with timezone
    let isoDatetime = body.flight_datetime;
    
    // If it's datetime-local format (2026-03-04T14:00), convert to ISO with timezone
    if (!isoDatetime.includes('Z') && !isoDatetime.includes('+')) {
      const flightDate = new Date(isoDatetime);
      isoDatetime = flightDate.toISOString();
    }

    const backendPayload = {
      latitude: body.latitude,
      longitude: body.longitude,
      altitude_ft: body.altitude_ft_agl,
      flight_datetime: isoDatetime,
      mission_type: body.mission_type,
    };

    console.log('Sending to backend:', backendPayload);
    console.log('Backend URL:', `${BACKEND_URL}/api/preflight`);

    const response = await fetch(`${BACKEND_URL}/api/preflight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      return NextResponse.json(
        { error: errorData.error || 'Backend request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend success, returning data');
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Preflight API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}