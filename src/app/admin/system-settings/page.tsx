'use client';
import { useState } from 'react';

export default function SystemSettingsPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState('');
  const [backupStatus, setBackupStatus] = useState('');

  const resetSystem = async () => {
    if (!confirm('Are you sure you want to reset the system? This will delete all allocations and reset all data!')) return;
    
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
    } catch (error) {
      setBackupStatus('Failed to create backup');
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">System Settings</h1>
      
      <div className="settings-grid">
        <div className="setting-card">
          <h2 className="setting-title">System Reset</h2>
          <p className="setting-description">
            Reset the entire system for a new admission cycle. This will:
          </p>
          <ul className="reset-list">
            <li>Clear all seat allocations</li>
            <li>Reset all course seat counts</li>
            <li>Unpublish results</li>
            <li>Keep candidate registrations</li>
          </ul>
          <button
            onClick={resetSystem}
            disabled={isResetting}
            className={`action-button ${isResetting ? 'bg-gray-400' : 'bg-red-600'}`}
          >
            {isResetting ? 'Resetting...' : 'Reset System'}
          </button>
          {resetStatus && (
            <div className={`status-message ${resetStatus.includes('Error') ? 'error' : 'success'}`}>
              {resetStatus}
            </div>
          )}
        </div>
        
        <div className="setting-card">
          <h2 className="setting-title">Backup & Restore</h2>
          <p className="setting-description">
            Create a full backup of the current system state
          </p>
          <button
            onClick={createBackup}
            className="action-button bg-amber-600"
          >
            Create Backup
          </button>
          {backupStatus && (
            <div className={`status-message ${backupStatus.includes('Error') ? 'error' : 'success'}`}>
              {backupStatus}
            </div>
          )}
          
          <div className="restore-section">
            <h3 className="restore-title">Restore from Backup</h3>
            <input type="file" accept=".json" className="restore-input" />
            <button className="restore-button">Restore System</button>
          </div>
        </div>
        
        <div className="setting-card">
          <h2 className="setting-title">System Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span>Database Version:</span>
              <span>1.2.5</span>
            </div>
            <div className="info-item">
              <span>Last Backup:</span>
              <span>2025-06-25</span>
            </div>
            <div className="info-item">
              <span>Total Candidates:</span>
              <span>156</span>
            </div>
            <div className="info-item">
              <span>Allocated Seats:</span>
              <span>120</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
