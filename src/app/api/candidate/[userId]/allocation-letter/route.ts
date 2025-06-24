// src/app/api/candidate/[userId]/allocation-letter/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    // Get candidate details
    const [candidates]: any = await pool.query(
      `SELECT 
        c.full_name,
        u.email,
        c.phone,
        co.course_name,
        co.course_code,
        sa.allocated_at
       FROM candidates c
       JOIN users u ON c.user_id = u.id
       JOIN seat_allocations sa ON c.id = sa.candidate_id
       JOIN courses co ON sa.allocated_course_id = co.id
       WHERE u.id = ?`,
      [userId]
    );

    if (candidates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Candidate not found' },
        { status: 404 }
      );
    }

    const candidate = candidates[0];
    
    // Create Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // ISTC Header
          new Paragraph({
            children: [
              new TextRun({
                text: "Indo Swiss Training Centre",
                bold: true,
                size: 32,
              }),
              new TextRun({
                text: "Chandigarh, India",
                break: 1,
                size: 24,
              }),
            ],
            alignment: "center",
          }),
          
          // Allocation Letter Title
          new Paragraph({
            text: "Seat Allocation Letter",
            heading: HeadingLevel.HEADING_1,
            alignment: "center",
            spacing: { after: 400 },
          }),
          
          // Candidate Details
          new Paragraph({
            children: [
              new TextRun({ text: `Date: ${new Date().toLocaleDateString('en-IN')}`, bold: true }),
              new TextRun({ text: `\nTo: ${candidate.full_name}`, bold: true }),
              new TextRun({ text: `\nEmail: ${candidate.email}`, bold: true }),
              new TextRun({ text: `\nPhone: ${candidate.phone}`, bold: true }),
            ],
          }),
          
          // Allocation Details
          new Paragraph({
            children: [
              new TextRun({ text: "Subject: Seat Allocation Confirmation", bold: true }),
            ],
            spacing: { before: 200 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "We are pleased to inform you that you have been allocated a seat in the following course at Indo Swiss Training Centre:",
              }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Course Name: ", bold: true }),
              new TextRun(candidate.course_name),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Course Code: ", bold: true }),
              new TextRun(candidate.course_code),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Allocation Date: ", bold: true }),
              new TextRun(new Date(candidate.allocated_at).toLocaleDateString('en-IN')),
            ],
          }),
          
          // Instructions
          new Paragraph({
            children: [
              new TextRun({ text: "Next Steps:", bold: true }),
            ],
            spacing: { before: 200 },
          }),
          
          new Paragraph({
            text: "1. Report to the institute for document verification",
          }),
          
          new Paragraph({
            text: "2. Complete the admission process within 7 days of allocation",
          }),
          
          new Paragraph({
            text: "3. Bring all original documents for verification",
          }),
          
          // Signature
          new Paragraph({
            text: "Sincerely,",
            spacing: { before: 400 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Admissions Office", bold: true }),
            ],
          }),
          
          new Paragraph({
            text: "Indo Swiss Training Centre",
          }),
        ],
      }],
    });

    // Generate document as buffer
    const buffer = await Packer.toBuffer(doc);
    
    // Return as downloadable file
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="ISTC-Allocation-Letter-${candidate.full_name.replace(/\s+/g, '-')}.docx"`
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
