'use client';
import { useState } from 'react';
import SeatMatrix from '@/components/admin/SeatMatrix';
import CandidateTable from '@/components/admin/CandidateTable';

export default function SeatAllocationPage() {
  const [isAllocating, setIsAllocating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [allocationStatus, setAllocationStatus] = useState('');
  const [publicationStatus, setPublicationStatus] = useState('');

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

  return (
    <div className="admin-container">
      <h1 className="admin-title">Seat Allocation Management</h1>
      
      <div className="action-section">
        <div className="action-card">
          <h2 className="section-title">Run Allocation</h2>
          <p className="section-description">
            Execute the seat allocation algorithm to assign seats to candidates
          </p>
          <button
            onClick={runAllocation}
            disabled={isAllocating}
            className={`action-button ${isAllocating ? 'bg-gray-400' : 'bg-blue-600'}`}
          >
            {isAllocating ? 'Processing...' : 'Run Seat Allocation'}
          </button>
          {allocationStatus && (
            <div className={`status-message ${allocationStatus.includes('Error') ? 'error' : 'success'}`}>
              {allocationStatus}
            </div>
          )}
        </div>
        
        <div className="action-card">
          <h2 className="section-title">Publish Results</h2>
          <p className="section-description">
            Make allocation results visible to candidates
          </p>
          <button
            onClick={publishResults}
            disabled={isPublishing}
            className={`action-button ${isPublishing ? 'bg-gray-400' : 'bg-green-600'}`}
          >
            {isPublishing ? 'Publishing...' : 'Publish Results'}
          </button>
          {publicationStatus && (
            <div className={`status-message ${publicationStatus.includes('Error') ? 'error' : 'success'}`}>
              {publicationStatus}
            </div>
          )}
        </div>
      </div>
      
      <div className="seat-matrix-section">
        <h2 className="section-title">Seat Availability</h2>
        <SeatMatrix />
      </div>
      
      <div className="candidate-section">
        <h2 className="section-title">Candidate Allocation Status</h2>
        <CandidateTable />
      </div>
    </div>
  );
}
