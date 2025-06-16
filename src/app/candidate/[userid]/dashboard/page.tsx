'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

type CandidateData = {
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
  application_status: string;
  created_at: string;
  preferences?: any[];
};

export default function CandidateDashboard() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const res = await fetch(`/api/candidate/${userId}/profile`);
        const data = await res.json();
        
        if (!data.success) {
          if (data.error === 'Profile not found') {
            router.push(`/candidate/${userId}`);
            return;
          }
          throw new Error(data.error);
        }
        
        setCandidateData(data.profile);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchCandidateData();
  }, [userId, router]);

  const handleViewResults = () => {
    router.push(`/candidate/${userId}/results`);
  };

  if (loading) return <div className={styles.loadingText}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;
  if (!candidateData) return <div className={styles.errorMessage}>Profile not found</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Registration Complete</h1>
        <div className={styles.statusBadge}>
          Status: {candidateData.application_status}
        </div>
      </div>

      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        <div className={styles.detailsGrid}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Full Name:</span>
            <span className={styles.detailValue}>{candidateData.full_name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Father's Name:</span>
            <span className={styles.detailValue}>{candidateData.father_name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Phone:</span>
            <span className={styles.detailValue}>{candidateData.phone}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>10th Percentage:</span>
            <span className={styles.detailValue}>{candidateData.tenth_percentage}%</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Board:</span>
            <span className={styles.detailValue}>{candidateData.board_name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>State:</span>
            <span className={styles.detailValue}>{candidateData.state}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Category:</span>
            <span className={styles.detailValue}>{candidateData.category}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Exam Rank:</span>
            <span className={styles.detailValue}>{candidateData.exam_rank}</span>
          </div>
        </div>
      </div>

      <div className={styles.actionSection}>
        <button onClick={handleViewResults} className={styles.resultButton}>
          View Result
        </button>
      </div>

      <div className={styles.statusMessage}>
        <strong>Note:</strong> Your registration has been submitted successfully. 
        Results will be published once the allocation process is complete.
      </div>
    </div>
  );
}