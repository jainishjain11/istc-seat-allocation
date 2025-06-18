'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './results-page.module.css';  // Not 'results.module.css'


export default function CandidateResultPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/candidate/${userId}/results`);
        const data = await res.json();
        if (data.success) {
          if (data.result) {
            setResult(data.result);
          } else {
            setError('No seat has been allocated to you in this round.');
          }
        } else {
          setError(data.error || 'Failed to fetch results');
        }
      } catch (err) {
        setError('Failed to fetch results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchResult();
  }, [userId]);

  if (loading) return <div className={styles.loadingText}>Loading result...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Allocation Result</h2>
        <div className={styles.result}>
          <div className={styles.resultDetail}>
            <span className={styles.resultLabel}>Course:</span>
            {result.course_name}
          </div>
          <div className={styles.resultDetail}>
            <span className={styles.resultLabel}>Course Code:</span>
            {result.course_code}
          </div>
          <div className={styles.resultDetail}>
            <span className={styles.resultLabel}>Allocated on:</span>
            {new Date(result.allocated_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
