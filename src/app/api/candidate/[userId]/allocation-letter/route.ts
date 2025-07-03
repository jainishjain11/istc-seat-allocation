import { NextResponse } from 'next/server';
import pool from '@/lib/db';
// @ts-ignore
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    // 1. Get candidate by userId
    const [candidates]: any = await pool.query(
      'SELECT id, full_name, phone FROM candidates WHERE user_id = ?',
      [userId]
    );
    if (!candidates.length) {
      return NextResponse.json(
        { success: false, error: 'Candidate not found' },
        { status: 404 }
      );
    }
    const candidate = candidates[0];

    // 2. Get allocation and course details
    const [allocations]: any = await pool.query(
      `SELECT 
        c.course_name, 
        c.course_code, 
        sa.allocated_at
       FROM seat_allocations sa
       JOIN courses c ON sa.allocated_course_id = c.id
       WHERE sa.candidate_id = ?`,
      [candidate.id]
    );
    if (!allocations.length) {
      return NextResponse.json(
        { success: false, error: 'No allocation found for this candidate' },
        { status: 404 }
      );
    }
    const allocation = allocations[0];

    // 3. Get user email
    const [users]: any = await pool.query(
      'SELECT email FROM users WHERE id = ?',
      [userId]
    );
    const email = users[0]?.email || 'N/A';

    // 4. Get doc verification date
    const [settings]: any = await pool.query(
      'SELECT doc_verification_date FROM system_settings'
    );
    let verificationDateStr: string = 'To be announced';
    if (settings[0]?.doc_verification_date) {
      const rawDate = String(settings[0].doc_verification_date).trim();
      // Accept YYYY-MM-DD or YYYY-MM-DD HH:MM:SS
      const dateMatch = rawDate.match(/^(\d{4}-\d{2}-\d{2})/);
      if (dateMatch && !isNaN(Date.parse(dateMatch[1]))) {
        verificationDateStr = new Date(dateMatch[1]).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    }

    // 5. Load both logos as base64
    let csioLogoBase64: string = '';
    let istcLogoBase64: string = '';
    try {
      const csioLogoPath = path.join(process.cwd(), 'public/images/csio-logo.jpg');
      const istcLogoPath = path.join(process.cwd(), 'public/images/istc-logo.jpg');
      csioLogoBase64 = `data:image/jpeg;base64,${fs.readFileSync(csioLogoPath).toString('base64')}`;
      istcLogoBase64 = `data:image/jpeg;base64,${fs.readFileSync(istcLogoPath).toString('base64')}`;
    } catch {
      csioLogoBase64 = '';
      istcLogoBase64 = '';
    }

    // 6. Prepare values with safe fallbacks
    const fullName: string = String(candidate.full_name ?? 'Candidate');
    const phone: string = String(candidate.phone ?? 'N/A');
    const courseName: string = String(allocation.course_name ?? 'N/A');
    const courseCode: string = String(allocation.course_code ?? 'N/A');

    // 7. Create PDF
    const doc = new jsPDF();

    // --- HEADER ---
    // Left logo
    if (csioLogoBase64) doc.addImage(csioLogoBase64, 'JPEG', 15, 12, 22, 22);
    // Right logo
    if (istcLogoBase64) doc.addImage(istcLogoBase64, 'JPEG', 173, 12, 22, 22);

    // Centered header text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('INDO-SWISS TRAINING CENTRE', 105, 22, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('CSIR-Central Scientific Instruments Organisation', 105, 28, { align: 'center' });

    doc.setFontSize(9.5);
    doc.text(
      '(Council of Scientific & Industrial Research, Ministry of Science and Technology, Govt. of India)',
      105,
      33,
      { align: 'center' }
    );

    doc.setFontSize(10);
    doc.text('Sector 30-C, Chandigarh-160 030', 105, 38, { align: 'center' });

    // --- Date (right-aligned) ---
    doc.setFontSize(12);
    doc.text(
      `Date: ${verificationDateStr}`,
      200,
      48,
      { align: 'right' }
    );

    // --- Main Content ---
    let y = 58;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`To: ${fullName}`, 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Email: ${email}`, 20, y);
    y += 8;
    doc.text(`Phone: ${phone}`, 20, y);
    y += 14;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Seat Allocation Letter', 105, y, { align: 'center' });
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Subject: Seat Allocation Confirmation', 20, y);
    y += 10;

    doc.text(
      'We are pleased to inform you that you have been allocated a seat in the following course at ',
      20,
      y
    );
    y += 8;
    doc.text(
      'Indo-Swiss Training Centre, CSIO, CSIR, Chandigarh:',
      20,
      y
    );
    
    y += 10;
    doc.text(`Course Name: ${courseName}`, 20, y);
    y += 8;
    doc.text(`Course Code: ${courseCode}`, 20, y);
    y += 8;
    doc.text(
      `Document Verification Date: ${verificationDateStr}`,
      20,
      y
    );
    y += 14;

    doc.setFont('helvetica', 'bold');
    doc.text('Next Steps:', 20, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    doc.text('1. Report to the institute for document verification on the above date.', 25, y);
    y += 8;
    doc.text('2. Complete the admission process within 7 days of verification.', 25, y);
    y += 8;
    doc.text('3. Bring all original documents for verification.', 25, y);
    y += 16;

    doc.text('Sincerely,', 20, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Admissions Office', 20, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    doc.text('Indo Swiss Training Centre', 20, y);

    // --- FOOTER ---
    // Draw a line above the footer
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(15, 282, 195, 282);

    // Footer content 
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text(
      'Telephone : 0172-2672263, 2657264 (Direct)                E-mail : principalistc@csio.res.in, principalistc@gmail.com',
      18,
      287
    );
    doc.text(
      'Website : www.istc.ac.in, www.csio.res.in                   Telefax : 0172-2657264',
      18,
      292
    );

    // Output PDF as response
    const pdfBuffer = doc.output('arraybuffer');
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ISTC-Allocation-Letter-${fullName.replace(/\s+/g, '-')}.pdf"`
      }
    });

  } catch (error: any) {
    console.error('Allocation letter error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate allocation letter' },
      { status: 500 }
    );
  }
}
