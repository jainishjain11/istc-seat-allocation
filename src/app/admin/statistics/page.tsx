'use client';
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#2563eb', '#facc15', '#34d399', '#f87171'];

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

  const pieData = data.map((course) => ({
    name: course.course_name,
    value: course.total,
  }));

  const barData = data.map((course) => {
    let shortName = course.course_name;
    if (course.course_name.includes('Die & Mould')) {
      shortName = 'Die & Mould (Adv.)';
    } else if (course.course_name.includes('Mechatronics')) {
      shortName = 'Mechatronics';
    } else if (course.course_name.includes('Electronics')) {
      shortName = 'Electronics';
    } else if (course.course_name.includes('Mechanical')) {
      shortName = 'Mechanical (Tool & Die)';
    }

    return {
      name: shortName,
      '1st Choice': course.preference_1,
      '2nd Choice': course.preference_2,
      '3rd Choice': course.preference_3,
    };
  });

  const totalSelections = data.reduce((sum, c) => sum + c.total, 0);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', color: '#1f2937' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
        📊 Candidate Course Preference Statistics
      </h1>

      <div style={{
        display: 'flex',
        gap: '2rem',
        marginBottom: '2.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Pie Chart Card */}
        <div style={{
          flex: 1,
          minWidth: 320,
          background: '#fff',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: 360,
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#2563eb' }}>
            Total Preferences (Pie Chart)
          </h2>

          {/* Legend - top right, smaller, full text */}
          <div style={{
            position: 'absolute',
            top: '2.5rem',
            right: '1.5rem',
            background: 'rgba(255,255,255,0.95)',
            padding: '0.5rem 0.7rem',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            border: '1px solid #e5e7eb',
            fontSize: '0.75rem',
            zIndex: 2,
            minWidth: 90,
            maxWidth: 180, // allow longer text
          }}>
            {pieData.map((entry, index) => (
              <div key={entry.name} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: index === pieData.length - 1 ? 0 : '0.25rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: COLORS[index % COLORS.length],
                  marginRight: '0.4rem',
                  borderRadius: '2px'
                }}></div>
                <span style={{
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  whiteSpace: 'normal', // allow wrapping
                  wordBreak: 'break-word'
                }}>{entry.name}</span>
              </div>
            ))}
          </div>

          <div style={{ width: '100%', height: 260, marginTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="42%" // Shift the pie chart left
                  cy="50%"
                  outerRadius={90}
                  label={({ percent = 0 }) => `${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Card */}
        <div style={{
          flex: 1,
          minWidth: 320,
          background: '#ffffff',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#2563eb' }}>
            Preference Breakdown (Bar Chart)
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" angle={-25} textAnchor="end" height={70} fontSize={12} tickLine={false} />
                <YAxis allowDecimals={false} tickLine={false} />
                <RechartsTooltip />
                <Bar dataKey="1st Choice" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="2nd Choice" fill="#facc15" radius={[6, 6, 0, 0]} />
                <Bar dataKey="3rd Choice" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '1rem',
            fontSize: '0.8rem',
            fontWeight: 500
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, background: '#2563eb', borderRadius: 4 }}></div>1st
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, background: '#facc15', borderRadius: 4 }}></div>2nd
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, background: '#34d399', borderRadius: 4 }}></div>3rd
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflowX: 'auto'
      }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#2563eb' }}>Percentage of Total Preferences</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>Course</th>
              <th style={{ textAlign: 'right', padding: '0.75rem 1rem' }}>Total Selections</th>
              <th style={{ textAlign: 'right', padding: '0.75rem 1rem' }}>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((course, idx) => (
              <tr key={course.course_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem 1rem', color: COLORS[idx % COLORS.length], fontWeight: 600 }}>
                  {course.course_name}
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{course.total}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  {totalSelections === 0 ? '0.0%' : `${((course.total / totalSelections) * 100).toFixed(1)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}