import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST() {
  try {
    // 1. Fetch all candidates sorted by rank
    const [candidates]: any = await pool.query(`
      SELECT c.id, c.exam_rank, c.category,
        GROUP_CONCAT(cp.course_id ORDER BY cp.preference_order) AS preferences
      FROM candidates c
      LEFT JOIN course_preferences cp ON c.id = cp.candidate_id
      GROUP BY c.id
      ORDER BY c.exam_rank ASC
    `);

    // 2. Fetch all courses and build seat map
    const [courses]: any = await pool.query(`SELECT * FROM courses`);
    const seatMap: Record<number, number> = {};
    courses.forEach((c: any) => {
      seatMap[c.id] = c.available_seats;
    });

    // 3. Allocate seats
    const allocations: { candidate_id: number, course_id: number }[] = [];
    for (const cand of candidates) {
      const prefs = cand.preferences ? cand.preferences.split(',').map(Number) : [];
      for (const courseId of prefs) {
        if (seatMap[courseId] > 0) {
          allocations.push({ candidate_id: cand.id, course_id: courseId });
          seatMap[courseId]--;
          break;
        }
      }
    }

    // 4. Update seat_allocations table and courses table
    for (const alloc of allocations) {
      await pool.query(
        `INSERT INTO seat_allocations (candidate_id, allocated_course_id) VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE allocated_course_id = VALUES(allocated_course_id)`,
        [alloc.candidate_id, alloc.course_id]
      );
    }
    for (const courseId in seatMap) {
      await pool.query(
        `UPDATE courses SET available_seats = ? WHERE id = ?`,
        [seatMap[courseId], courseId]
      );
    }

    return NextResponse.json({ success: true, allocations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
