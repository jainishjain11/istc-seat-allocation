'use client';
import { useState } from 'react';
import styles from './registration-page.module.css';

const COURSE_OPTIONS = [
  "Advanced Diploma in Mechatronics and Industrial Automation 4 years",
  "Diploma in Electronics Engineering 3 years",
  "Diploma in Mechanical Engineering (Tool & Die)",
  "Advanced Diploma in Die and Mould Making 4 years"
];

const QUOTA_OPTIONS = [
  "General",
  "OBC",
  "SC",
  "ST",
  "EWS"
];

const BOARD_OPTIONS = [
  "CBSE",
  "ICSE",
  "State Board",
  "Other"
];

const STATE_OPTIONS = [
  "Punjab",
  "Haryana",
  "Chandigarh",
  "Delhi",
  "Other"
];

export default function RegistrationPage() {
  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    aadhaar: '',
    email: '',
    marks10: '',
    quota: '',
    preferences: [] as string[],
    state: '',
    board: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setForm(prev => ({ ...prev, preferences: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Basic validation
    if (!form.name || !form.fatherName || !form.motherName || !form.aadhaar || !form.email || !form.marks10 || !form.quota || !form.state || !form.board || form.preferences.length === 0) {
      setError('Please fill all required fields and select at least one preference.');
      return;
    }
    // Aadhaar validation (12 digits)
    if (!/^\d{12}$/.test(form.aadhaar)) {
      setError('Aadhaar ID must be a 12-digit number.');
      return;
    }
    // Marks validation
    if (isNaN(Number(form.marks10)) || Number(form.marks10) < 0 || Number(form.marks10) > 100) {
      setError('10th marks must be a number between 0 and 100.');
      return;
    }
    // Email validation
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Enter a valid email address.');
      return;
    }
    // TODO: Send data to backend API
    setSuccess('Registration submitted successfully!');
    setForm({
      name: '',
      fatherName: '',
      motherName: '',
      aadhaar: '',
      email: '',
      marks10: '',
      quota: '',
      preferences: [],
      state: '',
      board: ''
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Student Registration</h2>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} className={styles.input} required />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Father's Name</label>
            <input name="fatherName" type="text" value={form.fatherName} onChange={handleChange} className={styles.input} required />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Mother's Name</label>
            <input name="motherName" type="text" value={form.motherName} onChange={handleChange} className={styles.input} required />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Aadhaar ID</label>
            <input name="aadhaar" type="text" value={form.aadhaar} onChange={handleChange} className={styles.input} maxLength={12} required />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={styles.input} required />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>10th Marks (%)</label>
            <input name="marks10" type="number" value={form.marks10} onChange={handleChange} className={styles.input} min={0} max={100} required />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Quota</label>
            <select name="quota" value={form.quota} onChange={handleChange} className={styles.input} required>
              <option value="">Select Quota</option>
              {QUOTA_OPTIONS.map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Preferences (select in order)</label>
            <select
              name="preferences"
              multiple
              value={form.preferences}
              onChange={handlePreferencesChange}
              className={styles.input}
              required
              size={COURSE_OPTIONS.length}
            >
              {COURSE_OPTIONS.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            <span className={styles.note}>Hold Ctrl (Windows) or Cmd (Mac) to select multiple</span>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>State</label>
            <select name="state" value={form.state} onChange={handleChange} className={styles.input} required>
              <option value="">Select State</option>
              {STATE_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Board</label>
            <select name="board" value={form.board} onChange={handleChange} className={styles.input} required>
              <option value="">Select Board</option>
              {BOARD_OPTIONS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
          <button type="submit" className={styles.button}>Register</button>
        </form>
      </div>
    </div>
  );
}
