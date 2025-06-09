import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const dob = searchParams.get('dob');

  try {
    // Check if results are published
    const [settings]: any = await pool.query(
      'SELECT results_published FROM system_settings'
    );
    
    if (!settings[0].results_published) {
      return NextResponse.json(
        { success: false, error: 'Results not published yet' },
        { status: 403 }
      );
    }

    // Verify candidate credentials
    const [users]: any = await pool.query(
      `SELECT id FROM users 
       WHERE email = ? AND password = ? AND is_qualified = TRUE`,
      [email, dob]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials or not qualified' },
        { status: 401 }
      );
    }

    // Get allocation result
    const [allocation]: any = await pool.query(
      `SELECT c.course_name, c.course_code, sa.allocated_at 
       FROM seat_allocations sa
       JOIN courses c ON sa.allocated_course_id = c.id
       WHERE sa.candidate_id = ?`,
      [users[0].id]
    );

    return NextResponse.json({
      success: true,
      result: allocation[0] || null
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
