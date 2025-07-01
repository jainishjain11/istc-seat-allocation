// src/app/admin/user-management/page.tsx
'use client';
import { useState, useRef } from 'react';
import Papa from 'papaparse';

// Define types for CSV data
interface UserCsvRow {
  email: string;
  dob: string;
}

export default function UserManagementPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<UserCsvRow[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);

      // Reset preview and status
      setCsvPreview([]);
      setUploadStatus('');
      
      // Parse CSV for preview
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<UserCsvRow>) => {
          if (results.data) {
            setCsvPreview(results.data.slice(0, 10)); // Preview first 10 rows
          }
        },
        error: (error: Error) => {
          setUploadStatus(`CSV parse error: ${error.message}`);
        }
      });
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
        setCsvPreview([]);
      } else {
        setUploadStatus(`Error: ${data.error || 'Upload failed'}`);
      }
    } catch (error) {
      setUploadStatus('Failed to upload users');
    } finally {
      setIsUploading(false);
    }
  };

  // Style objects with explicit CSSProperties typing
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.2rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.25rem'
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#64748b',
    marginBottom: '2rem',
    fontSize: '1.15rem'
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 4px 16px rgba(30,64,175,0.09)',
    padding: '2rem 1.5rem',
    marginBottom: '2rem'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#1e40af',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e5e7eb'
  };

  const uploadAreaStyle: React.CSSProperties = {
    border: '2px dashed #d1d5db',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
    background: '#f9fafb',
    marginBottom: '1.5rem',
    transition: 'border-color 0.2s'
  };

  const fileInputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    margin: '0 auto 1.5rem',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem'
  };

  const uploadButtonStyle: React.CSSProperties = {
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

  const fileInfoStyle: React.CSSProperties = {
    background: '#e0f2fe',
    color: '#0369a1',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    fontWeight: 500,
    textAlign: 'center'
  };

  const statusStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    fontWeight: 500,
    background: uploadStatus.includes('Error') ? '#fee2e2' : '#dcfce7',
    color: uploadStatus.includes('Error') ? '#b91c1c' : '#166534',
    textAlign: 'center'
  };

  const templateCardStyle: React.CSSProperties = {
    background: '#fffbeb',
    borderLeft: '4px solid #f59e0b',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginTop: '2rem'
  };

  const previewContainerStyle: React.CSSProperties = {
    marginTop: '2rem',
    overflowX: 'auto' as 'auto'
  };

  const previewTitleStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1e40af',
    marginBottom: '0.75rem'
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse' as 'collapse',
    background: '#fff',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: '#f3f4f6',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: 600,
    color: '#374151',
    borderBottom: '1px solid #e5e7eb'
  };

  const tdStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e5e7eb',
    color: '#4b5563'
  };

  const trHoverStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>User Management</h1>
      <p style={subtitleStyle}>
        Manage candidate accounts and upload users
      </p>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>User Upload</h2>
        
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
        
        {/* CSV Preview Section */}
        {csvPreview.length > 0 && (
          <div style={previewContainerStyle}>
            <div style={previewTitleStyle}>
              CSV Preview (First {csvPreview.length} rows)
            </div>
            <div style={{ overflowX: 'auto', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Date of Birth</th>
                  </tr>
                </thead>
                <tbody>
                  {csvPreview.map((row, index) => (
                    <tr key={index} style={index % 2 === 0 ? undefined : trHoverStyle}>
                      <td style={tdStyle}>{row.email}</td>
                      <td style={tdStyle}>{row.dob}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={templateCardStyle}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#b45309', marginBottom: '1rem' }}>
            CSV Template Requirements
          </h3>
          <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>•</span>
              <span>Required columns: <code>email, dob</code></span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>•</span>
              <span>Password will be automatically set to DOB</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>•</span>
              <span>Date format: <code>YYYY-MM-DD</code></span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>•</span>
              <span>Example email: <code>student@example.com</code></span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>•</span>
              <span>Example DOB: <code>2005-03-15</code></span>
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
