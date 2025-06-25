'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminMenuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: '📊',
    description: 'Overview & Quick Stats'
  },
  {
    title: 'Statistics',
    href: '/admin/statistics',
    icon: '📈',
    description: 'Charts & Analytics'
  },
  {
    title: 'Seat Allocation',
    href: '/admin/seat-allocation',
    icon: '🎯',
    description: 'Manage Allocations'
  },
  {
    title: 'Category Rules',
    href: '/admin/category-rules',
    icon: '⚙️',
    description: 'Reservation Settings'
  },
  {
    title: 'User Management',
    href: '/admin/user-management',
    icon: '👥',
    description: 'CSV Upload & Users'
  },
  {
    title: 'System Settings',
    href: '/admin/system-settings',
    icon: '🔧',
    description: 'Reset & Configuration'
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div style={{
      width: '280px',
      background: '#fff',
      borderRight: '1px solid #e5e7eb',
      padding: '1.5rem 0',
      boxShadow: '2px 0 4px rgba(0,0,0,0.04)'
    }}>
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          color: '#1e40af',
          margin: 0 
        }}>
          Admin Portal
        </h2>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '0.875rem',
          margin: '0.5rem 0 0 0'
        }}>
          Manage ISTC Seat Allocation
        </p>
      </div>

      <nav>
        {adminMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'block',
              padding: '1rem 1.5rem',
              textDecoration: 'none',
              borderLeft: pathname === item.href ? '4px solid #1e40af' : '4px solid transparent',
              background: pathname === item.href ? '#eff6ff' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <div>
                <div style={{
                  fontWeight: 600,
                  color: pathname === item.href ? '#1e40af' : '#374151',
                  fontSize: '1rem'
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  {item.description}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
