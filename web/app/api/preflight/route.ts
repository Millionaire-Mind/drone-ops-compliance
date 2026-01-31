import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || 'https://drone-ops-compliance.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude, altitude_ft_agl, flight_datetime, mission_type } = body;

    // Convert datetime-local to ISO format
    const flightDatetime = new Date(flight_datetime).toISOString();

    console.log('Calling airspace check with:', { latitude, longitude, altitude_ft_agl, flight_datetime: flightDatetime });

    // Step 1: Check airspace
    const airspaceResponse = await fetch(`${API_BASE_URL}/tools/check_airspace`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude,
        longitude,
        altitude_ft_agl,
        flight_datetime: flightDatetime,
      }),
    });

    console.log('Airspace response status:', airspaceResponse.status);

    if (!airspaceResponse.ok) {
      const errorText = await airspaceResponse.text();
      console.error('Airspace check failed:', errorText);
      throw new Error(`Airspace check failed: ${errorText}`);
    }

    const airspaceData = await airspaceResponse.json();

    // Step 2: Analyze weather
    const weatherResponse = await fetch(`${API_BASE_URL}/tools/analyze_weather_conditions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude,
        longitude,
        flight_datetime: flightDatetime,
      }),
    });

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error('Weather check failed:', errorText);
      throw new Error(`Weather check failed: ${errorText}`);
    }

    const weatherData = await weatherResponse.json();

    // Step 3: Check TFRs
    const tfrResponse = await fetch(`${API_BASE_URL}/tools/check_tfrs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude,
        longitude,
        radius_nm: 5,
        flight_datetime: flightDatetime,
      }),
    });

    if (!tfrResponse.ok) {
      const errorText = await tfrResponse.text();
      console.error('TFR check failed:', errorText);
      throw new Error(`TFR check failed: ${errorText}`);
    }

    const tfrData = await tfrResponse.json();

    // Step 4: Generate checklist
    const checklistResponse = await fetch(`${API_BASE_URL}/tools/generate_preflight_checklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mission_type,
        airspace_data: airspaceData.result,
        weather_data: weatherData.result,
        tfr_data: tfrData.result,
      }),
    });

    if (!checklistResponse.ok) {
      const errorText = await checklistResponse.text();
      console.error('Checklist generation failed:', errorText);
      throw new Error(`Checklist generation failed: ${errorText}`);
    }

    const checklistData = await checklistResponse.json();

    // Return combined results
    return NextResponse.json({
      airspace: airspaceData.result,
      weather: weatherData.result,
      tfr: tfrData.result,
      checklist: checklistData.result,
    });
  } catch (error) {
    console.error('Preflight check error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Preflight check failed. Please try again.' },
      { status: 500 }
    );
  }
}