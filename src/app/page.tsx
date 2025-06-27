// src/app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        height: 'calc(100vh - 124px)', // Accounts for header height
        width: '100vw',
        backgroundImage: 'url("/images/istc1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Darker Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10, 23, 55, 0.65)',
          zIndex: 0,
        }}
      />
      
      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          width: '100%',
          padding: '0 2rem',
        }}
      >
        <h1
          style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            color: '#f3f4f6',
            textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 2px 8px #1e293b',
            letterSpacing: '0.04em',
            marginBottom: '1rem',
          }}
        >
          INDO Swiss Training Centre
        </h1>
        <h2
          style={{
            fontSize: '1.8rem',
            color: '#fbbf24',
            fontWeight: 700,
            marginBottom: '0.5rem',
            textShadow: '0 4px 24px rgba(0,0,0,0.9)',
            letterSpacing: '0.03em',
          }}
        >
          Seat Allocation System
        </h2>
        <div
          style={{
            color: '#e0e7ef',
            fontSize: '1.2rem',
            fontWeight: 500,
            marginBottom: '1rem',
            textShadow: '0 4px 24px rgba(0,0,0,0.9)',
            letterSpacing: '0.02em',
          }}
        >
          Official Portal for Diploma Courses Allotment
        </div>
        <div
          style={{
            color: '#38bdf8',
            fontWeight: 600,
            fontSize: '1rem',
            marginBottom: '2rem',
            textShadow: '0 4px 24px rgba(0,0,0,0.85)',
            letterSpacing: '0.03em',
          }}
        >
          A Government of India Institute
        </div>
        <div
          style={{
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: 500,
            textShadow: '0 4px 24px rgba(0,0,0,0.7)',
            opacity: 0.97,
            letterSpacing: '0.04em',
          }}
        >
          Loading...
        </div>
      </div>
    </div>
  );
}
