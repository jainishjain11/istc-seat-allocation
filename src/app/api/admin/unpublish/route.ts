import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST() {
  await pool.query(`UPDATE system_settings SET results_published = FALSE`);
  return NextResponse.json({ success: true });
}