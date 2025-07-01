import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  const { password } = await req.json();

  try {
    // Fetch admin password from database
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

      // Delete all candidates and reset auto-increment
      await connection.query('DELETE FROM candidates');
      await connection.query('ALTER TABLE candidates AUTO_INCREMENT = 1');

      // Delete all seat allocations and reset auto-increment
      await connection.query('DELETE FROM seat_allocations');
      await connection.query('ALTER TABLE seat_allocations AUTO_INCREMENT = 1');

      // Delete all course preferences and reset auto-increment
      await connection.query('DELETE FROM course_preferences');
      await connection.query('ALTER TABLE course_preferences AUTO_INCREMENT = 1');

      // Unpublish results
      await connection.query('UPDATE system_settings SET results_published = 0');

      // Delete non-admin users and reset auto-increment
      await connection.query('DELETE FROM users WHERE is_admin = 0');
      await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');

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
