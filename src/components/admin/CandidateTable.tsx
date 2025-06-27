'use client';
import { useState, useEffect } from 'react';

interface Candidate {
  id: number;
  full_name: string;
  exam_rank: number;
  category: string;
  allocated_course: string | null;
  allocation_status: string;
}

export default function CandidateTable() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError('');
        
        const res = await fetch('/api/admin/candidates');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success) {
          setCandidates(data.candidates || []);
        } else {
          throw new Error(data.error || 'Failed to fetch candidates');
        }
      } catch (error: any) {
        console.error('Failed to fetch candidates:', error);
        setError(error.message || 'Failed to load candidates');
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidates();
  }, []);

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate => 
    candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.exam_rank.toString().includes(searchTerm) ||
    candidate.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (candidate.allocated_course && candidate.allocated_course.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Allocated': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Not Allocated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        background: '#fff',
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
          <p style={{ color: '#6b7280' }}>Loading candidates...</p>
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
          Error Loading Candidates
        </div>
        <div style={{ color: '#7f1d1d', fontSize: '0.875rem' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      background: '#fff'
    }}>
      {/* Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            width: '300px'
          }}
        />
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#374151' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#374151' }}>Name</th>
              <th style={{ textAlign: 'center', padding: '0.75rem 1rem', fontWeight: 600, color: '#374151' }}>Rank</th>
              <th style={{ textAlign: 'center', padding: '0.75rem 1rem', fontWeight: 600, color: '#374151' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600, color: '#374151' }}>Allocated Course</th>
              <th style={{ textAlign: 'center', padding: '0.75rem 1rem', fontWeight: 600, color: '#374151' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentCandidates.length > 0 ? (
              currentCandidates.map((candidate) => (
                <tr key={candidate.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>#{candidate.id}</td>
                  <td style={{ padding: '1rem' }}>{candidate.full_name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>{candidate.exam_rank}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>{candidate.category}</td>
                  <td style={{ padding: '1rem' }}>
                    {candidate.allocated_course || (
                      <span style={{ color: '#9ca3af' }}>Not allocated</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      ...getStatusColors(candidate.allocation_status)
                    }}>
                      {candidate.allocation_status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No candidates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              margin: '0 0.25rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              background: currentPage === 1 ? '#f3f4f6' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                padding: '0.5rem 1rem',
                margin: '0 0.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: currentPage === page ? '#3b82f6' : 'white',
                color: currentPage === page ? 'white' : '#374151',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              margin: '0 0.25rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              background: currentPage === totalPages ? '#f3f4f6' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Loading Animation CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function getStatusColors(status: string) {
  switch (status) {
    case 'Allocated': 
      return { backgroundColor: '#dcfce7', color: '#166534' };
    case 'Pending': 
      return { backgroundColor: '#fef3c7', color: '#92400e' };
    case 'Not Allocated': 
      return { backgroundColor: '#fee2e2', color: '#b91c1c' };
    default: 
      return { backgroundColor: '#f3f4f6', color: '#374151' };
  }
}
