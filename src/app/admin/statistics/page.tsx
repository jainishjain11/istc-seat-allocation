'use client';
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
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

  // Bar chart data: breakdown by preference with shorter names
  const barData = data.map((course) => {
    let shortName = course.course_name;
    // Replace with shorter, specific names
    if (course.course_name.includes('Die & Mould')) {
      shortName = 'Die & Mould Making (Adv.)';
    } else if (course.course_name.includes('Mechatronics')) {
      shortName = 'Mechatronics & Industrial Automation';
    } else if (course.course_name.includes('Electronics')) {
      shortName = 'Electronics Engineering';
    } else if (course.course_name.includes('Mechanical')) {
      shortName = 'Mechanical Engineering (Tool & Die)';
    }
    
    return {
      name: shortName,
      '1st Choice': course.preference_1,
      '2nd Choice': course.preference_2,
      '3rd Choice': course.preference_3,
    };
  });

  // Total selections for percentage calculation
  const totalSelections = data.reduce((sum, c) => sum + c.total, 0);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>
        Candidate Course Preference Statistics
      </h1>

      {/* Equal-sized chart containers */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        height: '400px' 
      }}>
        {/* Pie Chart - 50% width */}
        <div style={{ 
          width: '50%',
          background: '#fff', 
          borderRadius: 8, 
          padding: '1.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.07)', 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e40af' }}>
            Total Preferences (Pie Chart)
          </h2>

          {/* Custom Legend - Top Right */}
          <div style={{ 
            position: 'absolute', 
            top: '3.5rem', 
            right: '1rem', 
            zIndex: 10,
            background: 'rgba(255,255,255,0.95)',
            padding: '0.75rem',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            fontSize: '0.75rem',
            maxWidth: '140px'
          }}>
            {pieData.map((entry, index) => (
              <div key={entry.name} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                marginBottom: '0.4rem'
              }}>
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  backgroundColor: COLORS[index % COLORS.length], 
                  marginRight: '0.5rem',
                  borderRadius: '2px',
                  marginTop: '2px',
                  flexShrink: 0
                }}></div>
                <span style={{ 
                  color: '#374151', 
                  fontWeight: 500,
                  lineHeight: '1.2'
                }}>
                  {entry.name}
                </span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ percent }) => {
                    const pct = percent ?? 0;
                    return `${(pct * 100).toFixed(1)}%`;
                  }}
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

        {/* Stacked Bar Chart - 50% width */}
        <div style={{ 
          width: '50%',
          background: '#fff', 
          borderRadius: 8, 
          padding: '1.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e40af' }}>
            Preference Breakdown (Stacked Bar)
          </h2>

          {/* Bar Chart Legend - Top Right */}
          <div style={{ 
            position: 'absolute', 
            top: '3.5rem', 
            right: '1rem', 
            zIndex: 10,
            background: 'rgba(255,255,255,0.95)',
            padding: '0.75rem',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#1e40af', 
                marginRight: '0.5rem',
                borderRadius: '2px'
              }}></div>
              <span style={{ color: '#374151', fontWeight: 500 }}>1st Choice</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#fbbf24', 
                marginRight: '0.5rem',
                borderRadius: '2px'
              }}></div>
              <span style={{ color: '#374151', fontWeight: 500 }}>2nd Choice</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#10b981', 
                marginRight: '0.5rem',
                borderRadius: '2px'
              }}></div>
              <span style={{ color: '#374151', fontWeight: 500 }}>3rd Choice</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={barData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  interval={0} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  fontSize={11}
                />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="1st Choice" stackId="a" fill="#1e40af" barSize={20} />
                <Bar dataKey="2nd Choice" stackId="a" fill="#fbbf24" barSize={20} />
                <Bar dataKey="3rd Choice" stackId="a" fill="#10b981" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Percentage Table */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e40af' }}>
          Percentage of Total Preferences
        </h2>
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
                <td style={{ padding: '0.5rem', color: COLORS[idx % COLORS.length], fontWeight: 600 }}>
                  {course.course_name}
                </td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{course.total}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>
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
