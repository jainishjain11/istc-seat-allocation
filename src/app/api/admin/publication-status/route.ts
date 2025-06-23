import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const [settings]: any = await pool.query(
    'SELECT results_published FROM system_settings'
  );
  return NextResponse.json({
    published: settings[0].results_published
  });
}