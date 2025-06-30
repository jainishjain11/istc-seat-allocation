'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ActivityLog {
  id: number;
  email: string;
  activity_type: string;
  details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hours, setHours] = useState(8);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/activity-logs?hours=${hours}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      } else {
        setError(data.error || 'Failed to fetch logs');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Candidate Activity Logs (Last ${hours} Hours)`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    const tableData = logs.map(log => [
      log.email,
      log.activity_type.replace(/_/g, ' '),
      log.details,
      log.ip_address,
      new Date(log.created_at).toLocaleString()
    ]);
    autoTable(doc, {
      head: [['Email', 'Activity', 'Details', 'IP Address', 'Timestamp']],
      body: tableData,
      startY: 25,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    doc.save(`activity_logs_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [hours]);

  return (
    <div className="activity-log-container">
      <div className="activity-log-header">
        <div>
          <h1>📝 User Activity Logs</h1>
          <p>Monitor all candidate actions with timestamps and details.</p>
        </div>
        <div className="activity-log-controls">
          <label>
            <span>Show logs from last</span>
            <select value={hours} onChange={e => setHours(Number(e.target.value))}>
              <option value={1}>1 hour</option>
              <option value={4}>4 hours</option>
              <option value={8}>8 hours</option>
              <option value={24}>24 hours</option>
              <option value={72}>3 days</option>
            </select>
          </label>
          <button
            className="activity-log-btn"
            onClick={fetchLogs}
            disabled={loading}
            style={{ background: '#2563eb' }}
          >
            Refresh
          </button>
          <button
            className="activity-log-btn"
            onClick={generatePDF}
            disabled={loading || logs.length === 0}
            style={{ background: '#059669' }}
          >
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="activity-log-loading">
          <div className="activity-log-spinner"></div>
          <span>Loading activity logs...</span>
        </div>
      ) : error ? (
        <div className="activity-log-alert activity-log-alert-error">{error}</div>
      ) : logs.length === 0 ? (
        <div className="activity-log-alert activity-log-alert-warn">
          No activity logs found in the selected time range.
        </div>
      ) : (
        <div className="activity-log-table-wrapper">
          <table className="activity-log-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Activity</th>
                <th>Details</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.email}</td>
                  <td>{log.activity_type.replace(/_/g, ' ')}</td>
                  <td>{log.details}</td>
                  <td>{log.ip_address}</td>
                  <td>
                    {new Date(log.created_at).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
  .activity-log-container {
    max-width: 1000px;
    margin: 2.5rem auto 0 auto;
    padding: 0.5rem 0.5rem 2rem 0.5rem;
    font-size: 1.13rem;
    background: #f7fafc;
  }
  .activity-log-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1.2rem;
    gap: 0.6rem;
  }
  .activity-log-header h1 {
    font-size: 2.1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.2rem;
  }
  .activity-log-header p {
    color: #64748b;
    font-size: 1.1rem;
    margin: 0;
  }
  .activity-log-controls {
    display: flex;
    gap: 0.6rem;
    align-items: center;
  }
  .activity-log-controls label {
    font-size: 1rem;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .activity-log-controls select {
    margin-left: 0.2rem;
    padding: 0.3rem 0.7rem;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    font-size: 1rem;
    background: #fff;
  }
  .activity-log-btn {
    padding: 0.5rem 1.2rem;
    border: none;
    border-radius: 6px;
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.18s;
  }
  .activity-log-btn:disabled {
    background: #cbd5e1 !important;
    cursor: not-allowed;
  }
  .activity-log-loading {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    padding: 2rem 0;
  }
  .activity-log-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #e0e7ef;
    border-top: 3px solid #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .activity-log-alert {
    margin: 1rem auto;
    max-width: 700px;
    padding: 0.7rem 1.1rem;
    border-radius: 8px;
    font-size: 1.07rem;
    text-align: center;
  }
  .activity-log-alert-error {
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fca5a5;
  }
  .activity-log-alert-warn {
    background: #fef9c3;
    color: #92400e;
    border: 1px solid #fde68a;
  }
  .activity-log-table-wrapper {
    overflow-x: auto;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(30,64,175,0.07);
  }
  .activity-log-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1.08rem;
    table-layout: fixed;
  }
  .activity-log-table th,
  .activity-log-table td {
    padding: 0.45rem 0.7rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .activity-log-table th {
    background: #e0e7ef;
    font-weight: 700;
    color: #1e293b;
    font-size: 1.08rem;
  }
  .activity-log-table td {
    font-size: 1.07rem;
  }
  .activity-log-table tr:nth-child(even) {
    background: #f7fafc;
  }
  .activity-log-table tr:hover {
    background: #f1f5f9;
  }
  @media (max-width: 700px) {
    .activity-log-container {
      padding: 0.5rem;
      font-size: 1rem;
    }
    .activity-log-header h1 {
      font-size: 1.4rem;
    }
    .activity-log-header p {
      font-size: 0.97rem;
    }
    .activity-log-btn {
      font-size: 0.98rem;
      padding: 0.4rem 0.7rem;
    }
    .activity-log-table th,
    .activity-log-table td {
      padding: 0.3rem 0.4rem;
      font-size: 0.95rem;
    }
  }
`}</style>

    </div>
  );
}
