import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  const connection = await pool.getConnection();
  
  try {
    const { userId, ...formData } = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'userId', 'full_name', 'father_name', 'phone', 'aadhar_id',
      'tenth_percentage', 'board_name', 'state', 'category', 'exam_rank'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]?.toString().trim()) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    await connection.beginTransaction();

    // Check existing registration
    const [existing]: any = await connection.query(
      'SELECT id FROM candidates WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Registration already submitted" },
        { status: 400 }
      );
    }

    // Insert candidate
    const [result]: any = await connection.query(`
      INSERT INTO candidates SET
        user_id = ?,
        full_name = ?,
        father_name = ?,
        phone = ?,
        aadhar_id = ?,
        tenth_percentage = ?,
        board_name = ?,
        state = ?,
        category = ?,
        exam_rank = ?,
        application_status = 'submitted'
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
      formData.exam_rank
    ]);

    // Insert preferences
    const preferences = [
      formData.preference_1,
      formData.preference_2,
      formData.preference_3
    ].filter(Boolean);

    for (const [index, courseId] of preferences.entries()) {
      await connection.query(
        `INSERT INTO course_preferences SET
          candidate_id = ?,
          course_id = ?,
          preference_order = ?`,
        [result.insertId, courseId, index + 1]
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true });

  } catch (error: any) {
    await connection.rollback();
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database error' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
