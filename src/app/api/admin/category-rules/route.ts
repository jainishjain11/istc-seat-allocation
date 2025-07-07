import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await pool.query('SELECT * FROM category_rules ORDER BY id DESC LIMIT 1');
    
    // Debug logging
    console.log('📊 Category rules query result:', rows);
    
    if (rows.length === 0) {
      // If no rules exist, create default ones
      console.log('⚠️ No category rules found, creating defaults...');
      await pool.query(`
        INSERT INTO category_rules (sc_percentage, st_percentage, obc_percentage, ews_percentage) 
        VALUES (15.00, 7.50, 27.00, 10.00)
      `);
      
      // Fetch again
      const [newRows]: any = await pool.query('SELECT * FROM category_rules ORDER BY id DESC LIMIT 1');
      const rules = newRows[0];
      
      return NextResponse.json({ 
        success: true, 
        rules: {
          sc: rules.sc_percentage,
          st: rules.st_percentage,
          obc: rules.obc_percentage,
          ews: rules.ews_percentage,
          general: 100 - (rules.sc_percentage + rules.st_percentage + rules.obc_percentage + rules.ews_percentage)
        }
      });
    }
    
    const rules = rows[0];
    const general = 100 - (rules.sc_percentage + rules.st_percentage + 
                         rules.obc_percentage + rules.ews_percentage);
    
    return NextResponse.json({ 
      success: true, 
      rules: {
        sc: rules.sc_percentage,
        st: rules.st_percentage,
        obc: rules.obc_percentage,
        ews: rules.ews_percentage,
        general
      }
    });
    
  } catch (error: any) {
    console.error('❌ Category rules GET error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { sc, st, obc, ews } = await req.json();
    
    console.log('📝 Saving category rules:', { sc, st, obc, ews });
    
    // Check if any rules exist
    const [existing]: any = await pool.query('SELECT id FROM category_rules LIMIT 1');
    
    if (existing.length === 0) {
      // Insert new record
      await pool.query(
        `INSERT INTO category_rules (sc_percentage, st_percentage, obc_percentage, ews_percentage) 
         VALUES (?, ?, ?, ?)`,
        [sc, st, obc, ews]
      );
      console.log('✅ Inserted new category rules');
    } else {
      // Update existing record
      await pool.query(
        `UPDATE category_rules 
         SET sc_percentage = ?, st_percentage = ?, obc_percentage = ?, ews_percentage = ? 
         WHERE id = ?`,
        [sc, st, obc, ews, existing[0].id]
      );
      console.log('✅ Updated existing category rules');
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('❌ Category rules POST error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}