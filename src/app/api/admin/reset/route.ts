import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST() {
  try {
    // Delete all seat allocations
    await pool.query('DELETE FROM seat_allocations');
    // Reset all courses' seat counts to their total_seats
    await pool.query(`
      UPDATE courses SET 
        general_seats = total_seats, 
        sc_seats = 0, st_seats = 0, obc_seats = 0, ews_seats = 0,
        available_seats = total_seats
    `);
    // Unpublish results
    await pool.query('UPDATE system_settings SET results_published = 0');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
