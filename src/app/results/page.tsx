'use client';
import { useState } from 'react';

export default function ResultsPage() {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/results?email=${encodeURIComponent(email)}&dob=${encodeURIComponent(dob)}`);
      const data = await res.json();
      
      if (data.success) {
        setResult(data.result);
        setError('');
      } else {
        setError(data.error);
        setResult(null);
      }
    } catch (err) {
      setError('Failed to fetch results');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Check Allocation Result</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
        >
          Check Result
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}
      
      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded">
          <h3 className="text-lg font-semibold mb-2">Allocation Result</h3>
          <p className="mb-1">
            <span className="font-medium">Course:</span> {result.course_name}
          </p>
          <p className="mb-1">
            <span className="font-medium">Course Code:</span> {result.course_code}
          </p>
          <p className="text-sm text-gray-600">
            Allocated on: {new Date(result.allocated_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
