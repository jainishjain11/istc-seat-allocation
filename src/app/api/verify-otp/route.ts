import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { logActivity } from '@/lib/activityLogger';

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();

  try {
    // Find valid OTP
    const [rows]: any = await pool.query(
      'SELECT * FROM otps WHERE email = ? AND otp_code = ? AND used = 0 AND expires_at > NOW()',
      [email, otp]
    );
    if (!rows.length) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // Mark OTP as used
    await pool.query('UPDATE otps SET used = 1 WHERE id = ?', [rows[0].id]);

    // Optionally, you can log in the user here (set session/cookie)
    // For demo: redirect to candidate dashboard
    await logActivity(rows[0].user_id, 'candidate_login', 'Candidate logged in via OTP', req);

    return NextResponse.json({ success: true, redirect: `/candidate/${rows[0].user_id}` });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
