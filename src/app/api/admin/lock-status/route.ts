import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [settings]: any = await pool.query(
      'SELECT registrations_locked FROM system_settings WHERE id = 1'
    );
    
    if (settings.length === 0) {
      return NextResponse.json(
        { success: false, error: 'System settings not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      registrations_locked: settings[0].registrations_locked
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
