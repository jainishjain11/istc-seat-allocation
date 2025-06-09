'use client';
import { useEffect, useState } from 'react';

type CandidateProfile = {
  id: number;
  full_name: string;
  father_name: string;
  phone: string;
  aadhar_id: string;
  tenth_percentage: number;
  board_name: string;
  state: string;
  category: string;
  exam_rank: number;
};

type AllocationResult = {
  course_name: string;
  allocated_at: string;
} | null;

export default function CandidateDashboard({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [allocation, setAllocation] = useState<AllocationResult>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    full_name: '',
    father_name: '',
    phone: '',
    aadhar_id: '',
    tenth_percentage: '',
    board_name: '',
    state: '',
    category: '',
    exam_rank: '',
    preference1: '',
    preference2: '',
    preference3: ''
  });

  // Fetch candidate data and allocation result
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileRes = await fetch(`/api/candidate/${params.id}`);
        const profileData = await profileRes.json();
        
        if (!profileData.success) throw new Error(profileData.error);
        setProfile(profileData.profile);

        // Fetch allocation result
        const resultRes = await fetch(`/api/candidate/${params.id}/result`);
        const resultData = await resultRes.json();
        if (resultData.success) setAllocation(resultData.allocation);

        // Initialize form with profile data
        if (profileData.profile) {
          setForm({
            ...form,
            ...profileData.profile
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('/api/candidate/update', {
        method: 'POST',
        body: JSON.stringify({ userId: params.id, ...form }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (!data.success) throw new Error(data.error);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading candidate profile...</div>;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Candidate Profile & Branch Preferences</h2>
      
      {/* Profile Update Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Father's Name</label>
            <input
              name="father_name"
              value={form.father_name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Aadhar ID</label>
            <input
              name="aadhar_id"
              value={form.aadhar_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">10th Percentage</label>
            <input
              name="tenth_percentage"
              value={form.tenth_percentage}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Board Name</label>
            <input
              name="board_name"
              value={form.board_name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        {/* State and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
            </select>
          </div>
        </div>

        {/* Exam Rank */}
        <div>
          <label className="block text-sm font-medium mb-1">Exam Rank</label>
          <input
            name="exam_rank"
            value={form.exam_rank}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Branch Preferences */}
        <div className="space-y-4">
          <h3 className="font-semibold mt-4">Branch Preferences</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">First Preference</label>
            <select
              name="preference1"
              value={form.preference1}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select First Preference</option>
              <option value="1">Diploma in Mechanical Engineering (Tool & Die)</option>
              <option value="2">Diploma in Electronics Engineering</option>
              <option value="3">Advanced Diploma in Die & Mould Making</option>
              <option value="4">Advanced Diploma in Mechatronics & Industrial Automation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Second Preference</label>
            <select
              name="preference2"
              value={form.preference2}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Second Preference</option>
              <option value="1">Diploma in Mechanical Engineering (Tool & Die)</option>
              <option value="2">Diploma in Electronics Engineering</option>
              <option value="3">Advanced Diploma in Die & Mould Making</option>
              <option value="4">Advanced Diploma in Mechatronics & Industrial Automation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Third Preference</label>
            <select
              name="preference3"
              value={form.preference3}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Third Preference</option>
              <option value="1">Diploma in Mechanical Engineering (Tool & Die)</option>
              <option value="2">Diploma in Electronics Engineering</option>
              <option value="3">Advanced Diploma in Die & Mould Making</option>
              <option value="4">Advanced Diploma in Mechatronics & Industrial Automation</option>
            </select>
          </div>
        </div>

        {/* Status Messages */}
        {success && <div className="text-green-600 p-2 rounded bg-green-50">{success}</div>}
        {error && <div className="text-red-600 p-2 rounded bg-red-50">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
        >
          Save Profile
        </button>
      </form>

      {/* Allocation Result Section */}
      {allocation && (
        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h3 className="text-lg font-semibold mb-2">Seat Allocation Result</h3>
          <p className="mb-1">
            <span className="font-medium">Allocated Course:</span> {allocation.course_name}
          </p>
          <p className="text-sm text-gray-600">
            Allocation Date: {new Date(allocation.allocated_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
