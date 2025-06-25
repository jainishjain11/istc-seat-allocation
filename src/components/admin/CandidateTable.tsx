// src/components/admin/CandidateTable.tsx
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch('/api/admin/candidates');
        const data = await res.json();
        if (data.success) {
          setCandidates(data.candidates);
        }
      } catch (error) {
        console.error('Failed to fetch candidates');
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="candidate-table-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-results">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </span>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="candidate-table">
          <thead>
            <tr>
              <th className="text-left">ID</th>
              <th className="text-left">Name</th>
              <th className="text-center">Rank</th>
              <th className="text-center">Category</th>
              <th className="text-left">Allocated Course</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentCandidates.length > 0 ? (
              currentCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="font-medium">#{candidate.id}</td>
                  <td>{candidate.full_name}</td>
                  <td className="text-center">{candidate.exam_rank}</td>
                  <td className="text-center">{candidate.category}</td>
                  <td>
                    {candidate.allocated_course || (
                      <span className="text-gray-400">Not allocated</span>
                    )}
                  </td>
                  <td className="text-center">
                    <span className={`status-badge ${getStatusColor(candidate.allocation_status)}`}>
                      {candidate.allocation_status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No candidates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
