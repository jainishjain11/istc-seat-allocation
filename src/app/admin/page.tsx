'use client';
import { useEffect, useState } from 'react';
import styles from './admin.module.css'; // Import CSS module

type Candidate = {
  id: number;
  full_name: string;
  category: string;
  exam_rank: number;
  preferences: string;
  allocated_course?: string;
};

type Course = {
  id: number;
  course_name: string;
  total_seats: number;
  available_seats: number;
};

type AllocationResult = {
  success: boolean;
  error?: string;
  message?: string;
} | null;

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allocating, setAllocating] = useState(false);
  const [allocationResult, setAllocationResult] = useState<AllocationResult>(null);
  const [published, setPublished] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Candidate; direction: 'asc' | 'desc' } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      setCandidates(data.candidates);
      setCourses(data.courses);
      
      const pubRes = await fetch('/api/admin/publication-status');
      const pubData = await pubRes.json();
      setPublished(pubData.published);
    };
    fetchData();
  }, []);

  // Sorting logic
  const sortedCandidates = [...candidates].sort((a: Candidate, b: Candidate) => {
  if (!sortConfig) return 0;
  const { key, direction } = sortConfig;
  
  // Type-safe comparison
  const aValue = a[key];
  const bValue = b[key];

  if (typeof aValue === 'string' && typeof bValue === 'string') {
    return direction === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  }

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return direction === 'asc' ? aValue - bValue : bValue - aValue;
  }

  return 0;
});

  // Filtering logic
  const filteredCandidates = sortedCandidates.filter(candidate => 
    categoryFilter === 'all' || candidate.category === categoryFilter
  );

  const handleSort = (key: keyof Candidate) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleAllocate = async () => {
    setAllocating(true);
    try {
      const res = await fetch('/api/admin/allocate', { method: 'POST' });
      const data = await res.json();
      setAllocationResult(data);
      // Refresh data after allocation
      const refreshRes = await fetch('/api/admin/data');
      const refreshData = await refreshRes.json();
      setCandidates(refreshData.candidates);
      setCourses(refreshData.courses);
    } finally {
      setAllocating(false);
    }
  };

  const handlePublish = async () => {
    await fetch('/api/admin/publish', { method: 'POST' });
    setPublished(true);
  };

  const handleExportCandidates = () => {
    window.open('/api/admin/export/candidates', '_blank');
  };

  const handleExportCourses = () => {
    window.open('/api/admin/export/courses', '_blank');
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.sectionTitle}>Admin Dashboard</h1>
      
      {/* Action Buttons */}
      <div className={styles.actionBar}>
        <button
          className={styles.actionButton}
          onClick={handleAllocate}
          disabled={allocating}
        >
          {allocating ? 'Allocating...' : 'Release Seat Allocation'}
        </button>
        
        <button
          className={styles.actionButton}
          onClick={handlePublish}
          disabled={published}
        >
          {published ? 'Results Published' : 'Publish Results'}
        </button>

        <button
          className={styles.actionButton}
          onClick={async () => {
            await fetch('/api/admin/unpublish', { method: 'POST' });
            setPublished(false);
          }}
          disabled={!published}
        >
          Unpublish Results
        </button>

        <button
          className={styles.actionButton}
          onClick={handleExportCandidates}
        >
          Export Candidates
        </button>

        <button
          className={styles.actionButton}
          onClick={handleExportCourses}
        >
          Export Courses
        </button>
      </div>

      {/* Status Messages */}
      {allocationResult && (
        <div className={allocationResult.success ? styles.statusSuccess : styles.statusError}>
          {allocationResult.success ? "Seat allocation completed!" : allocationResult.error}
        </div>
      )}

  

      {/* Seat Matrix */}
      <div className={styles.dataCard}>
        <h2 className={styles.sectionTitle}>Seat Matrix</h2>
        <div className={styles.gridContainer}>
          {courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <h4 className={styles.courseTitle}>{course.course_name}</h4>
              <div className={styles.seatInfo}>
                <span>Total: {course.total_seats}</span>
                <span>Available: {course.available_seats}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Category Filter - Fix the dropdown */}
<div className={styles.dataCard}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <label className={styles.formLabel}>Filter by Category:</label>
    <select
      className={styles.formSelect}
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
      style={{ minWidth: '200px' }} // Ensure adequate width
    >
      <option value="all">All Categories</option>
      <option value="General">General</option>
      <option value="SC">SC</option>
      <option value="ST">ST</option>
      <option value="OBC">OBC</option>
    </select>
  </div>
</div>

      {/* Candidates Table */}
      <div className={styles.dataCard}>
        <h2 className={styles.sectionTitle}>Candidates</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('full_name')}>
                Name {sortConfig?.key === 'full_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('exam_rank')}>
                Rank {sortConfig?.key === 'exam_rank' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Preferences</th>
              <th>Category</th>
              <th>Allocated Course</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.full_name}</td>
                <td>{candidate.exam_rank}</td>
                <td>{candidate.preferences}</td>
                <td>{candidate.category}</td>
                <td>{candidate.allocated_course || 'Not allocated'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}