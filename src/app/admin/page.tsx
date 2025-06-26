'use client';
import { useState, useEffect } from 'react';

const CARD_COLORS = ['#1e40af', '#10b981', '#fbbf24', '#ef4444'];

const CARD_ICONS = ['👥', '✅', '📋', '⏳'];

const CARD_TITLES = [
  'Total Candidates',
  'Allocated Seats',
  'Available Seats',
  'Pending Applications'
];

export default function AdminDashboard() {
  const [stats, setStats] = useState([0, 0, 0, 0]);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        const data = await res.json();
        if (data.success) {
          setStats([
            data.stats.totalCandidates,
            data.stats.allocatedSeats,
            data.stats.availableSeats,
            data.stats.pendingApplications
          ]);
        }
      } catch (error) {
        // fallback: do nothing
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: '0.25rem'
      }}>
        Admin Dashboard
      </h1>
      <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.15rem' }}>
        Welcome to ISTC Seat Allocation Management System
      </p>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
        marginBottom: '2.5rem'
      }}>
        {CARD_TITLES.map((title, idx) => (
          <div
            key={title}
            style={{
              background: '#fff',
              borderRadius: '1rem',
              boxShadow: '0 4px 16px rgba(30,64,175,0.09)',
              padding: '2rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              borderLeft: `5px solid ${CARD_COLORS[idx]}`
            }}
          >
            <div style={{
              fontSize: '2.5rem',
              background: `${CARD_COLORS[idx]}22`,
              color: CARD_COLORS[idx],
              borderRadius: '50%',
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {CARD_ICONS[idx]}
            </div>
            <div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: CARD_COLORS[idx]
              }}>
                {stats[idx]}
              </div>
              <div style={{
                color: '#334155',
                fontWeight: 500,
                fontSize: '1.1rem'
              }}>
                {title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(30,64,175,0.07)',
        padding: '2rem 1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontSize: '1.3rem',
          fontWeight: 600,
          color: '#1e40af',
          marginBottom: '1.2rem'
        }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/admin/seat-allocation" className="admin-action-btn" style={actionBtnStyle('#1e40af')}>Run Allocation</a>
          <a href="/admin/statistics" className="admin-action-btn" style={actionBtnStyle('#6366f1')}>View Statistics</a>
          <a href="/admin/user-management" className="admin-action-btn" style={actionBtnStyle('#10b981')}>Upload Users</a>
          <a href="/admin/system-settings" className="admin-action-btn" style={actionBtnStyle('#f59e0b')}>System Settings</a>
        </div>
      </div>
    </div>
  );
}

function actionBtnStyle(color: string) {
  return {
    background: color,
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.1rem',
    borderRadius: '0.5rem',
    padding: '0.9rem 2.2rem',
    textDecoration: 'none',
    transition: 'background 0.2s',
    boxShadow: '0 2px 8px rgba(30,64,175,0.07)',
    display: 'inline-block'
  } as React.CSSProperties;
}
