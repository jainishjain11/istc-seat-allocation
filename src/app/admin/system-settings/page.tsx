'use client';
import { useState } from 'react';

export default function SystemSettingsPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState('');
  const [backupStatus, setBackupStatus] = useState('');

  const resetSystem = async () => {
    if (!window.confirm('Are you sure you want to reset the system? This will delete all allocations and reset all data!')) return;
    
    setIsResetting(true);
    setResetStatus('');
    
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResetStatus('System reset successfully!');
      } else {
        setResetStatus(`Error: ${data.error || 'Reset failed'}`);
      }
    } catch (error) {
      setResetStatus('Failed to reset system');
    } finally {
      setIsResetting(false);
    }
  };

  const createBackup = async () => {
    try {
      setBackupStatus('Creating backup...');
      const res = await fetch('/api/admin/backup');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `istc-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setBackupStatus('Backup downloaded successfully!');
      setTimeout(() => setBackupStatus(''), 3000);
    } catch (error) {
      setBackupStatus('Failed to create backup');
    }
  };

  // Style objects
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const titleStyle = {
    fontSize: '2.2rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.25rem'
  };

  const subtitleStyle = {
    color: '#64748b',
    marginBottom: '2rem',
    fontSize: '1.15rem'
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 4px 16px rgba(30,64,175,0.09)',
    padding: '2rem 1.5rem',
    marginBottom: '2rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#1e40af',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e5e7eb'
  };

  const actionButtonStyle = (color: string, disabled: boolean) => ({
    background: disabled ? '#9ca3af' : color,
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.1rem',
    borderRadius: '0.5rem',
    padding: '0.9rem 2.2rem',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(30,64,175,0.07)',
    display: 'inline-block',
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto',
    opacity: disabled ? 0.7 : 1
  });

  const statusStyle = (isError: boolean) => ({
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    fontWeight: 500,
    background: isError ? '#fee2e2' : '#dcfce7',
    color: isError ? '#b91c1c' : '#166534',
    textAlign: 'center' as const
  });

  const warningCardStyle = {
    background: '#fffbeb',
    borderLeft: '4px solid #f59e0b',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    margin: '2rem 0'
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem'
  };

  const infoItemStyle = {
    background: '#f3f4f6',
    padding: '1rem',
    borderRadius: '0.5rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>System Settings</h1>
      <p style={subtitleStyle}>
        Manage system-wide configurations and maintenance
      </p>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>System Reset</h2>
        
        <div style={warningCardStyle}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#b45309', marginBottom: '1rem' }}>
            ⚠️ Important: System Reset
          </h3>
          <p style={{ lineHeight: 1.6 }}>
            Resetting the system will clear all seat allocations, reset course seat counts, and unpublish results. 
            This action is irreversible and should only be done at the end of an admission cycle.
          </p>
        </div>
        
        <button
          onClick={resetSystem}
          disabled={isResetting}
          style={actionButtonStyle('#ef4444', isResetting)}
        >
          {isResetting ? 'Resetting System...' : 'Reset System'}
        </button>
        
        {resetStatus && (
          <div style={statusStyle(resetStatus.includes('Error'))}>
            {resetStatus}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Backup & Restore</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={createBackup}
            style={actionButtonStyle('#f59e0b', false)}
          >
            Create System Backup
          </button>
          
          {backupStatus && (
            <div style={statusStyle(backupStatus.includes('Error'))}>
              {backupStatus}
            </div>
          )}
        </div>
        
        <div style={warningCardStyle}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#b45309', marginBottom: '1rem' }}>
            Restore from Backup
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            Upload a previously created backup file to restore the system to a previous state.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input 
              type="file" 
              accept=".json" 
              style={fileInputStyle}
            />
            <button style={actionButtonStyle('#3b82f6', false)}>
              Restore System
            </button>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>System Information</h2>
        
        <div style={infoGridStyle}>
          <div style={infoItemStyle}>
            <div style={{ fontWeight: 500, color: '#64748b' }}>Database Version</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>1.2.5</div>
          </div>
          
          <div style={infoItemStyle}>
            <div style={{ fontWeight: 500, color: '#64748b' }}>Last Backup</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>2025-06-25</div>
          </div>
          
          <div style={infoItemStyle}>
            <div style={{ fontWeight: 500, color: '#64748b' }}>Total Candidates</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>156</div>
          </div>
          
          <div style={infoItemStyle}>
            <div style={{ fontWeight: 500, color: '#64748b' }}>Allocated Seats</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>120</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable style for file input
const fileInputStyle = {
  flex: 1,
  padding: '0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  fontSize: '1rem'
};
  