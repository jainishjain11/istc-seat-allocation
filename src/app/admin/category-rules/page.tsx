'use client';
import { useState, useEffect } from 'react';

export default function CategoryRulesPage() {
  const [rules, setRules] = useState({
    general: 0,
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
          setRules(data.rules);
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
      const res = await fetch('/api/admin/category-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rules)
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

  const totalPercentage = rules.general + rules.sc + rules.st + rules.obc + rules.ews;

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

  const saveButtonStyle = {
    background: '#1e40af',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.1rem',
    borderRadius: '0.5rem',
    padding: '1rem 2rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
    width: '100%',
    maxWidth: '300px',
    margin: '1.5rem auto 0'
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
        Set reservation percentages for each category
      </p>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Reservation Percentages</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>General (%)</label>
            <input
              type="number"
              name="general"
              value={rules.general}
              onChange={handleChange}
              min="0"
              max="100"
              style={inputStyle}
            />
          </div>
          
          <div>
            <label style={labelStyle}>SC (%)</label>
            <input
              type="number"
              name="sc"
              value={rules.sc}
              onChange={handleChange}
              min="0"
              max="100"
              style={inputStyle}
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
              max="100"
              style={inputStyle}
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
              max="100"
              style={inputStyle}
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
              max="100"
              style={inputStyle}
            />
          </div>
        </div>
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          background: '#f3f4f6', 
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e40af' }}>
            Total Percentage: {totalPercentage}%
          </div>
          <div style={{ 
            marginTop: '0.5rem',
            color: totalPercentage === 100 ? '#166534' : totalPercentage > 100 ? '#b91c1c' : '#ca8a04',
            fontWeight: 500
          }}>
            {totalPercentage === 100 
              ? 'Perfect! Total is 100%' 
              : totalPercentage > 100 
                ? 'Error: Total exceeds 100%' 
                : `Warning: Total should be 100% (${100 - totalPercentage}% remaining)`}
          </div>
        </div>
        
        <button 
          onClick={saveRules}
          style={saveButtonStyle}
          disabled={totalPercentage !== 100}
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
