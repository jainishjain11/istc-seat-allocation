import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await the params promise
    
    const [rows]: any = await pool.query(
      'SELECT * FROM candidates WHERE user_id = ?', 
      [id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Candidate not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      profile: rows[0] 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch candidate' },
      { status: 500 }
    );
  }
}
