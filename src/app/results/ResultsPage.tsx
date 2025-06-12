'use client';
import { useState } from 'react';
import styles from './results-page.module.css';

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
      setResult(null);
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
            <button type="submit" className={styles.button}>
              Check Result
            </button>
          </div>
        </form>
        {error && (
          <div className={styles.error}>{error}</div>
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
              {new Date(result.allocated_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
