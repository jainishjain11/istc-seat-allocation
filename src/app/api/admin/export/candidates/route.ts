// src/app/api/admin/export/candidates/route.ts
import { NextResponse } from 'next/server';
import { Parser } from 'json2csv';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Fetch candidate data with allocations, ordered by exam rank
    const [candidates]: any = await pool.query(`
      SELECT 
        c.id, 
        c.full_name, 
        u.email,
        c.category,
        c.exam_rank,
        c.aadhar_id,
        c.tenth_percentage,
        courses.course_name AS allocated_course,
        sa.allocated_at
      FROM candidates c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN seat_allocations sa ON c.id = sa.candidate_id
      LEFT JOIN courses ON sa.allocated_course_id = courses.id
      ORDER BY c.exam_rank ASC  -- Added ordering by exam rank
    `);

    if (candidates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No candidates found' },
        { status: 404 }
      );
    }

    // CSV Conversion
    const parser = new Parser();
    const csv = parser.parse(candidates);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=istc_candidates.csv'
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
