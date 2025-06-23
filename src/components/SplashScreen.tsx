'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './welcome.css';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="welcome-wrapper">
      <div className="welcome-card">
        <header className="welcome-header">
          <div className="logo-title">
            <Image
              src="/images/istc1.jpg"
              alt="INDO Swiss Training Centre"
              width={120}
              height={120}
              className="istc-logo"
              priority
            />
            <div>
              <h1 className="welcome-title">INDO Swiss Training Centre</h1>
              <h2 className="welcome-subtitle">Chandigarh</h2>
              <div className="govt-tag">A Government of India Institute</div>
            </div>
          </div>
        </header>
        <main>
          <div className="welcome-info">
            <p>
              <strong>Seat Allocation System</strong> <br />
              Official Portal for Diploma Courses Allotment
            </p>
          </div>
          <div className="welcome-loading">Loading...</div>
        </main>
        <footer className="welcome-footer">
          &copy; {new Date().getFullYear()} INDO Swiss Training Centre, Chandigarh
        </footer>
      </div>
    </div>
  );
}
