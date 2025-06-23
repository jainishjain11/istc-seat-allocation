import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const [courses]: any = await pool.query(`
      SELECT 
        id,
        course_name,
        course_code,
        total_seats,
        available_seats
      FROM courses 
      ORDER BY course_name ASC
    `);

    return NextResponse.json({
      success: true,
      courses: courses
    });
  } catch (error: any) {
    console.error('Courses fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}