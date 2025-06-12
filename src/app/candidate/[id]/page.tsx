'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './candidate.module.css';

type CandidateProfile = {
  full_name: string;
  father_name: string;
  phone: string;
  aadhar_id: string;
  tenth_percentage: number;
  board_name: string;
  state: string;
  category: string;
  exam_rank: number;
  application_status: 'draft' | 'submitted';
  preferences?: number[];
};

export default function CandidateDashboard() {
  const params = useParams();
  const userId = params?.id as string;

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/candidate/${userId}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      if (data.profile) {
        setProfile(data.profile);
        setSuccess('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const response = await fetch('/api/candidate/register', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          application_status: 'submitted',
          ...Object.fromEntries(formData)
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      await fetchProfile(); // Refresh data after successful submission
      setSuccess('Registration submitted successfully!');
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    }
  };

  if (loading) return <div className={styles.loadingText}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>
        {profile?.application_status === 'submitted' 
          ? 'Your Registration Details'
          : 'Complete Your Registration'}
      </h1>

      {profile?.application_status === 'submitted' ? (
        <div className={styles.viewMode}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Full Name:</span>
            <span className={styles.detailValue}>{profile.full_name}</span>
          </div>
          
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Exam Rank:</span>
            <span className={styles.detailValue}>{profile.exam_rank}</span>
          </div>
          
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Preferences:</span>
            <span className={styles.detailValue}>
              {profile.preferences?.join(', ') || 'No preferences set'}
            </span>
          </div>

          <div className={styles.statusLocked}>
            <i className="fas fa-lock"></i> Submission Locked
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Existing form fields */}
          <button 
            type="submit" 
            className={styles.submitButton}
          >
            Submit Final Registration
          </button>
        </form>
      )}

      {success && <div className={styles.successMessage}>{success}</div>}
    </div>
  );
}
