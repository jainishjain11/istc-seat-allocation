import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const [candidates]: any = await pool.query(`
      SELECT 
        c.*,
        GROUP_CONCAT(cp.course_id ORDER BY cp.preference_order) AS preferences
      FROM candidates c
      LEFT JOIN course_preferences cp ON c.id = cp.candidate_id
      WHERE c.user_id = ?
      GROUP BY c.id
    `, [params.userId]);

    if (candidates.length === 0) {
      return NextResponse.json({ 
        success: true, 
        exists: false,
        profile: null 
      });
    }

    return NextResponse.json({ 
      success: true,
      exists: true,
      profile: {
        ...candidates[0],
        preferences: candidates[0].preferences 
          ? candidates[0].preferences.split(',').map(Number)
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
