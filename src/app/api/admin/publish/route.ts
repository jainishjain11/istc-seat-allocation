import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { publish, docVerificationDate } = await req.json();

    if (typeof docVerificationDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(docVerificationDate)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing Document Verification Date.' },
        { status: 400 }
      );
    }

    await pool.query(
      'UPDATE system_settings SET results_published = ?, doc_verification_date = ? WHERE id = 1',
      [publish ? 1 : 0, docVerificationDate]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to publish results' },
      { status: 500 }
    );
  }
}
