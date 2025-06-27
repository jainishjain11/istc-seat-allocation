import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const connection = await pool.getConnection();
  try {
    const formData = await req.formData();
    const fileEntry = formData.get('csv');
    if (!fileEntry || !(fileEntry instanceof File)) {
      throw new Error('No file uploaded or file is not valid');
    }

    const buffer = Buffer.from(await fileEntry.arrayBuffer());
    const users: any[] = [];

    await new Promise<void>((resolve, reject) => {
      Readable.from(buffer)
        .pipe(csvParser())
        .on('data', (row) => {
          // Clean and validate the row data
          const cleanRow = {
            email: (row.email || '').trim(),
            dob: (row.dob || '').trim()
          };
          
          // Only add valid rows
          if (cleanRow.email && cleanRow.dob) {
            users.push(cleanRow);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (users.length === 0) {
      throw new Error('No valid user data found in CSV file');
    }

    await connection.beginTransaction();

    let successCount = 0;
    const errors = [];

    for (const user of users) {
      try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
          errors.push(`Invalid email format: ${user.email}`);
          continue;
        }

        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(user.dob)) {
          errors.push(`Invalid date format for ${user.email}: ${user.dob}`);
          continue;
        }

        // Use DOB as password
        const password = user.dob;
        
        // Insert user into database
        await connection.query(
          `INSERT INTO users (email, password, dob, is_admin, is_qualified) 
           VALUES (?, ?, ?, ?, ?)`,
          [user.email, password, user.dob, 0, 1] // is_admin=0, is_qualified=1
        );
        
        successCount++;
      } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
          errors.push(`Email already exists: ${user.email}`);
        } else {
          errors.push(`Error inserting ${user.email}: ${error.message}`);
        }
      }
    }

    await connection.commit();

    if (successCount === 0) {
      throw new Error(`No users were uploaded. Errors: ${errors.join(', ')}`);
    }

    return NextResponse.json({ 
      success: true, 
      count: successCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully uploaded ${successCount} users` + (errors.length > 0 ? ` with ${errors.length} errors` : '')
    });

  } catch (error: any) {
    await connection.rollback();
    return NextResponse.json(
      { success: false, error: error.message || 'User upload failed' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
// This code handles the upload of user data from a CSV file, parses it, and inserts it into the database.
// It uses the `csv-parser` library to read the CSV data and the `Readable` stream from Node.js to handle the file buffer.