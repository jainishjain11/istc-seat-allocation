import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [settings]: any = await pool.query(
      'SELECT registrations_locked, results_published FROM system_settings WHERE id = 1'
    );
    
    if (settings.length === 0) {
      return NextResponse.json({
        registrations_locked: false,
        results_published: false
      });
    }

    return NextResponse.json({
      registrations_locked: Boolean(settings[0].registrations_locked),
      results_published: Boolean(settings[0].results_published)
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}