import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await pool.query('SELECT * FROM category_rules LIMIT 1');
    return NextResponse.json({ success: true, rules: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const rules = await req.json();
    await pool.query(
      'UPDATE category_rules SET general = ?, sc = ?, st = ?, obc = ?, ews = ? WHERE id = 1',
      [rules.general, rules.sc, rules.st, rules.obc, rules.ews]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
