import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { lock } = await req.json();
    
    await pool.query(
      'UPDATE system_settings SET registrations_locked = ? WHERE id = 1',
      [lock]
    );
    
    return NextResponse.json({ 
      success: true,
      registrations_locked: lock 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}