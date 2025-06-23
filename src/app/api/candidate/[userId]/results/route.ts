import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

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

    // Get candidate by userId
    const [candidates]: any = await pool.query(
      `SELECT id FROM candidates WHERE user_id = ?`,
      [userId]
    );
    if (candidates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Candidate not found' },
        { status: 404 }
      );
    }

    // Get allocation result
    const [allocations]: any = await pool.query(
      `SELECT c.course_name, c.course_code, sa.allocated_at
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
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}