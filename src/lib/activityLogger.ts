import pool from './db';

export async function logActivity(
  userId: number,
  activityType: string,
  details: string = '',
  request?: Request
) {
  try {
    let ip = '';
    let userAgent = '';
    
    if (request) {
      ip = request.headers.get('x-forwarded-for') || '';
      userAgent = request.headers.get('user-agent') || '';
    }

    await pool.query(
      `INSERT INTO activity_logs 
       (user_id, activity_type, details, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, activityType, details, ip, userAgent]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
