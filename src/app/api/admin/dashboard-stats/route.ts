import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [[{ totalCandidates }]]: any = await pool.query('SELECT COUNT(*) AS totalCandidates FROM candidates');
    const [[{ allocatedSeats }]]: any = await pool.query('SELECT COUNT(*) AS allocatedSeats FROM seat_allocations');
    const [[{ availableSeats }]]: any = await pool.query('SELECT SUM(available_seats) AS availableSeats FROM courses');
    // Get the last reset time (most recent updated_at from system_settings)
    const [[{ lastResetTime }]]: any = await pool.query('SELECT updated_at AS lastResetTime FROM system_settings ORDER BY updated_at DESC LIMIT 1');

    return NextResponse.json({
      success: true,
      stats: {
        totalCandidates,
        allocatedSeats,
        availableSeats,
        lastResetTime
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
