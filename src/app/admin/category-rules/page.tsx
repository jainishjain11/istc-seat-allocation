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

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await fetch('/api/admin/category-rules');
        const data = await res.json();
        if (data.success) {
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
    setRules(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const saveRules = async () => {
    try {
      const res = await fetch('/api/admin/category-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rules)
      });
      const data = await res.json();
      if (data.success) {
        alert('Category rules updated successfully!');
      }
    } catch (error) {
      alert('Failed to save category rules');
    }
  };

  if (loading) return <div>Loading category rules...</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Category Allocation Rules</h1>
      <p className="admin-subtitle">Set reservation percentages for each category</p>
      
      <div className="rules-form">
        <div className="rule-item">
          <label>General (%)</label>
          <input
            type="number"
            name="general"
            value={rules.general}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>
        
        <div className="rule-item">
          <label>Scheduled Caste (SC) (%)</label>
          <input
            type="number"
            name="sc"
            value={rules.sc}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>
        
        <div className="rule-item">
          <label>Scheduled Tribe (ST) (%)</label>
          <input
            type="number"
            name="st"
            value={rules.st}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>
        
        <div className="rule-item">
          <label>Other Backward Classes (OBC) (%)</label>
          <input
            type="number"
            name="obc"
            value={rules.obc}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>
        
        <div className="rule-item">
          <label>Economically Weaker Section (EWS) (%)</label>
          <input
            type="number"
            name="ews"
            value={rules.ews}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>
        
        <div className="rule-total">
          Total: {rules.general + rules.sc + rules.st + rules.obc + rules.ews}%
        </div>
        
        <button 
          onClick={saveRules}
          className="save-button"
        >
          Save Rules
        </button>
      </div>
    </div>
  );
}
