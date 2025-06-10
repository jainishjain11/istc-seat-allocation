'use client';
import { useEffect, useState } from 'react';

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
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleAllocate}
          disabled={allocating}
        >
          {allocating ? 'Allocating...' : 'Release Seat Allocation'}
        </button>
        
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handlePublish}
          disabled={published}
        >
          {published ? 'Results Published' : 'Publish Results'}
        </button>
        <button
  className="bg-red-600 text-white px-4 py-2 rounded"
  onClick={async () => {
    await fetch('/api/admin/unpublish', { method: 'POST' });
    setPublished(false);
  }}
  disabled={!published}
>
  Unpublish Results
</button>

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={handleExportCandidates}
        >
          Export Candidates
        </button>

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={handleExportCourses}
        >
          Export Courses
        </button>
      </div>

      {/* Status Messages */}
      {allocationResult && (
        <div className={`mb-4 p-3 rounded ${allocationResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {allocationResult.success ? "Seat allocation completed!" : allocationResult.error}
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-4">
        <label className="mr-2">Filter by Category:</label>
        <select
          className="border p-2 rounded"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="General">General</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="OBC">OBC</option>
        </select>
      </div>

      {/* Seat Matrix */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Seat Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium">{course.course_name}</h4>
              <p>Total: {course.total_seats}</p>
              <p>Available: {course.available_seats}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <h3 className="font-semibold mb-2">Candidates</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th 
                className="p-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('full_name')}
              >
                Name {sortConfig?.key === 'full_name' && (
                  sortConfig.direction === 'asc' ? '↑' : '↓'
                )}
              </th>
              <th 
                className="p-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('exam_rank')}
              >
                Rank {sortConfig?.key === 'exam_rank' && (
                  sortConfig.direction === 'asc' ? '↑' : '↓'
                )}
              </th>
              <th className="p-3 text-left">Preferences</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Allocated Course</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{candidate.full_name}</td>
                <td className="p-3">{candidate.exam_rank}</td>
                <td className="p-3">{candidate.preferences}</td>
                <td className="p-3">{candidate.category}</td>
                <td className="p-3">{candidate.allocated_course || 'Not allocated'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
