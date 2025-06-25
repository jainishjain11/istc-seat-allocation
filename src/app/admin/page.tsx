'use client';
import { useState, useEffect } from 'react';
import AdminCard from '@/components/admin/AdminCard';

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
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-subtitle">Welcome to ISTC Seat Allocation Management System</p>
      
      <div className="stats-grid">
        <AdminCard 
          title="Total Candidates" 
          value={stats.totalCandidates} 
          icon="👥"
          color="#3b82f6"
        />
        <AdminCard 
          title="Allocated Seats" 
          value={stats.allocatedSeats} 
          icon="✅"
          color="#10b981"
        />
        <AdminCard 
          title="Available Seats" 
          value={stats.availableSeats} 
          icon="📋"
          color="#f59e0b"
        />
        <AdminCard 
          title="Pending Applications" 
          value={stats.pendingApplications} 
          icon="⏳"
          color="#ef4444"
        />
      </div>
      
      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="action-buttons">
          <a href="/admin/seat-allocation" className="action-button bg-blue-600">
            Run Allocation
          </a>
          <a href="/admin/statistics" className="action-button bg-purple-600">
            View Statistics
          </a>
          <a href="/admin/user-management" className="action-button bg-green-600">
            Upload Users
          </a>
          <a href="/admin/system-settings" className="action-button bg-amber-600">
            System Settings
          </a>
        </div>
      </div>
    </div>
  );
}
