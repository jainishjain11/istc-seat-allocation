import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('backup');
  
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { success: false, error: 'No backup file provided' },
      { status: 400 }
    );
  }

  try {
    const backupText = await file.text();
    const backup = JSON.parse(backupText);

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Helper functions for date conversion
      const toMySQLDate = (isoString: string | null) => {
        if (!isoString) return null;
        return isoString.split('T')[0]; // Extract YYYY-MM-DD
      };

      const toMySQLDateTime = (isoString: string | null) => {
        if (!isoString) return null;
        // Convert to MySQL format: YYYY-MM-DD HH:MM:SS
        return new Date(isoString).toISOString().slice(0, 19).replace('T', ' ');
      };

      // Clear existing data
      await connection.query('DELETE FROM seat_allocations');
      await connection.query('DELETE FROM candidates');
      await connection.query('DELETE FROM courses');
      await connection.query('DELETE FROM users WHERE is_admin = 0');
      await connection.query('DELETE FROM system_settings WHERE id > 1');

      // Restore users
      if (backup.users && backup.users.length > 0) {
        const userValues = backup.users.map((u: any) => [
          u.id, 
          u.email, 
          u.password, 
          toMySQLDate(u.dob),  // Convert DATE
          u.is_admin, 
          u.is_qualified, 
          toMySQLDateTime(u.created_at)  // Convert DATETIME
        ]);
        
        await connection.query(
          'INSERT INTO users (id, email, password, dob, is_admin, is_qualified, created_at) VALUES ?',
          [userValues]
        );
      }

      // Restore candidates
      if (backup.candidates && backup.candidates.length > 0) {
        const candidateValues = backup.candidates.map((c: any) => [
          c.id, 
          c.user_id, 
          c.full_name, 
          c.exam_rank, 
          c.category, 
          c.aadhar_id, 
          c.tenth_percentage, 
          c.application_status,
          toMySQLDateTime(c.created_at)  // Convert if exists
        ]);
        
        await connection.query(
          `INSERT INTO candidates 
           (id, user_id, full_name, exam_rank, category, aadhar_id, tenth_percentage, application_status, created_at) 
           VALUES ?`,
          [candidateValues]
        );
      }

      // Restore courses
      if (backup.courses && backup.courses.length > 0) {
        const courseValues = backup.courses.map((c: any) => [
          c.id, 
          c.course_name, 
          c.total_seats, 
          c.available_seats, 
          c.general_seats, 
          c.sc_seats, 
          c.st_seats, 
          c.obc_seats, 
          c.ews_seats
        ]);
        
        await connection.query(
          'INSERT INTO courses (id, course_name, total_seats, available_seats, general_seats, sc_seats, st_seats, obc_seats, ews_seats) VALUES ?',
          [courseValues]
        );
      }

      // Restore seat allocations
      if (backup.seatAllocations && backup.seatAllocations.length > 0) {
        const allocationValues = backup.seatAllocations.map((s: any) => [
          s.id, 
          s.candidate_id, 
          s.allocated_course_id, 
          toMySQLDateTime(s.allocated_at)  // Convert DATETIME
        ]);
        
        await connection.query(
          'INSERT INTO seat_allocations (id, candidate_id, allocated_course_id, allocated_at) VALUES ?',
          [allocationValues]
        );
      }

      // Restore system settings
      if (backup.systemSettings && backup.systemSettings.length > 0) {
        const settingValues = backup.systemSettings.map((s: any) => [
          s.id,
          s.results_published,
          s.registrations_locked,
          toMySQLDateTime(s.created_at),  // Convert
          toMySQLDateTime(s.updated_at)   // Convert
        ]);
        
        await connection.query(
          `INSERT INTO system_settings 
           (id, results_published, registrations_locked, created_at, updated_at) 
           VALUES ?`,
          [settingValues]
        );
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'System restored successfully'
      });
    } catch (error: any) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Restore failed' },
      { status: 500 }
    );
  }
}
