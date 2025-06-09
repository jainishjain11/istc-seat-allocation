import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const [rows]: any = await pool.query('SELECT * FROM candidates WHERE user_id = ?', [params.id]);
  if (rows.length === 0) {
    return NextResponse.json({ success: false, error: 'Candidate not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, profile: rows[0] });
}
