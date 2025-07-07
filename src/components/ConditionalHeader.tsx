'use client';
import { usePathname } from 'next/navigation';
import IstcHeader from './IstcHeader';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on splash screen (root path)
  if (pathname === '/') return null;
  
  return <IstcHeader />;
}