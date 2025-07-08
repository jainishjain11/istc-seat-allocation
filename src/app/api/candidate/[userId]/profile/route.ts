import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;

  try {
    const [candidates]: any = await pool.query(`
      SELECT 
        c.*,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'course_id', cp.course_id,
            'course_name', crs.course_name,
            'preference_order', cp.preference_order
          )
        ) AS preferences
      FROM candidates c
      LEFT JOIN course_preferences cp ON c.id = cp.candidate_id
      LEFT JOIN courses crs ON cp.course_id = crs.id
      WHERE c.user_id = ?
      GROUP BY c.id
    `, [userId]);

    if (candidates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    const candidate = candidates[0];
    // Parse preferences from JSON string to array if needed
    let preferences: any[] = [];
    try {
      preferences = typeof candidate.preferences === 'string'
        ? JSON.parse(candidate.preferences)
        : candidate.preferences;
    } catch {
      preferences = [];
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...candidate,
        preferences: Array.isArray(preferences)
          ? preferences.filter((p: any) => p && p.course_id)
          : []
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
