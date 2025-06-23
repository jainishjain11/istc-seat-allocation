// src/app/candidate/[userId]/register/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './register.module.css';

export default function CandidateRegistration() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  
  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    phone: '',
    aadhar_id: '',
    tenth_percentage: '',
    board_name: '',
    state: '',
    category: 'General',
    exam_rank: '',
    preference_1: '',
    preference_2: '',
    preference_3: ''
  });
  
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        
        if (data.success && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    
    fetchCourses();
  }, []);

  // Get available courses for a specific preference dropdown
  const getAvailableCourses = (currentPreference: string) => {
    const selectedPreferences = [
      formData.preference_1,
      formData.preference_2,
      formData.preference_3
    ].filter(id => id && id !== currentPreference);

    return courses.filter(course => 
      !selectedPreferences.includes(course.id.toString())
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    // Validate that all preferences are unique
    const preferences = [
      formData.preference_1,
      formData.preference_2,
      formData.preference_3
    ].filter(Boolean);
    
    if (new Set(preferences).size !== preferences.length) {
      setError('Each course can only be selected once across preferences');
      setSubmitting(false);
      return;
    }
    
    try {
      const res = await fetch('/api/candidate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId })
      });
      
      const data = await res.json();
      
      if (data.success) {
        router.push(`/candidate/${userId}/dashboard`);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCourses) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingText}>
          Loading registration form...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Complete Your Registration</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.gridContainer}>
          {/* Personal Details Section */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Father's Name *</label>
            <input
              type="text"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Aadhar ID *</label>
            <input
              type="text"
              name="aadhar_id"
              value={formData.aadhar_id}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>10th Percentage *</label>
            <input
              type="number"
              name="tenth_percentage"
              value={formData.tenth_percentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Board Name *</label>
            <input
              type="text"
              name="board_name"
              value={formData.board_name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Exam Rank *</label>
            <input
              type="number"
              name="exam_rank"
              value={formData.exam_rank}
              onChange={handleChange}
              min="1"
              required
              className={styles.input}
            />
          </div>
        </div>
        
        <div className={styles.preferencesSection}>
          <h2 className={styles.preferencesTitle}>Course Preferences</h2>
          <p className={styles.preferencesNote}>
            Each course can only be selected once across all preferences
          </p>
          
          <div className={styles.preferenceGroup}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>First Preference *</label>
              <select
                name="preference_1"
                value={formData.preference_1}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select Course</option>
                {getAvailableCourses(formData.preference_1).map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Second Preference</label>
              <select
                name="preference_2"
                value={formData.preference_2}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select Course</option>
                {getAvailableCourses(formData.preference_2).map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Third Preference</label>
              <select
                name="preference_3"
                value={formData.preference_3}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select Course</option>
                {getAvailableCourses(formData.preference_3).map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={submitting}
          className={styles.submitButton}
        >
          {submitting ? 'Submitting...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}