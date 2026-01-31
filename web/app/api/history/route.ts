import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch last 50 advisory snapshots, ordered by most recent
    const { data, error } = await supabase
      .from('advisory_snapshots')
      .select('id, timestamp_utc, location_lat, location_lon, altitude_ft, mission_type, advisory_result')
      .order('timestamp_utc', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch history' },
        { status: 500 }
      );
    }

    return NextResponse.json({ snapshots: data || [] });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}