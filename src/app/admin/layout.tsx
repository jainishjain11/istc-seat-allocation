import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: 'calc(100vh - 124px)',
      overflow: 'hidden' // Add overflow hidden to the container
    }}>
      <AdminSidebar />
      <main style={{ 
        flex: 1, 
        padding: '2rem', 
        background: '#f8fafc',
        overflowY: 'auto' // Enable vertical scrolling
      }}>
        {children}
      </main>
    </div>
  );
}