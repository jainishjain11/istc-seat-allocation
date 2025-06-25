'use client';
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#1e40af', '#fbbf24', '#10b981', '#ef4444', '#6366f1', '#f59e42', '#3b82f6'];

export default function AdminStatisticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/course-preference-stats')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (!data || data.length === 0) return <div>No data available.</div>;

  // Pie chart data: total selections per course
  const pieData = data.map((course) => ({
    name: course.course_name,
    value: course.total,
  }));

  // Bar chart data: breakdown by preference
  const barData = data.map((course) => ({
    name: course.course_name,
    '1st Choice': course.preference_1,
    '2nd Choice': course.preference_2,
    '3rd Choice': course.preference_3,
  }));

  // Total selections for percentage calculation
  const totalSelections = data.reduce((sum, c) => sum + c.total, 0);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>
        Candidate Course Preference Statistics
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
        {/* Pie Chart */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 8, padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e40af' }}>Total Preferences (Pie Chart)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              >
                {pieData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stacked Bar Chart */}
        <div style={{ flex: 1.5, minWidth: 400, background: '#fff', borderRadius: 8, padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e40af' }}>Preference Breakdown (Stacked Bar)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="1st Choice" stackId="a" fill="#1e40af" />
              <Bar dataKey="2nd Choice" stackId="a" fill="#fbbf24" />
              <Bar dataKey="3rd Choice" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Percentage Table */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e40af' }}>Percentage of Total Preferences</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Course</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Total Selections</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((course, idx) => (
              <tr key={course.course_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.5rem', color: COLORS[idx % COLORS.length], fontWeight: 600 }}>{course.course_name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{course.total}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                  {totalSelections === 0 ? '0.0%' : ((course.total / totalSelections) * 100).toFixed(1) + '%'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
