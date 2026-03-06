import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://drone-ops-compliance.onrender.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Frontend received:', body);
    
    // IMPORTANT: Keep local time, just add timezone offset
    // datetime-local gives us "2026-03-04T14:00" (no timezone)
    // We need to append the local timezone offset to preserve the time
    let isoDatetime = body.flight_datetime;
    
    if (!isoDatetime.includes('Z') && !isoDatetime.includes('+')) {
      // Get the timezone offset in minutes and convert to ±HH:MM format
      const date = new Date(isoDatetime);
      const tzOffset = -date.getTimezoneOffset(); // Minutes, reversed
      const sign = tzOffset >= 0 ? '+' : '-';
      const hours = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, '0');
      const minutes = String(Math.abs(tzOffset) % 60).padStart(2, '0');
      
      // Append timezone: "2026-03-04T14:00-08:00" (PST)
      isoDatetime = `${isoDatetime}:00${sign}${hours}:${minutes}`;
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

      // Extract message from all known FastAPI error shapes:
      // { error: "..." }            — custom validation errors
      // { detail: "..." }           — FastAPI HTTP exceptions
      // { detail: [{msg: "..."}] }  — Pydantic 422 validation errors
      // { result: { message: "..." }, meta: {...} } — unhandled exception handler
      let message: string | undefined;
      if (typeof errorData.error === 'string') {
        message = errorData.error;
      } else if (typeof errorData.detail === 'string') {
        message = errorData.detail;
      } else if (Array.isArray(errorData.detail) && errorData.detail[0]?.msg) {
        message = `Validation error: ${errorData.detail[0].msg}`;
      } else if (typeof errorData.result?.message === 'string') {
        message = errorData.result.message;
      }

      return NextResponse.json(
        { error: message || `Backend error (${response.status})` },
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