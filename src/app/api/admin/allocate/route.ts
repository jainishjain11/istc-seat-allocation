import { NextResponse } from 'next/server';
import pool from '@/lib/db';

interface Course {
  id: number;
  total_seats: number;
  general: number;
  sc: number;
  st: number;
  obc: number;
}

interface Candidate {
  id: number;
  exam_rank: number;
  category: string;
  preferences: number[];
  current_pref_index: number;
}

export async function POST() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Fetch candidates with valid preferences
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

    const candidates: Candidate[] = candidatesData.map((c: any) => ({
      ...c,
      preferences: c.preferences ? c.preferences.split(',').map(Number) : [],
      current_pref_index: 0
    }));

    // 2. Fetch courses with reservation info
    const [coursesData]: any = await connection.query(`
      SELECT 
        id, total_seats, 
        general_seats AS general,
        sc_seats AS sc,
        st_seats AS st,
        obc_seats AS obc
      FROM courses
    `);

    const courses: Record<number, Course> = {};
    coursesData.forEach((c: any) => {
      courses[c.id] = {
        id: c.id,
        total_seats: c.total_seats,
        general: c.general,
        sc: c.sc,
        st: c.st,
        obc: c.obc
      };
    });

    // 3. Initialize allocation structures
    const allocations = new Map<number, number>();
    const courseWaitlists: Record<number, Candidate[]> = {};

    // 4. Multi-round Deferred Acceptance algorithm
    let hasRejections = true;
    while (hasRejections) {
      hasRejections = false;
      const applications: Record<number, Candidate[]> = {};

      // Collect applications
      candidates.forEach(candidate => {
        if (!allocations.has(candidate.id) && 
            candidate.current_pref_index < candidate.preferences.length) {
          const courseId = candidate.preferences[candidate.current_pref_index];
          if (!applications[courseId]) applications[courseId] = [];
          applications[courseId].push(candidate);
        }
      });

      // Process each course's applications
      for (const [courseIdStr, applicants] of Object.entries(applications)) {
        const courseId = parseInt(courseIdStr);
        const course = courses[courseId];
        
        // Sort applicants by exam rank
        applicants.sort((a, b) => a.exam_rank - b.exam_rank);

        // Track seats per category
        const categoryCounts = {
          general: 0,
          sc: 0,
          st: 0,
          obc: 0
        };

        const selected: Candidate[] = [];
        
        for (const candidate of applicants) {
          const category = candidate.category.toLowerCase() as keyof typeof categoryCounts;
          
          // Handle invalid categories
          const validCategory = ['general', 'sc', 'st', 'obc'].includes(category) 
            ? category 
            : 'general';

          if (categoryCounts[validCategory] < course[validCategory]) {
            selected.push(candidate);
            categoryCounts[validCategory]++;
          } else if (categoryCounts.general < course.general) {
            selected.push(candidate);
            categoryCounts.general++;
          }
          
          if (selected.length >= course.total_seats) break;
        }

        // Update allocations
        selected.forEach(candidate => {
          allocations.set(candidate.id, courseId);
        });

        // Handle rejections
        applicants.slice(selected.length).forEach(candidate => {
          candidate.current_pref_index++;
          hasRejections = true;
        });

        courseWaitlists[courseId] = selected;
      }
    }

    // 5. Update database
    await connection.query('DELETE FROM seat_allocations');
    
    // Batch insert allocations
    if (allocations.size > 0) {
      const allocationEntries = Array.from(allocations.entries());
      await connection.query(
        `INSERT INTO seat_allocations (candidate_id, allocated_course_id) VALUES ?`,
        [allocationEntries]
      );
    }

    // Update course seats
    for (const [courseId, course] of Object.entries(courses)) {
      const waitlist = courseWaitlists[parseInt(courseId)] || [];
      
      await connection.query(
        `UPDATE courses SET
          available_seats = ?,
          general_seats = ?,
          sc_seats = ?,
          st_seats = ?,
          obc_seats = ?
         WHERE id = ?`,
        [
          course.total_seats - waitlist.length,
          course.general,
          course.sc,
          course.st,
          course.obc,
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
