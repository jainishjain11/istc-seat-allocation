import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Fetch all data from all tables
    const [users]: any = await pool.query('SELECT * FROM users');
    const [candidates]: any = await pool.query('SELECT * FROM candidates');
    const [courses]: any = await pool.query('SELECT * FROM courses');
    const [seatAllocations]: any = await pool.query('SELECT * FROM seat_allocations');
    const [systemSettings]: any = await pool.query('SELECT * FROM system_settings');

    const backup = {
      users,
      candidates,
      courses,
      seatAllocations,
      systemSettings,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="istc_backup_${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Backup failed' },
      { status: 500 }
    );
  }
}
