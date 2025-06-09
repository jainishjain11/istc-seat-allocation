import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST() {
  try {
    await pool.query(
      `UPDATE system_settings SET results_published = TRUE`
    );
    return NextResponse.json({ 
      success: true,
      message: 'Results published successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
