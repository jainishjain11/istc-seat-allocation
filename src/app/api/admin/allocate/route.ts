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
    console.log('🚀 Starting seat allocation process');
    await connection.beginTransaction();

    // Phase 1: Initialize Data
    console.log('🔍 Fetching candidates and courses...');
    const [candidatesData]: any = await connection.query(`
      SELECT 
        c.id, c.exam_rank, c.category,
        GROUP_CONCAT(cp.course_id ORDER BY cp.preference_order) AS preferences
      FROM candidates c
      JOIN course_preferences cp ON c.id = cp.candidate_id
      WHERE c.application_status = 'Submitted'
      GROUP BY c.id
      ORDER BY c.exam_rank ASC
    `);

    const [coursesData]: any = await connection.query(`SELECT * FROM courses`);
    console.log(`📊 Found ${candidatesData.length} candidates and ${coursesData.length} courses`);

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
        available: c.general_seats + c.sc_seats + c.st_seats + c.obc_seats + c.ews_seats,
      };
      console.log(`📚 Course ${c.id}: ${c.course_name} - Available: ${courses[c.id].available}`);
    });

    // Phase 3: Main Allocation Logic
    const allocations = new Map<number, number>();
    let changed: boolean;
    let iteration = 0;

    do {
      iteration++;
      changed = false;
      console.log(`\n🔄 Starting allocation iteration ${iteration}`);
      
      const candidateQueue = [...candidates].sort((a, b) => a.exam_rank - b.exam_rank);

      for (const candidate of candidateQueue) {
        if (allocations.has(candidate.id)) {
          console.log(`⏩ Candidate ${candidate.id} already allocated, skipping`);
          continue;
        }

        console.log(`\n👤 Processing Candidate ${candidate.id} (Rank: ${candidate.exam_rank}, Category: ${candidate.category})`);
        console.log(`   Preferences: ${candidate.preferences.join(', ')}`);

        for (const preference of candidate.preferences) {
          const course = courses[preference];
          if (!course) {
            console.log(`   ❌ Course ${preference} not found, skipping preference`);
            continue;
          }

          console.log(`   🏫 Checking Course ${preference} - Available: ${course.available}`);
          if (course.available <= 0) {
            console.log(`   ❌ Course ${preference} has no available seats`);
            continue;
          }

          const category = candidate.category.toLowerCase() as keyof Course;
          console.log(`   🔍 Checking ${category} seats: ${course[category]}`);

          // Validate category exists in course
          if (!(category in course)) {
            console.log(`   ❌ Invalid category '${category}' for candidate ${candidate.id}`);
            continue;
          }

          if (course[category] > 0) {
            console.log(`   ✅ Allocating reserved ${category} seat in Course ${preference}`);
            course[category]--;
            course.available--;
            allocations.set(candidate.id, preference);
            changed = true;
            console.log(`   ➖ Remaining ${category} seats: ${course[category]}`);
            break;
          } else if (course.general > 0) {
            console.log(`   ✅ Allocating general seat in Course ${preference}`);
            course.general--;
            course.available--;
            allocations.set(candidate.id, preference);
            changed = true;
            console.log(`   ➖ Remaining general seats: ${course.general}`);
            break;
          } else {
            console.log(`   ❌ No seats available in Course ${preference}`);
          }
        }
      }

      // Phase 4: Convert unused reserved seats to general
      console.log('\n🔄 Converting unused reserved seats to general');
      for (const course of Object.values(courses) as Course[]) {
        const reservedSeats = course.sc + course.st + course.obc + course.ews;
        if (reservedSeats > 0) {
          console.log(`   Course ${course.id}: Converting ${reservedSeats} reserved seats to general`);
          course.general += reservedSeats;
          course.sc = 0;
          course.st = 0;
          course.obc = 0;
          course.ews = 0;
        }
      }

    } while (changed);

    // Phase 5: Update Database
    console.log('\n💾 Updating database with allocation results');
    await connection.query('DELETE FROM seat_allocations');
    
    const allocationEntries = Array.from(allocations.entries()).map(([cid, courseId]) => [cid, courseId]);
    if (allocationEntries.length > 0) {
      console.log(`💡 Inserting ${allocationEntries.length} allocations`);
      await connection.query(
        `INSERT INTO seat_allocations (candidate_id, allocated_course_id) VALUES ?`,
        [allocationEntries]
      );
    }

    console.log('\n📈 Updating course seat availability');
    for (const [courseId, course] of Object.entries(courses)) {
      console.log(`   Course ${courseId}: 
        Available: ${course.available}
        General: ${course.general}
        SC: ${course.sc}
        ST: ${course.st}
        OBC: ${course.obc}
        EWS: ${course.ews}`);
      
      await connection.query(
        `UPDATE courses SET
          available_seats = ?,
          general_seats = ?,
          sc_seats = ?,
          st_seats = ?,
          obc_seats = ?,
          ews_seats = ?
         WHERE id = ?`,
        [course.available, course.general, course.sc, course.st, course.obc, course.ews, courseId]
      );
    }

    await connection.commit();
    console.log(`\n🎉 Allocation complete! Allocated ${allocations.size} candidates`);
    
    return NextResponse.json({ 
      success: true,
      allocated: allocations.size,
      total_candidates: candidates.length 
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('💥 Allocation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Allocation failed' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
