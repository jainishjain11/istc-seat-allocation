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

  return (
    <div className="admin-container">
      <h1 className="admin-title">User Management</h1>
      
      <div className="upload-section">
        <h2 className="section-title">Bulk User Upload</h2>
        <p className="section-description">
          Upload a CSV file to add multiple users at once
        </p>
        
        <div className="upload-area">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="file-input"
          />
          
          <button
            onClick={handleUpload}
            disabled={!csvFile || isUploading}
            className={`action-button ${!csvFile || isUploading ? 'bg-gray-400' : 'bg-purple-600'}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Users'}
          </button>
          
          {csvFile && (
            <div className="file-info">
              Selected file: {csvFile.name} ({Math.round(csvFile.size / 1024)} KB)
            </div>
          )}
          
          {uploadStatus && (
            <div className={`status-message ${uploadStatus.includes('Error') ? 'error' : 'success'}`}>
              {uploadStatus}
            </div>
          )}
        </div>
        
        <div className="csv-template">
          <h3>CSV Template</h3>
          <p>Download the template file to ensure correct formatting:</p>
          <a 
            href="/templates/user-upload-template.csv" 
            download
            className="template-link"
          >
            Download CSV Template
          </a>
          <p className="template-note">
            Required columns: email, password, full_name, phone, aadhar_id, dob
          </p>
        </div>
      </div>
      
      <div className="user-table-section">
        <h2 className="section-title">User List</h2>
        <div className="table-container">
          {/* User table will be implemented here */}
          <p>User table will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
