import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hours = parseInt(searchParams.get('hours') || '8', 10);
  
  try {
    const [logs]: any = await pool.query(`
      SELECT 
        al.id, 
        u.email, 
        al.activity_type, 
        al.details, 
        al.ip_address, 
        al.user_agent, 
        al.created_at 
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      WHERE al.created_at >= NOW() - INTERVAL ? HOUR
      ORDER BY al.created_at DESC
    `, [hours]);
    
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}