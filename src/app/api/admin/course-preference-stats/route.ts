import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        c.id AS course_id,
        c.course_name,
        SUM(CASE WHEN cp.preference_order = 1 THEN 1 ELSE 0 END) AS preference_1,
        SUM(CASE WHEN cp.preference_order = 2 THEN 1 ELSE 0 END) AS preference_2,
        SUM(CASE WHEN cp.preference_order = 3 THEN 1 ELSE 0 END) AS preference_3,
        COUNT(*) AS total
      FROM course_preferences cp
      JOIN courses c ON cp.course_id = c.id
      GROUP BY c.id, c.course_name
      ORDER BY c.course_name ASC
    `);

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Course preference stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
