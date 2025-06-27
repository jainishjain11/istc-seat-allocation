'use client';
import { useState } from 'react';
import SeatMatrix from '@/components/admin/SeatMatrix';
import CandidateTable from '@/components/admin/CandidateTable';

export default function SeatAllocationPage() {
  const [isAllocating, setIsAllocating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [allocationStatus, setAllocationStatus] = useState('');
  const [publicationStatus, setPublicationStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const runAllocation = async () => {
    setIsAllocating(true);
    setAllocationStatus('');
    try {
      const res = await fetch('/api/admin/allocate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAllocationStatus(`Allocation successful! Allocated ${data.allocated} candidates.`);
      } else {
        setAllocationStatus(`Error: ${data.error || 'Allocation failed'}`);
      }
    } catch (error) {
      setAllocationStatus('Failed to run allocation');
    } finally {
      setIsAllocating(false);
    }
  };

  const publishResults = async () => {
    setIsPublishing(true);
    setPublicationStatus('');
    try {
      const res = await fetch('/api/admin/publish', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: true })
      });
      const data = await res.json();
      if (data.success) {
        setPublicationStatus('Results published successfully!');
      } else {
        setPublicationStatus(`Error: ${data.error || 'Publication failed'}`);
      }
    } catch (error) {
      setPublicationStatus('Failed to publish results');
    } finally {
      setIsPublishing(false);
    }
  };

  const exportCandidates = async () => {
    setIsExporting(true);
    setExportStatus('');
    try {
      const res = await fetch('/api/admin/export/candidates');
      
      if (!res.ok) {
        throw new Error(`Failed to fetch export data: ${res.statusText}`);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `istc_candidates_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setExportStatus('Candidates exported successfully!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error: any) {
      setExportStatus(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
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
    opacity: disabled ? 0.7 : 1
  });

  const statusMessageStyle = (isError: boolean) => ({
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    fontWeight: 500,
    background: isError ? '#fee2e2' : '#dcfce7',
    color: isError ? '#b91c1c' : '#166534'
  });

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Seat Allocation Management</h1>
      <p style={subtitleStyle}>
        Manage candidate allocations and publish results to students
      </p>

      {/* Action Buttons Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Run Allocation</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Execute the seat allocation algorithm to assign seats to candidates according to their preferences.
          </p>
          <button
            onClick={runAllocation}
            disabled={isAllocating}
            style={actionButtonStyle('#1e40af', isAllocating)}
          >
            {isAllocating ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>Processing...</span>
                <span className="spinner"></span>
              </span>
            ) : 'Run Seat Allocation'}
          </button>
          {allocationStatus && (
            <div style={statusMessageStyle(allocationStatus.includes('Error'))}>
              {allocationStatus}
            </div>
          )}
        </div>
        
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Publish Results</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Make allocation results visible to candidates after allocation is complete.
          </p>
          <button
            onClick={publishResults}
            disabled={isPublishing}
            style={actionButtonStyle('#10b981', isPublishing)}
          >
            {isPublishing ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>Publishing...</span>
                <span className="spinner"></span>
              </span>
            ) : 'Publish Results'}
          </button>
          {publicationStatus && (
            <div style={statusMessageStyle(publicationStatus.includes('Error'))}>
              {publicationStatus}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Export Candidates</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Download the list of allocated candidates with their details in CSV format.
          </p>
          <button
            onClick={exportCandidates}
            disabled={isExporting}
            style={actionButtonStyle('#f59e0b', isExporting)}
          >
            {isExporting ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>Exporting...</span>
                <span className="spinner"></span>
              </span>
            ) : 'Export Candidates'}
          </button>
          {exportStatus && (
            <div style={statusMessageStyle(exportStatus.includes('failed'))}>
              {exportStatus}
            </div>
          )}
        </div>
      </div>

      {/* Seat Matrix Section */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Seat Availability</h2>
        <SeatMatrix />
      </div>
      
      {/* Candidate Table Section */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Candidate Allocation Status</h2>
        <CandidateTable />
      </div>

      {/* Spinner CSS */}
      <style jsx>{`
        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
