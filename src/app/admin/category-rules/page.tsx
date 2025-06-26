'use client';
import { useState, useEffect } from 'react';

export default function CategoryRulesPage() {
  const [rules, setRules] = useState({
    sc: 0,
    st: 0,
    obc: 0,
    ews: 0
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await fetch('/api/admin/category-rules');
        const data = await res.json();
        if (data.success && data.rules) {
          setRules({
            sc: data.rules.sc || 0,
            st: data.rules.st || 0,
            obc: data.rules.obc || 0,
            ews: data.rules.ews || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch category rules');
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRules(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const saveRules = async () => {
    try {
      setSaveStatus('Saving...');
      
      // Calculate general percentage automatically
      const reservedTotal = rules.sc + rules.st + rules.obc + rules.ews;
      const generalPercentage = 100 - reservedTotal;
      
      const completeRules = {
        general: generalPercentage,
        sc: rules.sc,
        st: rules.st,
        obc: rules.obc,
        ews: rules.ews
      };
      
      const res = await fetch('/api/admin/category-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeRules)
      });
      
      const data = await res.json();
      if (data.success) {
        setSaveStatus('Rules saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus(`Error: ${data.error || 'Save failed'}`);
      }
    } catch (error) {
      setSaveStatus('Failed to save rules');
    }
  };

  const reservedTotal = rules.sc + rules.st + rules.obc + rules.ews;
  const generalPercentage = 100 - reservedTotal;

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

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1.1rem'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 500,
    marginBottom: '0.5rem',
    color: '#334155'
  };

  const inputGroupStyle = {
    marginBottom: '2rem' // Added spacing between input groups
  };

  const saveButtonStyle = {
    background: reservedTotal > 100 ? '#9ca3af' : '#1e40af',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.1rem',
    borderRadius: '0.5rem',
    padding: '1rem 2rem',
    border: 'none',
    cursor: reservedTotal > 100 ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s',
    width: '100%',
    maxWidth: '300px',
    margin: '1.5rem auto 0',
    display: 'block'
  };

  const statusStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    fontWeight: 500,
    background: saveStatus.includes('Error') ? '#fee2e2' : '#dcfce7',
    color: saveStatus.includes('Error') ? '#b91c1c' : '#166534',
    textAlign: 'center' as const
  };

  const generalInfoStyle = {
    background: '#f0f9ff',
    border: '1px solid #e0f2fe',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'center' as const
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Category Allocation Rules</h1>
        <p style={subtitleStyle}>Loading rules...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Category Allocation Rules</h1>
      <p style={subtitleStyle}>
        Set reservation percentages for each category. General seats will be calculated automatically.
      </p>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Reservation Percentages</h2>
        
        {/* General Category Info */}
        <div style={generalInfoStyle}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0369a1' }}>
            General Category: {generalPercentage}% (Calculated Automatically)
          </div>
          <div style={{ fontSize: '0.9rem', color: '#0369a1', marginTop: '0.5rem' }}>
            General seats = 100% - (Reserved category percentages)
          </div>
        </div>
        
        <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem', // Adds space between boxes
    marginBottom: '2rem',
    width: '100%',
  }}
>
  <div>
    <label style={labelStyle}>SC (%)</label>
    <input
      type="number"
      name="sc"
      value={rules.sc}
      onChange={handleChange}
      min="0"
      max="50"
      style={{
        ...inputStyle,
        width: '100%',
        boxSizing: 'border-box',
      }}
    />
  </div>
  <div>
    <label style={labelStyle}>ST (%)</label>
    <input
      type="number"
      name="st"
      value={rules.st}
      onChange={handleChange}
      min="0"
      max="50"
      style={{
        ...inputStyle,
        width: '100%',
        boxSizing: 'border-box',
      }}
    />
  </div>
  <div>
    <label style={labelStyle}>OBC (%)</label>
    <input
      type="number"
      name="obc"
      value={rules.obc}
      onChange={handleChange}
      min="0"
      max="50"
      style={{
        ...inputStyle,
        width: '100%',
        boxSizing: 'border-box',
      }}
    />
  </div>
  <div>
    <label style={labelStyle}>EWS (%)</label>
    <input
      type="number"
      name="ews"
      value={rules.ews}
      onChange={handleChange}
      min="0"
      max="50"
      style={{
        ...inputStyle,
        width: '100%',
        boxSizing: 'border-box',
      }}
    />
  </div>
</div>

        
        {/* Warning for over 100% */}
        {reservedTotal > 100 && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#b91c1c', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Warning: Reserved percentages exceed 100%. Please adjust the values.
          </div>
        )}
        
        <button 
          onClick={saveRules}
          style={saveButtonStyle}
          disabled={reservedTotal > 100}
        >
          Save Rules
        </button>
        
        {saveStatus && (
          <div style={statusStyle}>
            {saveStatus}
          </div>
        )}
      </div>
    </div>
  );
}
