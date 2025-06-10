'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000); // Redirect after 2 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="animate-pulse text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Jainish Jain :) </h1>
        <p className="text-xl">Loading...</p>
      </div>
    </div>
  );
}
