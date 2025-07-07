import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { logActivity } from '@/lib/activityLogger'; // Import activity logger

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Trim input to avoid accidental spaces
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  try {
    // Find user by email
    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [trimmedEmail]
    );

    if (users.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found.' 
      }, { status: 401 });
    }

    const user = users[0];
    let response;

    // Admin login
    if (user.is_admin) {
      if (trimmedPassword === user.password) {
        // Log admin login activity
        await logActivity(user.id, 'admin_login', 'Admin logged in', req);
        
        response = NextResponse.json({ 
          success: true, 
          redirect: '/admin',
          userId: user.id 
        });
      } else {
        response = NextResponse.json({ 
          success: false, 
          error: 'Invalid admin credentials.' 
        }, { status: 401 });
      }
    }
    // Candidate login
    else {
      if (!user.is_qualified) {
        response = NextResponse.json({ 
          success: false, 
          error: 'You are not qualified for the exam.' 
        }, { status: 401 });
      } 
      else if (trimmedPassword === user.password) {
        // Log candidate login activity
        await logActivity(user.id, 'candidate_login', 'Candidate logged in', req);
        
        response = NextResponse.json({ 
          success: true, 
          redirect: `/candidate/${user.id}`,
          userId: user.id 
        });
      } else {
        response = NextResponse.json({ 
          success: false, 
          error: 'Invalid credentials.' 
        }, { status: 401 });
      }
    }

    return response;
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}