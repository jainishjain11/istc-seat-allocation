import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;

  try {
    // Check if results are published and get doc verification date
    const [settings]: any = await pool.query(
      'SELECT results_published, doc_verification_date FROM system_settings'
    );
    
    if (!settings.length || !settings[0].results_published) {
      return NextResponse.json(
        { 
          success: true,
          published: false,
          result: null
        },
        { status: 200 }
      );
    }

    // Get candidate by userId
    const [candidates]: any = await pool.query(
      `SELECT id FROM candidates WHERE user_id = ?`,
      [userId]
    );
    
    if (candidates.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Candidate not found' 
        },
        { status: 404 }
      );
    }

    // Get allocation result
    const [allocations]: any = await pool.query(
      `SELECT 
        c.course_name, 
        c.course_code, 
        sa.allocated_at,
        c.id AS course_id
       FROM seat_allocations sa
       JOIN courses c ON sa.allocated_course_id = c.id
       WHERE sa.candidate_id = ?`,
      [candidates[0].id]
    );

    // Add verification date to result
    const result = allocations[0]
      ? {
          ...allocations[0],
          verification_date: settings[0].doc_verification_date || null
        }
      : null;

    return NextResponse.json({
      success: true,
      published: true,
      result
    });

  } catch (error: any) {
    console.error('Results API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
