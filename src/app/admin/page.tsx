'use client';
import { useState, useEffect } from 'react';

const CARD_COLORS = ['#1e40af', '#10b981', '#fbbf24', '#ef4444'];
const CARD_ICONS = ['👥', '✅', '📋', '⏳'];
const CARD_TITLES = [
  'Total Candidates',
  'Allocated Seats',
  'Available Seats',
  'System Last Reset Time'
];

export default function AdminDashboard() {
  const [stats, setStats] = useState([0, 0, 0, '']);
  const [registrationsLocked, setRegistrationsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/admin/dashboard-stats');
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats([
            statsData.stats.totalCandidates,
            statsData.stats.allocatedSeats,
            statsData.stats.availableSeats,
            statsData.stats.lastResetTime || ''
          ]);
        }

        const lockRes = await fetch('/api/admin/lock-status');
        const lockData = await lockRes.json();
        if (lockData.success) {
          setRegistrationsLocked(lockData.registrations_locked);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const toggleRegistrationsLock = async () => {
    setLoading(true);
    try {
      const newLockStatus = !registrationsLocked;
      const res = await fetch('/api/admin/lock-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lock: newLockStatus })
      });
      const data = await res.json();
      if (data.success) {
        setRegistrationsLocked(newLockStatus);
      }
    } catch (error) {
      console.error('Failed to toggle lock:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.15rem' }}>
            Welcome to ISTC Seat Allocation Management System
          </p>
        </div>
        
        <button
          onClick={toggleRegistrationsLock}
          disabled={loading}
          style={{
            background: registrationsLocked ? '#ef4444' : '#10b981',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.1rem',
            borderRadius: '0.5rem',
            padding: '0.8rem 1.5rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1
          }}
        >
          {registrationsLocked ? 'Unlock Registrations' : 'Lock Registrations'}
          {loading && <span className="lock-spinner"></span>}
        </button>
      </div>

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
                {idx === 3 && stats[3]
                  ? new Date(stats[3]).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                  : stats[idx]}
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

      <style jsx>{`
        .lock-spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
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
