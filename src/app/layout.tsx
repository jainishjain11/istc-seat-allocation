import { ReactNode } from 'react';
import IstcHeader from '@/components/IstcHeader';

export const metadata = {
  title: 'ISTC Seat Allocation Portal',
  description: 'Official Portal for INDO-SWISS TRAINING CENTRE Seat Allocation',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/istc-logo.jpeg" />
      </head>
      <body style={{ margin: 0, background: '#f8fafc', overflow: 'hidden' }}>
        <IstcHeader />
        <main style={{ height: 'calc(100vh - 124px)', overflow: 'hidden' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
