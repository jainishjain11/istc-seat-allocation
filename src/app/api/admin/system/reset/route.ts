import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  const { password } = await req.json();

  try {
    // Fetch admin password from database (plain text)
    const [admin]: any = await pool.query(
      'SELECT password FROM users WHERE is_admin = 1 LIMIT 1'
    );

    if (!admin || admin.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found' },
        { status: 400 }
      );
    }

    const adminPassword = admin[0].password;

    // Plain text comparison
    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Perform reset operations in a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Reset courses to initial state
      await connection.query(`
        UPDATE courses 
        SET 
          available_seats = total_seats,
          general_seats = total_seats,
          sc_seats = 0,
          st_seats = 0,
          obc_seats = 0,
          ews_seats = 0
      `);

      // Delete all candidates
      await connection.query('DELETE FROM candidates');

      // Delete all seat allocations
      await connection.query('DELETE FROM seat_allocations');

      // Unpublish results
      await connection.query('UPDATE system_settings SET results_published = 0');

      // Delete non-admin users
      await connection.query('DELETE FROM users WHERE is_admin = 0');

      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'System reset successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Reset failed' },
      { status: 500 }
    );
  }
}
