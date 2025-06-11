'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './candidate.module.css';

export default function CandidateDashboard() {
  const params = useParams();
  const id = params?.id as string;

  const [profile, setProfile] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) throw new Error('No candidate ID provided');
        
        // Fetch candidate profile
        const profileRes = await fetch(`/api/candidate/${id}`);
        if (!profileRes.ok) throw new Error(`Failed to fetch profile: ${profileRes.status}`);
        
        const profileData = await profileRes.json();
        if (!profileData.success) throw new Error(profileData.error);
        
        if (profileData.isNewUser) {
          // New user - show empty form
          setIsNewUser(true);
          setProfile(null);
        } else {
          // Existing user - populate form
          setProfile(profileData.profile);
          setIsSubmitted(profileData.profile?.application_status === 'submitted');
          
          // Populate form with existing data
          setForm({
            full_name: profileData.profile.full_name || '',
            father_name: profileData.profile.father_name || '',
            phone: profileData.profile.phone || '',
            aadhar_id: profileData.profile.aadhar_id || '',
            tenth_percentage: profileData.profile.tenth_percentage?.toString() || '',
            board_name: profileData.profile.board_name || '',
            state: profileData.profile.state || '',
            category: profileData.profile.category || '',
            exam_rank: profileData.profile.exam_rank?.toString() || '',
            preference1: '',
            preference2: '',
            preference3: ''
          });
        }

      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!isSubmitted) {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitted) return;
    
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('/api/candidate/register', {
        method: 'POST',
        body: JSON.stringify({ 
          userId: id,
          ...form,
          application_status: 'submitted'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setSuccess('Registration completed successfully! You cannot edit your details now.');
      setIsSubmitted(true);
      setIsNewUser(false);

    } catch (err: any) {
      setError(err.message || 'Failed to submit registration');
    }
  };

  if (loading) return <div className={styles.loadingText}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>
        {isNewUser ? 'Complete Your Registration' : 'Your Registration Details'}
      </h1>
      
      {isSubmitted && (
        <div className={styles.successMessage}>
          Your registration is complete and locked. Contact admin for any changes.
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Personal Details Section */}
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name *</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className={styles.formInput}
              required
              disabled={isSubmitted}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Father's Name *</label>
            <input
              name="father_name"
              value={form.father_name}
              onChange={handleChange}
              className={styles.formInput}
              required
              disabled={isSubmitted}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone Number *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={styles.formInput}
              required
              disabled={isSubmitted}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Aadhar ID *</label>
            <input
              name="aadhar_id"
              value={form.aadhar_id}
              onChange={handleChange}
              className={styles.formInput}
              required
              disabled={isSubmitted}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>10th Percentage *</label>
            <input
              name="tenth_percentage"
              value={form.tenth_percentage}
              onChange={handleChange}
              className={styles.formInput}
              type="number"
              step="0.01"
              required
              disabled={isSubmitted}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Board Name *</label>
            <input
              name="board_name"
              value={form.board_name}
              onChange={handleChange}
              className={styles.formInput}
              required
              disabled={isSubmitted}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>State *</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              className={styles.formInput}
              required
              disabled={isSubmitted}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={styles.formSelect}
              required
              disabled={isSubmitted}
            >
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Exam Rank *</label>
          <input
            name="exam_rank"
            value={form.exam_rank}
            onChange={handleChange}
            className={styles.formInput}
            type="number"
            required
            disabled={isSubmitted}
          />
        </div>

        {/* Course Preferences */}
        <div className={styles.preferencesSection}>
          <h3 className={styles.preferencesTitle}>Course Preferences</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>First Preference *</label>
            <select
              name="preference1"
              value={form.preference1}
              onChange={handleChange}
              className={styles.formSelect}
              required
              disabled={isSubmitted}
            >
              <option value="">Select First Preference</option>
              <option value="1">Diploma in Mechanical Engineering (Tool & Die)</option>
              <option value="2">Diploma in Electronics Engineering</option>
              <option value="3">Advanced Diploma in Die & Mould Making</option>
              <option value="4">Advanced Diploma in Mechatronics & Industrial Automation</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Second Preference *</label>
            <select
              name="preference2"
              value={form.preference2}
              onChange={handleChange}
              className={styles.formSelect}
              required
              disabled={isSubmitted}
            >
              <option value="">Select Second Preference</option>
              <option value="1">Diploma in Mechanical Engineering (Tool & Die)</option>
              <option value="2">Diploma in Electronics Engineering</option>
              <option value="3">Advanced Diploma in Die & Mould Making</option>
              <option value="4">Advanced Diploma in Mechatronics & Industrial Automation</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Third Preference *</label>
            <select
              name="preference3"
              value={form.preference3}
              onChange={handleChange}
              className={styles.formSelect}
              required
              disabled={isSubmitted}
            >
              <option value="">Select Third Preference</option>
              <option value="1">Diploma in Mechanical Engineering (Tool & Die)</option>
              <option value="2">Diploma in Electronics Engineering</option>
              <option value="3">Advanced Diploma in Die & Mould Making</option>
              <option value="4">Advanced Diploma in Mechatronics & Industrial Automation</option>
            </select>
          </div>
        </div>

        {success && <div className={styles.successMessage}>{success}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitted}
        >
          {isSubmitted ? 'Registration Locked' : 'Submit Final Registration'}
        </button>
      </form>
    </div>
  );
}
