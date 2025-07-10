import { ReactNode } from 'react';
import IstcHeader from '@/components/IstcHeader';
import ScrollRestoration from '@/components/ScrollRestoration';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Standard favicon */}
        <link rel="icon" href="/favicon.ico" />
        {/* Fallback for browsers that support PNG/JPEG */}
        <link rel="icon" type="image/jpeg" href="/images/istc-logo.jpeg" />
      </head>
      <body style={{ margin: 0, background: '#f8fafc' }}>
        <ScrollRestoration />
        <IstcHeader />
        <main style={{ minHeight: 'calc(100vh - 124px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
