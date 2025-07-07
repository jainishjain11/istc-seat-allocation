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
        return isoString.split('T')[0]; // YYYY-MM-DD
      };

      const toMySQLDateTime = (isoString: string | null) => {
        if (!isoString) return null;
        return new Date(isoString).toISOString().slice(0, 19).replace('T', ' ');
      };

      console.log('🔄 Starting system restore...');

      // Disable foreign key checks temporarily
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');

      // Clear existing data (preserve admin users)
      await connection.query('DELETE FROM seat_allocations');
      await connection.query('DELETE FROM course_preferences');
      await connection.query('DELETE FROM candidates');
      await connection.query('DELETE FROM courses');
      await connection.query('DELETE FROM users WHERE is_admin = 0');
      await connection.query('DELETE FROM system_settings WHERE id > 1');

      // Reset auto-increment counters
      await connection.query('ALTER TABLE seat_allocations AUTO_INCREMENT = 1');
      await connection.query('ALTER TABLE course_preferences AUTO_INCREMENT = 1');
      await connection.query('ALTER TABLE candidates AUTO_INCREMENT = 1');
      await connection.query('ALTER TABLE courses AUTO_INCREMENT = 1');
      await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');

      // Re-enable foreign key checks
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');

      // ========== RESTORE USERS (Non-admin only) ==========
      if (backup.users && backup.users.length > 0) {
        const nonAdminUsers = backup.users.filter((u: any) => !u.is_admin);
        
        if (nonAdminUsers.length > 0) {
          const userValues = nonAdminUsers.map((u: any) => [
            u.id,
            u.email,
            u.password,
            toMySQLDate(u.dob),
            u.is_admin,
            u.is_qualified,
            toMySQLDateTime(u.created_at)
          ]);
          
          await connection.query(
            `INSERT INTO users 
             (id, email, password, dob, is_admin, is_qualified, created_at) 
             VALUES ?`,
            [userValues]
          );
          console.log(`✅ Restored ${userValues.length} users`);
        }
      }

      // ========== RESTORE COURSES ==========
      if (backup.courses && backup.courses.length > 0) {
        const courseValues = backup.courses.map((c: any) => [
          c.id,
          c.course_name,
          c.course_code,
          c.total_seats,
          c.available_seats,
          toMySQLDateTime(c.created_at),
          c.general_seats,
          c.sc_seats,
          c.st_seats,
          c.obc_seats,
          c.ews_seats
        ]);
        
        await connection.query(
          `INSERT INTO courses 
           (id, course_name, course_code, total_seats, available_seats, created_at, general_seats, sc_seats, st_seats, obc_seats, ews_seats) 
           VALUES ?`,
          [courseValues]
        );
        console.log(`✅ Restored ${courseValues.length} courses`);
      }

      // ========== RESTORE CANDIDATES ==========
      if (backup.candidates && backup.candidates.length > 0) {
        const candidateValues = backup.candidates.map((c: any) => [
          c.id,
          c.user_id,
          c.full_name,
          c.father_name,
          c.phone,
          c.aadhar_id,
          c.tenth_percentage,
          c.board_name,
          c.state,
          c.category,
          c.exam_rank,
          c.application_status,
          toMySQLDateTime(c.created_at)
        ]);
        
        await connection.query(
          `INSERT INTO candidates 
           (id, user_id, full_name, father_name, phone, aadhar_id, tenth_percentage, board_name, state, category, exam_rank, application_status, created_at) 
           VALUES ?`,
          [candidateValues]
        );
        console.log(`✅ Restored ${candidateValues.length} candidates`);
      }

      // ========== RESTORE COURSE PREFERENCES ==========
      if (backup.coursePreferences && backup.coursePreferences.length > 0) {
        const preferenceValues = backup.coursePreferences.map((p: any) => [
          p.id,
          p.candidate_id,
          p.course_id,
          p.preference_order,
          toMySQLDateTime(p.created_at)
        ]);
        
        await connection.query(
          `INSERT INTO course_preferences 
           (id, candidate_id, course_id, preference_order, created_at) 
           VALUES ?`,
          [preferenceValues]
        );
        console.log(`✅ Restored ${preferenceValues.length} course preferences`);
      }

      // ========== RESTORE SEAT ALLOCATIONS ==========
      if (backup.seatAllocations && backup.seatAllocations.length > 0) {
        const allocationValues = backup.seatAllocations.map((s: any) => [
          s.id,
          s.candidate_id,
          s.allocated_course_id,
          s.allocation_round,
          toMySQLDateTime(s.allocated_at)
        ]);
        
        await connection.query(
          `INSERT INTO seat_allocations 
           (id, candidate_id, allocated_course_id, allocation_round, allocated_at) 
           VALUES ?`,
          [allocationValues]
        );
        console.log(`✅ Restored ${allocationValues.length} seat allocations`);
      }

      // ========== RESTORE SYSTEM SETTINGS ==========
      if (backup.systemSettings && backup.systemSettings.length > 0) {
        const filteredSettings = backup.systemSettings.filter((s: any) => s.id > 1);
        
        if (filteredSettings.length > 0) {
          const settingValues = filteredSettings.map((s: any) => [
            s.id,
            toMySQLDateTime(s.created_at),
            s.results_published,
            toMySQLDateTime(s.updated_at),
            s.registrations_locked
          ]);
          
          await connection.query(
            `INSERT INTO system_settings 
             (id, created_at, results_published, updated_at, registrations_locked) 
             VALUES ?`,
            [settingValues]
          );
          console.log(`✅ Restored ${settingValues.length} system settings`);
        }
      }

      await connection.commit();
      console.log('🎉 System restore completed successfully!');

      return NextResponse.json({
        success: true,
        message: 'System restored successfully',
        restored: {
          users: backup.users?.filter((u: any) => !u.is_admin)?.length || 0,
          candidates: backup.candidates?.length || 0,
          courses: backup.courses?.length || 0,
          allocations: backup.seatAllocations?.length || 0,
          preferences: backup.coursePreferences?.length || 0
        }
      });

    } catch (error: any) {
      await connection.rollback();
      console.error('❌ Restore failed:', error);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('💥 Restore error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Restore failed' },
      { status: 500 }
    );
  }
}