import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [[{ totalCandidates }]]: any = await pool.query('SELECT COUNT(*) AS totalCandidates FROM candidates');
    const [[{ allocatedSeats }]]: any = await pool.query('SELECT COUNT(*) AS allocatedSeats FROM seat_allocations');
    const [[{ availableSeats }]]: any = await pool.query('SELECT SUM(available_seats) AS availableSeats FROM courses');
    const [[{ pendingApplications }]]: any = await pool.query("SELECT COUNT(*) AS pendingApplications FROM candidates WHERE application_status = 'Submitted'");

    return NextResponse.json({
      success: true,
      stats: {
        totalCandidates,
        allocatedSeats,
        availableSeats,
        pendingApplications,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
