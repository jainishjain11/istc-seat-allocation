'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './results-page.module.css';

type AllocationResult = {
  course_name: string;
  course_code: string;
  verification_date?: string | null;
} | null;

export default function CandidateResults() {
  const params = useParams();
  const userId = params?.userId as string;
  
  const [result, setResult] = useState<AllocationResult>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [resultPublished, setResultPublished] = useState(false);
  const [candidateName, setCandidateName] = useState('');

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/candidate/${userId}/results`);
        const data = await res.json();
        
        if (data.success) {
          setResultPublished(data.published);
          setResult(data.result);
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

  // Fetch candidate name for letter
  useEffect(() => {
    const fetchCandidateName = async () => {
      try {
        const res = await fetch(`/api/candidate/${userId}/profile`);
        const data = await res.json();
        if (data.success && data.profile) {
          setCandidateName(data.profile.full_name);
        }
      } catch (err) {
        console.error('Failed to fetch candidate name');
      }
    };
    
    if (userId) fetchCandidateName();
  }, [userId]);

  // Handle download allocation letter (unchanged)
  const handleDownloadLetter = async () => {
    try {
      const response = await fetch(`/api/candidate/${userId}/allocation-letter`);
      if (!response.ok) {
        throw new Error('Failed to download allocation letter');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ISTC-Allocation-Letter-${candidateName.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download allocation letter. Please try again.');
    }
  };

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
                <span className={styles.detailLabel}>Document Verification Date:</span>
                <span className={styles.detailValue}>
                  {result.verification_date
                    ? new Date(result.verification_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'To be announced'}
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

            <button 
              className={styles.downloadButton}
              onClick={handleDownloadLetter}
            >
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
