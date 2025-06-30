'use client';
import { useState, useRef } from 'react';

export default function SystemSettingsPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState('');
  const [backupStatus, setBackupStatus] = useState('');
  const [restoreStatus, setRestoreStatus] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  const openResetModal = () => {
    setShowResetModal(true);
    setAdminPassword('');
    setResetStatus('');
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setAdminPassword('');
    setResetStatus('');
  };

  const resetSystem = async () => {
    if (!adminPassword) {
      setResetStatus('Please enter admin password');
      if (passwordInputRef.current) passwordInputRef.current.focus();
      return;
    }

    setIsResetting(true);
    setResetStatus('');
    
    try {
      const res = await fetch('/api/admin/system/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });
      
      const data = await res.json();
      if (data.success) {
        setResetStatus('System reset successfully!');
        setTimeout(() => {
          closeResetModal();
        }, 2000);
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
      const res = await fetch('/api/admin/system/backup');
      
      if (!res.ok) {
        throw new Error(`Backup failed: ${res.statusText}`);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `istc_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setBackupStatus('Backup downloaded successfully!');
      setTimeout(() => setBackupStatus(''), 3000);
    } catch (error: any) {
      setBackupStatus(error.message || 'Failed to create backup');
    }
  };

  const restoreSystem = async () => {
    if (!restoreFile) {
      setRestoreStatus('Please select a backup file');
      if (restoreInputRef.current) restoreInputRef.current.focus();
      return;
    }

    setIsRestoring(true);
    setRestoreStatus('');
    
    const formData = new FormData();
    formData.append('backup', restoreFile);
    
    try {
      const res = await fetch('/api/admin/system/restore', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setRestoreStatus('System restored successfully!');
      } else {
        setRestoreStatus(`Error: ${data.error || 'Restore failed'}`);
      }
    } catch (error) {
      setRestoreStatus('Failed to restore system');
    } finally {
      setIsRestoring(false);
      setRestoreFile(null);
      if (restoreInputRef.current) restoreInputRef.current.value = '';
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

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    marginBottom: '1rem'
  };

  const warningCardStyle = {
    background: '#fffbeb',
    borderLeft: '4px solid #f59e0b',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    margin: '2rem 0'
  };

  const modalOverlayStyle = {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    background: '#fff',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  };

  const modalTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1e40af',
    marginBottom: '1.5rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>System Settings</h1>
      <p style={subtitleStyle}>
        Manage system-wide configurations and maintenance
      </p>

      {/* Reset System Card */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>System Reset</h2>
        
        <div style={warningCardStyle}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#b45309', marginBottom: '1rem' }}>
            ⚠️ Important: System Reset
          </h3>
          <div style={{ lineHeight: 1.6 }}>
            This action will:
            <ul>
              <li>Delete all candidate records</li>
              <li>Delete all seat allocations</li>
              <li>Reset courses to initial seat counts</li>
              <li>Delete all non-admin user accounts</li>
              <li>Unpublish results</li>
            </ul>
            This action cannot be undone. Please click "Reset System" and enter your admin password to confirm.
          </div>
        </div>
        
        <button
          onClick={openResetModal}
          style={actionButtonStyle('#ef4444', false)}
        >
          Reset System
        </button>
      </div>

      {/* Backup System Card */}
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
            <div style={statusStyle(backupStatus.includes('failed'))}>
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
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
              style={inputStyle}
              ref={restoreInputRef}
            />
          </div>
          <button
            onClick={restoreSystem}
            disabled={isRestoring || !restoreFile}
            style={actionButtonStyle('#3b82f6', isRestoring || !restoreFile)}
          >
            {isRestoring ? 'Restoring...' : 'Restore System'}
          </button>
          {restoreStatus && (
            <div style={statusStyle(restoreStatus.includes('Error'))}>
              {restoreStatus}
            </div>
          )}
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={modalTitleStyle}>Confirm System Reset</h2>
            
            <div>
              <p style={{ marginBottom: '1rem', color: '#4b5563' }}>
                Please enter your admin password to confirm the system reset.
              </p>
              
              <input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={inputStyle}
                ref={passwordInputRef}
              />
              
              <div style={{ 
                background: '#fef3c7', 
                color: '#92400e',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>⚠️ Warning:</p>
                <p>This action will permanently delete all candidate data and reset the system to its initial state. This cannot be undone.</p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={closeResetModal}
                  style={{
                    flex: 1,
                    background: '#e5e7eb',
                    color: '#4b5563',
                    fontWeight: 600,
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                
                <button
                  onClick={resetSystem}
                  disabled={isResetting || !adminPassword}
                  style={{
                    flex: 1,
                    background: isResetting || !adminPassword ? '#9ca3af' : '#ef4444',
                    color: '#fff',
                    fontWeight: 600,
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: isResetting || !adminPassword ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isResetting ? 'Resetting...' : 'Confirm Reset'}
                </button>
              </div>
              
              {resetStatus && (
                <div style={statusStyle(resetStatus.includes('Error'))}>
                  {resetStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
