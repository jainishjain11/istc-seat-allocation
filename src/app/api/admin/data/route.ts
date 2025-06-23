import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Fix: Use correct column name 'allocated_course_id' instead of 'course_id'
    const [candidates]: any = await pool.query(`
      SELECT 
        c.id,
        c.full_name,
        c.exam_rank,
        c.category,
        c.application_status,
        sa.allocated_course_id,
        co.course_name AS allocated_course,
        GROUP_CONCAT(cp.course_id ORDER BY cp.preference_order) AS preferences
      FROM candidates c
      LEFT JOIN course_preferences cp ON c.id = cp.candidate_id
      LEFT JOIN seat_allocations sa ON c.id = sa.candidate_id
      LEFT JOIN courses co ON sa.allocated_course_id = co.id
      GROUP BY c.id, c.full_name, c.exam_rank, c.category, c.application_status, sa.allocated_course_id, co.course_name
      ORDER BY c.exam_rank ASC
    `);

    // Get courses data
    const [courses]: any = await pool.query(`
      SELECT 
        id,
        course_name,
        total_seats,
        available_seats,
        general_seats,
        sc_seats,
        st_seats,
        obc_seats
      FROM courses
    `);

    return NextResponse.json({ 
      candidates: candidates || [], 
      courses: courses || [] 
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}