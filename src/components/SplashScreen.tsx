'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './welcome.css';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000); // Redirect after 2 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="welcome-wrapper">
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome to ISTC Seat Allocation System</h1>
        <h2 className="welcome-subtitle">
          Official Portal for Diploma courses allotment
        </h2>
        <div className="welcome-loading">Loading...</div>
      </div>
    </div>
  );
}
