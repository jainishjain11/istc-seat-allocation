import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [candidates]: any = await pool.query(`
      SELECT 
        c.id,
        c.full_name,
        c.exam_rank,
        c.category,
        co.course_name AS allocated_course,
        CASE
          WHEN sa.candidate_id IS NOT NULL THEN 'Allocated'
          WHEN c.application_status = 'Submitted' THEN 'Pending'
          ELSE 'Not Allocated'
        END AS allocation_status
      FROM candidates c
      LEFT JOIN seat_allocations sa ON c.id = sa.candidate_id
      LEFT JOIN courses co ON sa.allocated_course_id = co.id
      ORDER BY c.exam_rank ASC
    `);
    
    return NextResponse.json({ success: true, candidates });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}
