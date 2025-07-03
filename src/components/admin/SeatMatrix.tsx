'use client';
import { useState, useEffect } from 'react';

interface Course {
  id: number;
  course_name: string;
  total_seats: number;
  available_seats: number;
  // The following fields are kept for type safety but not displayed:
  general_seats: number;
  sc_seats: number;
  st_seats: number;
  obc_seats: number;
  ews_seats: number;
}

export default function SeatMatrix() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError('');
        
        const res = await fetch('/api/courses');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses || []);
        } else {
          throw new Error(data.error || 'Failed to fetch courses');
        }
      } catch (error: any) {
        console.error('Failed to fetch courses:', error);
        setError(error.message || 'Failed to load courses');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        background: '#f8fafc',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading seat matrix...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: '#fee2e2',
        border: '1px solid #fca5a5',
        borderRadius: '0.5rem',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <div style={{ color: '#dc2626', fontWeight: 600, marginBottom: '0.5rem' }}>
          Error Loading Seat Matrix
        </div>
        <div style={{ color: '#7f1d1d', fontSize: '0.875rem' }}>
          {error}
        </div>
      </div>
    );
  }

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '1rem 0.75rem',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  };

  const tdStyle: React.CSSProperties = {
    padding: '1rem 0.75rem',
    textAlign: 'center',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.875rem'
  };

  const courseNameStyle: React.CSSProperties = {
    ...tdStyle,
    textAlign: 'left',
    fontWeight: 600,
    color: '#1e293b',
    maxWidth: '250px'
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: '0.75rem' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: 'left', minWidth: '250px' }}>Course</th>
            <th style={thStyle}>Total Seats</th>
            <th style={thStyle}>Available</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <tr key={course.id} style={{ 
                backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white',
                transition: 'background-color 0.2s'
              }}>
                <td style={courseNameStyle}>{course.course_name}</td>
                <td style={tdStyle}>
                  <span style={{ 
                    fontWeight: 600, 
                    color: '#1e40af',
                    background: '#eff6ff',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem'
                  }}>
                    {course.total_seats}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ 
                    fontWeight: 600, 
                    color: course.available_seats > 0 ? '#10b981' : '#ef4444',
                    background: course.available_seats > 0 ? '#ecfdf5' : '#fef2f2',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem'
                  }}>
                    {course.available_seats}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ 
                ...tdStyle, 
                textAlign: 'center', 
                padding: '2rem',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                No courses found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        table tr:hover {
          background-color: #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
}
