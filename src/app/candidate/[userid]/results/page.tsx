'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './results-page.module.css'; // Correct import

type AllocationResult = {
  course_name: string;
  course_code: string;
  allocated_at: string;
  rank_allocated: number;
} | null;

export default function CandidateResults() {
  const params = useParams();
  const userId = params?.id as string;
  
  const [result, setResult] = useState<AllocationResult>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resultPublished, setResultPublished] = useState(false);

  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/candidate/${userId}/results`);
        const data = await res.json();
        
        if (data.success) {
          setResultPublished(data.published);
          setResult(data.allocation);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchResults();
  }, [userId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.resultCard}>
        <h1 className={styles.pageTitle}>Seat Allocation Result</h1>
        
        {!resultPublished ? (
          <div className={styles.notPublished}>
            <div className={styles.notPublishedIcon}>📋</div>
            <h2>Results Not Published Yet</h2>
            <p>The seat allocation results have not been published yet. Please check back later.</p>
            <p className={styles.noteText}>
              You will be notified via email once the results are available.
            </p>
          </div>
        ) : result ? (
          <div className={styles.resultSuccess}>
            <div className={styles.successIcon}>🎉</div>
            <h2 className={styles.congratsTitle}>Congratulations!</h2>
            <p className={styles.congratsSubtitle}>You have been allocated a seat</p>
            
            <div className={styles.allocationDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Course:</span>
                <span className={styles.detailValue}>{result.course_name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Course Code:</span>
                <span className={styles.detailValue}>{result.course_code}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Allocated At Rank:</span>
                <span className={styles.detailValue}>{result.rank_allocated}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Allocation Date:</span>
                <span className={styles.detailValue}>
                  {new Date(result.allocated_at).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            <div className={styles.nextSteps}>
              <h3>Next Steps:</h3>
              <ul>
                <li>Download your allocation letter</li>
                <li>Report to the institute for document verification</li>
                <li>Complete the admission process within the deadline</li>
              </ul>
            </div>

            <button className={styles.downloadButton}>
              Download Allocation Letter
            </button>
          </div>
        ) : (
          <div className={styles.notAllocated}>
            <div className={styles.notAllocatedIcon}>😔</div>
            <h2>Seat Not Allocated</h2>
            <p>Unfortunately, you have not been allocated a seat in this round.</p>
            <div className={styles.waitlistInfo}>
              <p><strong>Don't lose hope!</strong></p>
              <p>You may be considered in subsequent rounds if seats become available.</p>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}