'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundImage: 'url("/images/istc1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.45)'
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center'
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 2px 16px rgba(0,0,0,0.7), 0 1px 2px #333'
          }}
        >
          INDO Swiss Training Centre
        </h1>
        <h2
          style={{
            fontSize: '1.4rem',
            color: '#fff',
            fontWeight: 500,
            margin: '1rem 0 0.5rem 0',
            textShadow: '0 2px 16px rgba(0,0,0,0.7)'
          }}
        >
          Seat Allocation System
        </h2>
        <div
          style={{
            color: '#fff',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            textShadow: '0 2px 16px rgba(0,0,0,0.7)'
          }}
        >
          Official Portal for Diploma Courses Allotment
        </div>
        <div
          style={{
            color: '#fbbf24',
            fontWeight: 600,
            fontSize: '1rem',
            textShadow: '0 2px 16px rgba(0,0,0,0.7)'
          }}
        >
          A Government of India Institute
        </div>
        <div
          style={{
            marginTop: '2.5rem',
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: 400,
            letterSpacing: '0.05em',
            textShadow: '0 2px 16px rgba(0,0,0,0.7)',
            opacity: 0.9
          }}
        >
          Loading...
        </div>
      </div>
    </div>
  );
}
