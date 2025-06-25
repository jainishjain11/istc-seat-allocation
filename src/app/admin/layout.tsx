import AdminSidebar from '@/components/AdminSidebar';
import IstcHeader from '@/components/IstcHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IstcHeader />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 124px)' }}>
        <AdminSidebar />
        <main style={{ 
          flex: 1, 
          padding: '2rem', 
          background: '#f8fafc',
          overflow: 'auto'
        }}>
          {children}
        </main>
      </div>
    </>
  );
}
