import { NextResponse } from 'next/server';
import { Parser } from 'json2csv';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [courses]: any = await pool.query(`
      SELECT 
        course_code AS "Course Code",
        course_name AS "Course Name", 
        total_seats AS "Total Seats",
        available_seats AS "Available Seats"
      FROM courses
    `);

    if (courses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No courses found' },
        { status: 404 }
      );
    }

    const parser = new Parser();
    const csv = parser.parse(courses);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=istc_courses.csv'
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
