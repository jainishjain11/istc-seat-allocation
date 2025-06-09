'use client';
import { useEffect, useState } from 'react';

type AllocationResult = {
  success: boolean;
  error?: string;
  message?: string;
} | null;

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allocating, setAllocating] = useState(false);
  const [allocationResult, setAllocationResult] = useState<AllocationResult>(null);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      setCandidates(data.candidates);
      setCourses(data.courses);
      
      // Check publication status
      const pubRes = await fetch('/api/admin/publication-status');
      const pubData = await pubRes.json();
      setPublished(pubData.published);
    };
    fetchData();
  }, []);

  const handleAllocate = async () => {
    setAllocating(true);
    try {
      const res = await fetch('/api/admin/allocate', { method: 'POST' });
      const data = await res.json();
      setAllocationResult(data);
    } finally {
      setAllocating(false);
    }
  };

  const handlePublish = async () => {
    const res = await fetch('/api/admin/publish', { method: 'POST' });
    const data = await res.json();
    if (data.success) setPublished(true);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      
      <div className="flex gap-4 mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAllocate}
          disabled={allocating}
        >
          {allocating ? 'Allocating...' : 'Release Seat Allocation'}
        </button>
        
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handlePublish}
          disabled={published}
        >
          {published ? 'Results Published' : 'Publish Results'}
        </button>
      </div>

      {/* Existing seat matrix and candidate table */}
    </div>
  );
}
