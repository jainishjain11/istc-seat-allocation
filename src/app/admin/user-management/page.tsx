'use client';
import { useState, useRef } from 'react';

export default function UserManagementPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!csvFile) return;
    
    setIsUploading(true);
    setUploadStatus('');
    
    const formData = new FormData();
    formData.append('csv', csvFile);
    
    try {
      const res = await fetch('/api/admin/upload-users', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setUploadStatus(`Successfully uploaded ${data.count} users!`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setCsvFile(null);
      } else {
        setUploadStatus(`Error: ${data.error || 'Upload failed'}`);
      }
    } catch (error) {
      setUploadStatus('Failed to upload users');
    } finally {
      setIsUploading(false);
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

  const uploadAreaStyle = {
    border: '2px dashed #d1d5db',
    borderRadius: '1rem',
    padding: '3rem 2rem',
    textAlign: 'center' as const,
    background: '#f9fafb',
    marginBottom: '1.5rem',
    transition: 'border-color 0.2s'
  };

  const fileInputStyle = {
    display: 'block',
    width: '100%',
    margin: '0 auto 1.5rem',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem'
  };

  const uploadButtonStyle = {
    background: '#1e40af',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.1rem',
    borderRadius: '0.5rem',
    padding: '0.9rem 2.2rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
    opacity: isUploading ? 0.7 : 1
  };

  const fileInfoStyle = {
    background: '#e0f2fe',
    color: '#0369a1',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    fontWeight: 500
  };

  const statusStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    fontWeight: 500,
    background: uploadStatus.includes('Error') ? '#fee2e2' : '#dcfce7',
    color: uploadStatus.includes('Error') ? '#b91c1c' : '#166534',
    textAlign: 'center' as const
  };

  const templateCardStyle = {
    background: '#fffbeb',
    borderLeft: '4px solid #f59e0b',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginTop: '2rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>User Management</h1>
      <p style={subtitleStyle}>
        Manage candidate accounts and bulk upload users
      </p>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Bulk User Upload</h2>
        
        <div style={uploadAreaStyle}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={fileInputStyle}
          />
          
          <button
            onClick={handleUpload}
            disabled={!csvFile || isUploading}
            style={uploadButtonStyle}
          >
            {isUploading ? 'Uploading...' : 'Upload Users'}
          </button>
          
          {csvFile && (
            <div style={fileInfoStyle}>
              Selected file: {csvFile.name} ({Math.round(csvFile.size / 1024)} KB)
            </div>
          )}
          
          {uploadStatus && (
            <div style={statusStyle}>
              {uploadStatus}
            </div>
          )}
        </div>
        
        <div style={templateCardStyle}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#b45309', marginBottom: '1rem' }}>
            CSV Template Requirements
          </h3>
          <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>•</span>
              <span>Required columns: <code>email, password, full_name, phone, aadhar_id, dob</code></span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>•</span>
              <span>Date format: <code>YYYY-MM-DD</code></span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>•</span>
              <span>Passwords must be at least 8 characters</span>
            </li>
          </ul>
          <a 
            href="/templates/user-upload-template.csv" 
            download
            style={{
              display: 'inline-block',
              background: '#f59e0b',
              color: '#fff',
              fontWeight: 600,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none'
            }}
          >
            Download CSV Template
          </a>
        </div>
      </div>
    </div>
  );
}
