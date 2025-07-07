import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * Represents a course with seat allocation details
 */
interface Course {
  id: number;
  total_seats: number;
  general: number;      // General category seats
  sc: number;           // Scheduled Caste seats
  st: number;           // Scheduled Tribe seats
  obc: number;          // Other Backward Classes seats
  ews: number;          // Economically Weaker Section seats
  available: number;    // Total available seats
}

/**
 * Represents a candidate with allocation details
 */
interface Candidate {
  id: number;
  exam_rank: number;    // Candidate's rank (lower is better)
  category: string;     // GEN, SC, ST, OBC, or EWS
  preferences: number[]; // Ordered list of preferred course IDs
  current_allocation: number | null; // Currently allocated course ID
}

/**
 * Maps candidate categories to course seat properties
 */
function getCategorySeatKey(category: string): keyof Course {
  const map: Record<string, keyof Course> = {
    'GEN': 'general',
    'SC': 'sc',
    'ST': 'st',
    'OBC': 'obc',
    'EWS': 'ews'
  };
  return map[category] || 'general';
}

export async function POST() {
  const connection = await pool.getConnection();
  try {
    console.log('🚀 Starting seat allocation process');
    await connection.beginTransaction();

    // ==============================
    // PHASE 1: INITIALIZATION
    // ==============================
    console.log('🔍 Fetching category rules...');
    const [categoryRules]: any = await connection.query('SELECT * FROM category_rules LIMIT 1');
    
    if (categoryRules.length === 0) {
      throw new Error('Category rules not found. Please configure reservation rules first.');
    }
    
    const { sc_percentage, st_percentage, obc_percentage, ews_percentage } = categoryRules[0];
    console.log(`📊 Using reservation rules: SC=${sc_percentage}%, ST=${st_percentage}%, OBC=${obc_percentage}%, EWS=${ews_percentage}%`);

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

    // ==============================
    // PHASE 2: SEAT CALCULATION
    // ==============================
    const courses: Record<number, Course> = {};
    
    coursesData.forEach((c: any) => {
      const total = c.total_seats;
      
      const sc = Math.floor(total * (sc_percentage / 100));
      const st = Math.floor(total * (st_percentage / 100));
      const obc = Math.floor(total * (obc_percentage / 100));
      const ews = Math.floor(total * (ews_percentage / 100));
      const general = total - (sc + st + obc + ews);
      
      courses[c.id] = {
        id: c.id,
        total_seats: total,
        general,
        sc,
        st,
        obc,
        ews,
        available: total
      };
      
      console.log(`📚 Course ${c.id}: ${c.course_name} - ` +
        `Total: ${total}, ` +
        `SC: ${sc}, ST: ${st}, OBC: ${obc}, EWS: ${ews}, ` +
        `General: ${general}`);
    });

    const candidates: Candidate[] = candidatesData.map((c: any) => ({
      ...c,
      preferences: c.preferences.split(',').map(Number),
      current_allocation: null
    }));

    // ==============================
    // PHASE 3: MAIN ALLOCATION LOGIC
    // ==============================
    const allocations = new Map<number, number>();
    let changed: boolean;
    let iteration = 0;

    do {
      iteration++;
      changed = false;
      console.log(`\n🔄 Starting allocation iteration ${iteration}`);
      
      // Sort candidates by rank (merit order)
      const candidateQueue = [...candidates]
        .filter(c => !allocations.has(c.id))
        .sort((a, b) => a.exam_rank - b.exam_rank);

      for (const candidate of candidateQueue) {
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

          const categoryKey = getCategorySeatKey(candidate.category);
          console.log(`   🔍 Checking ${categoryKey} seats: ${course[categoryKey]}`);

          // FIRST: Try to allocate in candidate's reserved category (if not GEN)
          if (candidate.category !== 'GEN' && course[categoryKey] > 0) {
            console.log(`   ✅ Allocating reserved ${categoryKey} seat in Course ${preference}`);
            course[categoryKey]--;
            course.available--;
            allocations.set(candidate.id, preference);
            changed = true;
            console.log(`   ➖ Remaining ${categoryKey} seats: ${course[categoryKey]}`);
            break;
          }
          // SECOND: Try to allocate in general category (for all candidates)
          else if (course.general > 0) {
            console.log(`   ✅ Allocating general seat in Course ${preference}`);
            course.general--;
            course.available--;
            allocations.set(candidate.id, preference);
            changed = true;
            console.log(`   ➖ Remaining general seats: ${course.general}`);
            break;
          }
          else {
            console.log(`   ❌ No seats available in Course ${preference} for candidate`);
          }
        }
      }

      // AFTER processing all candidates, convert unused reserved seats to general
      console.log('\n🔄 Converting unused reserved seats to general for next iteration');
      for (const course of Object.values(courses) as Course[]) {
        const reservedSeats = course.sc + course.st + course.obc + course.ews;
        if (reservedSeats > 0) {
          console.log(`   Course ${course.id}: Converting ${reservedSeats} unused reserved seats to general`);
          course.general += reservedSeats;
          course.sc = 0;
          course.st = 0;
          course.obc = 0;
          course.ews = 0;
        }
      }

    } while (changed);

    // ==============================
    // PHASE 4: UPDATE DATABASE
    // ==============================
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