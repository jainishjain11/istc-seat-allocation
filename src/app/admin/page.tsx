'use client';
import { useEffect, useState } from 'react';
import styles from './admin.module.css';

type Candidate = {
  id: number;
  full_name: string;
  category: string;
  exam_rank: number;
  preferences: string;
  allocated_course?: string;
  application_status: 'draft' | 'submitted';
};

type Course = {
  id: number;
  course_name: string;
  total_seats: number;
  available_seats: number;
};

type SystemSettings = {
  registrations_locked: boolean;
  results_published: boolean;
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
  const [settings, setSettings] = useState<SystemSettings>({
    registrations_locked: false,
    results_published: false
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Candidate; direction: 'asc' | 'desc' } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataRes, settingsRes] = await Promise.all([
          fetch('/api/admin/data'),
          fetch('/api/system-settings')
        ]);
        
        const data = await dataRes.json();
        const settingsData = await settingsRes.json();
        
        setCandidates(data.candidates);
        setCourses(data.courses);
        setSettings(settingsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // Sorting logic
  const sortedCandidates = [...candidates].sort((a: Candidate, b: Candidate) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
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
      
      if (data.success) {
        const [dataRes, settingsRes] = await Promise.all([
          fetch('/api/admin/data'),
          fetch('/api/system-settings')
        ]);
        const newData = await dataRes.json();
        const newSettings = await settingsRes.json();
        setCandidates(newData.candidates);
        setCourses(newData.courses);
        setSettings(newSettings);
      }
    } finally {
      setAllocating(false);
    }
  };

  const handleLockRegistrations = async (lock: boolean) => {
    try {
      await fetch('/api/admin/lock-registrations', {
        method: 'POST',
        body: JSON.stringify({ lock }),
        headers: { 'Content-Type': 'application/json' }
      });
      setSettings(prev => ({ ...prev, registrations_locked: lock }));
    } catch (error) {
      console.error('Failed to update registration lock:', error);
    }
  };

  const handlePublishResults = async (publish: boolean) => {
    try {
      await fetch('/api/admin/publish', {
        method: 'POST',
        body: JSON.stringify({ publish }),
        headers: { 'Content-Type': 'application/json' }
      });
      setSettings(prev => ({ ...prev, results_published: publish }));
    } catch (error) {
      console.error('Failed to update publication status:', error);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.sectionTitle}>ISTC Seat Allocation Admin</h1>
      
      {/* Action Bar */}
      <div className={styles.actionBar}>
        <button
          className={styles.actionButton}
          onClick={handleAllocate}
          disabled={allocating || settings.results_published}
        >
          {allocating ? 'Allocating...' : 'Run Seat Allocation'}
        </button>

        <button
          className={styles.actionButton}
          onClick={() => handleLockRegistrations(!settings.registrations_locked)}
        >
          {settings.registrations_locked ? 'Unlock Registrations' : 'Lock Registrations'}
        </button>

        <button
          className={styles.actionButton}
          onClick={() => handlePublishResults(!settings.results_published)}
          disabled={!settings.registrations_locked}
        >
          {settings.results_published ? 'Unpublish Results' : 'Publish Results'}
        </button>

        <button
          className={styles.actionButton}
          onClick={() => window.open('/api/admin/export/candidates', '_blank')}
        >
          Export Candidates
        </button>
      </div>

      {/* System Status */}
      <div className={styles.statusBar}>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Registrations:</span>
          <span className={settings.registrations_locked ? styles.statusBadgeRed : styles.statusBadgeGreen}>
            {settings.registrations_locked ? 'Locked' : 'Open'}
          </span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Results:</span>
          <span className={settings.results_published ? styles.statusBadgeGreen : styles.statusBadgeRed}>
            {settings.results_published ? 'Published' : 'Not Published'}
          </span>
        </div>
      </div>

      {/* Allocation Status */}
      {allocationResult && (
        <div className={allocationResult.success ? styles.statusSuccess : styles.statusError}>
          {allocationResult.success ? allocationResult.message : allocationResult.error}
        </div>
      )}

      {/* Seat Matrix */}
      <div className={styles.dataCard}>
        <h2 className={styles.sectionTitle}>Seat Availability</h2>
        <div className={styles.gridContainer}>
          {courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <h4 className={styles.courseTitle}>{course.course_name}</h4>
              <div className={styles.seatInfo}>
                <div className={styles.seatStat}>
                  <span className={styles.seatLabel}>Total:</span>
                  <span className={styles.seatValue}>{course.total_seats}</span>
                </div>
                <div className={styles.seatStat}>
                  <span className={styles.seatLabel}>Available:</span>
                  <span className={styles.seatValue}>{course.available_seats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <div className={styles.dataCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.sectionTitle}>Candidate List</h2>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Filter by Category:</label>
            <select
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
              <option value="EWS">EWS</option>
            </select>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleSort('full_name')}>
                  Name {sortConfig?.key === 'full_name' && (
                    sortConfig.direction === 'asc' ? '↑' : '↓'
                  )}
                </th>
                <th onClick={() => handleSort('exam_rank')}>
                  Rank {sortConfig?.key === 'exam_rank' && (
                    sortConfig.direction === 'asc' ? '↑' : '↓'
                  )}
                </th>
                <th>Preferences</th>
                <th>Category</th>
                <th>Status</th>
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
                  <td>
                    <span className={candidate.application_status === 'submitted' 
                      ? styles.statusSubmitted 
                      : styles.statusDraft
                    }>
                      {candidate.application_status}
                    </span>
                  </td>
                  <td>{candidate.allocated_course || 'Not allocated'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
