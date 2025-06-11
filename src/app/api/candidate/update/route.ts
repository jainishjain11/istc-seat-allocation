import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    // Update candidate profile
    await pool.query(
      `UPDATE candidates SET 
        full_name = ?, father_name = ?, phone = ?, aadhar_id = ?, tenth_percentage = ?, 
        board_name = ?, state = ?, category = ?, exam_rank = ?
      WHERE user_id = ?`,
      [
        data.full_name, data.father_name, data.phone, data.aadhar_id, data.tenth_percentage,
        data.board_name, data.state, data.category, data.exam_rank, data.userId
      ]
    );
    // Update preferences
    await pool.query(`DELETE FROM course_preferences WHERE candidate_id = ?`, [data.userId]);
    await pool.query(
      `INSERT INTO course_preferences (candidate_id, course_id, preference_order) VALUES (?, ?, 1), (?, ?, 2), (?, ?, 3)`,
      [data.userId, data.preference1, data.userId, data.preference2, data.userId, data.preference3]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

