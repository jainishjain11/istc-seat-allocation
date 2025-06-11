import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      userId,
      full_name,
      father_name,
      phone,
      aadhar_id,
      tenth_percentage,
      board_name,
      state,
      category,
      exam_rank,
      preference1,
      preference2,
      preference3,
      application_status
    } = data;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert/Update candidate
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
      `, [userId, full_name, father_name, phone, aadhar_id, tenth_percentage, board_name, state, category, exam_rank, application_status]);

      // Get candidate ID
      const [candidate]: any = await connection.query(
        'SELECT id FROM candidates WHERE user_id = ?',
        [userId]
      );
      const candidateId = candidate[0].id;

      // Delete existing preferences
      await connection.query(
        'DELETE FROM course_preferences WHERE candidate_id = ?',
        [candidateId]
      );

      // Insert new preferences
      const preferences = [preference1, preference2, preference3];
      for (let i = 0; i < preferences.length; i++) {
        if (preferences[i]) {
          await connection.query(
            'INSERT INTO course_preferences (candidate_id, course_id, preference_order) VALUES (?, ?, ?)',
            [candidateId, preferences[i], i + 1]
          );
        }
      }

      await connection.commit();
      return NextResponse.json({ success: true });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



