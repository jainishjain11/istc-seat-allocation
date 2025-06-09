import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  // Get all candidates and their preferences
  const [candidates]: any = await pool.query(`
    SELECT c.id, c.full_name, c.exam_rank, c.category,
      GROUP_CONCAT(cp.course_id ORDER BY cp.preference_order) AS preferences
    FROM candidates c
    LEFT JOIN course_preferences cp ON c.id = cp.candidate_id
    GROUP BY c.id
    ORDER BY c.exam_rank ASC
  `);

  // Get all courses
  const [courses]: any = await pool.query(`SELECT * FROM courses`);

  return NextResponse.json({ candidates, courses });
}
