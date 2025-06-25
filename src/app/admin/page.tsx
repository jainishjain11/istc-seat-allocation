'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    allocatedSeats: 0,
    availableSeats: 0,
    pendingApplications: 0
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>
          Welcome to ISTC Seat Allocation Management System
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard 
          title="Total Candidates" 
          value={stats.totalCandidates} 
          icon="👥" 
          color="#3b82f6" 
        />
        <StatCard 
          title="Allocated Seats" 
          value={stats.allocatedSeats} 
          icon="✅" 
          color="#10b981" 
        />
        <StatCard 
          title="Available Seats" 
          value={stats.availableSeats} 
          icon="📋" 
          color="#f59e0b" 
        />
        <StatCard 
          title="Pending Applications" 
          value={stats.pendingApplications} 
          icon="⏳" 
          color="#ef4444" 
        />
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ActionButton href="/admin/seat-allocation" text="Run Allocation" />
          <ActionButton href="/admin/statistics" text="View Statistics" />
          <ActionButton href="/admin/user-management" text="Upload Users" />
          <ActionButton href="/admin/system-settings" text="System Settings" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div style={{
      background: '#fff',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color }}>{value}</div>
          <div style={{ fontSize: '1rem', color: '#6b7280' }}>{title}</div>
        </div>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
      </div>
    </div>
  );
}

function ActionButton({ href, text }: any) {
  return (
    <a
      href={href}
      style={{
        padding: '0.75rem 1.5rem',
        background: '#1e40af',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontWeight: 500,
        transition: 'background-color 0.2s'
      }}
    >
      {text}
    </a>
  );
}
