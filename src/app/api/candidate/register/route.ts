import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  const connection = await pool.getConnection();
  
  try {
    const { userId, ...formData } = await req.json();
    await connection.beginTransaction();

    // 1. Insert/Update candidate
    await connection.query(`
      INSERT INTO candidates (
        user_id, full_name, father_name, phone, aadhar_id,
        tenth_percentage, board_name, state, category, exam_rank, application_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        father_name = VALUES(father_name),
        phone = VALUES(phone),
        aadhar_id = VALUES(aadhar_id),
        tenth_percentage = VALUES(tenth_percentage),
        board_name = VALUES(board_name),
        state = VALUES(state),
        category = VALUES(category),
        exam_rank = VALUES(exam_rank),
        application_status = VALUES(application_status)
    `, [
      userId,
      formData.full_name,
      formData.father_name,
      formData.phone,
      formData.aadhar_id,
      formData.tenth_percentage,
      formData.board_name,
      formData.state,
      formData.category,
      formData.exam_rank,
      'submitted' // Set status to submitted
    ]);

    // 2. Get candidate ID
    const [candidate]: any = await connection.query(
      'SELECT id FROM candidates WHERE user_id = ?',
      [userId]
    );
    const candidateId = candidate[0].id;

    // 3. Save preferences
    await connection.query(
      'DELETE FROM course_preferences WHERE candidate_id = ?',
      [candidateId]
    );

    const preferences = [
      formData.preference1,
      formData.preference2,
      formData.preference3
    ].filter(Boolean);

    for (const [index, courseId] of preferences.entries()) {
      await connection.query(
        'INSERT INTO course_preferences (candidate_id, course_id, preference_order) VALUES (?, ?, ?)',
        [candidateId, courseId, index + 1]
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true });

  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
