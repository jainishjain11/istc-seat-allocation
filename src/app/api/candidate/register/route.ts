import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  const connection = await pool.getConnection();
  
  try {
    const body = await request.json();
    console.log('📨 Full request body received:', body); // Debug log
    
    // Extract userId from request body
    const userId = body.userId;
    
    if (!userId) {
      console.log('❌ No userId found in request body');
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log('✅ Processing registration for userId:', userId);

    // Validate all required fields
    const requiredFields = [
      'full_name', 'father_name', 'phone', 'aadhar_id',
      'tenth_percentage', 'board_name', 'state', 'category', 'exam_rank'
    ];

    const missingFields = [];
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    // Check if already registered
    const [existing]: any = await connection.query(
      'SELECT id FROM candidates WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return NextResponse.json(
        { success: false, error: "You have already registered" },
        { status: 400 }
      );
    }

    // Insert candidate data
    const [candidateResult]: any = await connection.query(`
      INSERT INTO candidates (
        user_id, full_name, father_name, phone, aadhar_id,
        tenth_percentage, board_name, state, category, exam_rank, application_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted')
    `, [
      userId,
      body.full_name,
      body.father_name,
      body.phone,
      body.aadhar_id,
      parseFloat(body.tenth_percentage),
      body.board_name,
      body.state,
      body.category,
      parseInt(body.exam_rank)
    ]);

    const candidateId = candidateResult.insertId;
    console.log('✅ Candidate inserted with ID:', candidateId);

    // Insert course preferences
    const preferences = [
      body.preference_1,
      body.preference_2,
      body.preference_3
    ].filter(Boolean);

    for (const [index, courseId] of preferences.entries()) {
      await connection.query(
        'INSERT INTO course_preferences (candidate_id, course_id, preference_order) VALUES (?, ?, ?)',
        [candidateId, courseId, index + 1]
      );
    }

    await connection.commit();
    
    return NextResponse.json({ 
      success: true, 
      message: "Registration completed successfully",
      candidateId: candidateId
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('💥 Registration error:', error);
    return NextResponse.json(
      { success: false, error: `Database error: ${error.message}` },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
