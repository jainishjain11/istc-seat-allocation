// src/app/layout.tsx
import { ReactNode } from 'react';
import IstcHeader from '@/components/IstcHeader';
import ScrollRestoration from '@/components/ScrollRestoration';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/istc-logo.jpeg" />
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
