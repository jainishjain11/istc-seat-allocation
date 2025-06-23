'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CandidateRouter() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await fetch(`/api/candidate/${userId}/profile`);
        const data = await res.json();
        
        if (data.success && data.profile) {
          router.push(`/candidate/${userId}/dashboard`);
        } else {
          router.push(`/candidate/${userId}/register`);
        }
      } catch (error) {
        console.error('Profile check failed:', error);
        router.push(`/candidate/${userId}/register`);
      }
    };

    if (userId) checkProfile();
  }, [userId, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}