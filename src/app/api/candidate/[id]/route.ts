import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if candidate exists
    const [candidates]: any = await pool.query(
      'SELECT * FROM candidates WHERE user_id = ?', 
      [id]
    );
    
    if (candidates.length === 0) {
      // Return empty profile for new candidates
      return NextResponse.json({ 
        success: true, 
        profile: null,
        isNewUser: true 
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      profile: candidates[0],
      isNewUser: false 
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
