import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const [result]: any = await pool.query(
      'SELECT COUNT(*) as count FROM candidates WHERE user_id = ? AND application_status = "submitted"',
      [params.userId]
    );

    return NextResponse.json({
      success: true,
      isRegistered: result[0].count > 0
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}