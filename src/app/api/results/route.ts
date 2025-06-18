// src/app/api/results/route.ts
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
    
    if (!settings.length || !settings[0].results_published) {
      return NextResponse.json(
        { success: false, error: 'Results not published yet' },
        { status: 403 }
      );
    }

    // Verify candidate credentials and get candidate ID
    const [candidates]: any = await pool.query(
      `SELECT c.id 
       FROM candidates c
       JOIN users u ON c.user_id = u.id
       WHERE u.email = ? AND u.dob = ? AND u.is_qualified = TRUE`,
      [email, dob]
    );

    if (candidates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials or not qualified' },
        { status: 401 }
      );
    }

    // Get allocation result
    const [allocations]: any = await pool.query(
      `SELECT 
         c.course_name, 
         c.course_code, 
         sa.allocated_at 
       FROM seat_allocations sa
       JOIN courses c ON sa.allocated_course_id = c.id
       WHERE sa.candidate_id = ?`,
      [candidates[0].id]
    );

    return NextResponse.json({
      success: true,
      result: allocations[0] || null
    });

  } catch (error: any) {
    console.error('Results API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
