import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Trim input to avoid accidental spaces
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  // Find user by email
  const [users]: any = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [trimmedEmail]
  );

  if (users.length === 0) {
    return NextResponse.json({ success: false, error: 'User not found.' }, { status: 401 });
  }

  const user = users[0];

  // Admin login
  if (user.is_admin) {
    if (trimmedPassword === user.password) {
      return NextResponse.json({ success: true, isAdmin: true, userId: user.id });
    }
    return NextResponse.json({ success: false, error: 'Invalid admin credentials.' }, { status: 401 });
  }

  // Candidate login (password is DOB in YYYY-MM-DD)
  if (!user.is_qualified) {
    return NextResponse.json({ success: false, error: 'You are not qualified for the exam.' }, { status: 401 });
  }

  if (trimmedPassword === user.password) {
    return NextResponse.json({ success: true, isAdmin: false, userId: user.id });
  }

  return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
}
