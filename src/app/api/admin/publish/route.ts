import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { publish } = await req.json();
    
    await pool.query(
      'UPDATE system_settings SET results_published = ? WHERE id = 1',
      [publish]
    );
    
    return NextResponse.json({ 
      success: true,
      results_published: publish,
      message: publish ? 'Results published successfully' : 'Results unpublished successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}