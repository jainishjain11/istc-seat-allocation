import { NextResponse } from 'next/server';
import pool from '@/lib/db';

interface Course {
  id: number;
  total_seats: number;
  general: number;
  sc: number;
  st: number;
  obc: number;
  ews: number;
  available: number;
}

interface Candidate {
  id: number;
  exam_rank: number;
  category: string;
  preferences: number[];
  current_allocation: number | null;
}

export async function POST() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Phase 1: Initialize Data
    const [candidatesData]: any = await connection.query(`
      SELECT 
        c.id, c.exam_rank, c.category,
        GROUP_CONCAT(cp.course_id ORDER BY cp.preference_order) AS preferences
      FROM candidates c
      JOIN course_preferences cp ON c.id = cp.candidate_id
      WHERE c.application_status = 'submitted'
      GROUP BY c.id
      ORDER BY c.exam_rank ASC
    `);

    const [coursesData]: any = await connection.query(`
      SELECT * FROM courses
    `);

    // Phase 2: Prepare Data Structures
    const candidates: Candidate[] = candidatesData.map((c: any) => ({
      ...c,
      preferences: c.preferences.split(',').map(Number),
      current_allocation: null
    }));

    const courses: Record<number, Course> = {};
    coursesData.forEach((c: any) => {
      courses[c.id] = {
        ...c,
        available: c.available_seats,
      };
    });

    // Phase 3: Main Allocation Logic
    const allocations = new Map<number, number>();
    let changed: boolean;

    do {
      changed = false;
      const candidateQueue = [...candidates].sort((a, b) => a.exam_rank - b.exam_rank);

      for (const candidate of candidateQueue) {
        if (allocations.has(candidate.id)) continue;

        for (const preference of candidate.preferences) {
          const course = courses[preference];
          if (!course || course.available <= 0) continue;

          const category = candidate.category.toLowerCase() as keyof Course;
          if (course[category] > 0) {
            // Allocate reserved seat
            course[category]--;
            course.available--;
            allocations.set(candidate.id, preference);
            changed = true;
            break;
          } else if (course.general > 0) {
            // Allocate general seat
            course.general--;
            course.available--;
            allocations.set(candidate.id, preference);
            changed = true;
            break;
          }
        }
      }

      // Phase 4: Convert unused reserved seats to general
      for (const course of Object.values(courses) as Course[]) {
        const reservedSeats = course.sc + course.st + course.obc + course.ews;
        if (reservedSeats > 0) {
          course.general += reservedSeats;
          course.sc = 0;
          course.st = 0;
          course.obc = 0;
          course.ews = 0;
        }
      }

    } while (changed);

    // Phase 5: Update Database
    await connection.query('DELETE FROM seat_allocations');
    
    const allocationEntries = Array.from(allocations.entries()).map(([cid, courseId]) => [cid, courseId]);
    if (allocationEntries.length > 0) {
      await connection.query(
        `INSERT INTO seat_allocations (candidate_id, allocated_course_id) VALUES ?`,
        [allocationEntries]
      );
    }

    // Update course availability
    for (const [courseId, course] of Object.entries(courses)) {
      await connection.query(
        `UPDATE courses SET
          available_seats = ?,
          general_seats = ?,
          sc_seats = ?,
          st_seats = ?,
          obc_seats = ?,
          ews_seats = ?
         WHERE id = ?`,
        [
          course.available,
          course.general,
          course.sc,
          course.st,
          course.obc,
          course.ews,
          courseId
        ]
      );
    }

    await connection.commit();
    return NextResponse.json({ 
      success: true,
      allocated: allocations.size,
      total_candidates: candidates.length 
    });

  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(
      { success: false, error: error.message || 'Allocation failed' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
