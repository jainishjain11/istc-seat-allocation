// src/app/results/ResultsPage.tsx
'use client';
import { useState } from 'react';
import styles from './results-page.module.css';

export default function ResultsPage() {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(
        `/api/results?email=${encodeURIComponent(email)}&dob=${encodeURIComponent(dob)}`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        if (data.result) {
          setResult(data.result);
        } else {
          setError('No allocation found for your credentials');
        }
      } else {
        setError(data.error || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Check Allocation Result</h2>
        <form onSubmit={handleSearch} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="dob" className={styles.label}>Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div>
            <button 
              type="submit" 
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Result'}
            </button>
          </div>
        </form>

        {error && (
          <div className={styles.error}>
            {error}
            {error.includes('not published') && (
              <p className={styles.errorNote}>
                Please check back later or contact the administration.
              </p>
            )}
          </div>
        )}

        {result && (
          <div className={styles.result}>
            <div className={styles.resultHeading}>Allocation Result</div>
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
        )}
      </div>
    </div>
  );
}
