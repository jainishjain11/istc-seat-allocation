import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await the params promise
    
    const [rows]: any = await pool.query(
      `SELECT 
        sa.allocated_at, 
        c.course_name,
        c.course_code 
      FROM seat_allocations sa
      JOIN candidates cand ON sa.candidate_id = cand.id
      JOIN courses c ON sa.allocated_course_id = c.id
      WHERE cand.user_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No allocation found for this candidate' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      allocation: rows[0]
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch allocation result' 
      },
      { status: 500 }
    );
  }
}
