import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import csvParser from 'csv-parser'; // npm install csv-parser
import { Readable } from 'stream';

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
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
        .on('data', (row) => users.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    for (const user of users) {
      await pool.query(
        'INSERT INTO users (email, password, full_name, phone, aadhar_id, dob) VALUES (?, ?, ?, ?, ?, ?)',
        [user.email, user.password, user.full_name, user.phone, user.aadhar_id, user.dob]
      );
    }

    return NextResponse.json({ success: true, count: users.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
// This code handles the upload of user data from a CSV file, parses it, and inserts it into the database.
// It uses the `csv-parser` library to read the CSV data and the `Readable` stream from Node.js to handle the file buffer.