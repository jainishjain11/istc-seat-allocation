'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './candidate.module.css';

type Course = {
  id: number;
  course_name: string;
  course_code: string;
};

export default function CandidateRegistration() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    phone: '',
    aadhar_id: '',
    tenth_percentage: '',
    board_name: '',
    state: '',
    category: '',
    exam_rank: '',
    preference_1: '',
    preference_2: '',
    preference_3: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Debug: Log the userId from URL
  useEffect(() => {
    console.log('🔍 UserId from URL params:', userId);
  }, [userId]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
          console.log('📚 Courses loaded:', data.courses.length);
        }
      } catch (err) {
        console.error('❌ Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  // Check if already registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (!userId) return;
      
      try {
        const res = await fetch(`/api/candidate/${userId}/status`);
        const data = await res.json();
        if (data.success && data.isRegistered) {
          console.log('ℹ️ User already registered, redirecting to dashboard');
          router.push(`/candidate/${userId}/dashboard`);
        }
      } catch (err) {
        console.error('❌ Failed to check registration status:', err);
      }
    };
    checkRegistration();
  }, [userId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🚀 Starting form submission...');
    console.log('🆔 UserId to submit:', userId);

    // Check if userId exists
    if (!userId) {
      setError('User ID not found in URL');
      setLoading(false);
      return;
    }

    // Frontend validation
    const requiredFields = [
      'full_name', 'father_name', 'phone', 'aadhar_id',
      'tenth_percentage', 'board_name', 'state', 'category', 'exam_rank'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`${field.replace('_', ' ')} is required`);
        setLoading(false);
        return;
      }
    }

    if (!formData.preference_1) {
      setError('At least first course preference is required');
      setLoading(false);
      return;
    }

    try {
      // Prepare the payload with userId
      const payload = {
        userId: userId, // 🔑 Key fix: explicitly include userId
        full_name: formData.full_name.trim(),
        father_name: formData.father_name.trim(),
        phone: formData.phone.trim(),
        aadhar_id: formData.aadhar_id.trim(),
        tenth_percentage: formData.tenth_percentage.trim(),
        board_name: formData.board_name.trim(),
        state: formData.state.trim(),
        category: formData.category.trim(),
        exam_rank: formData.exam_rank.trim(),
        preference_1: formData.preference_1 || null,
        preference_2: formData.preference_2 || null,
        preference_3: formData.preference_3 || null
      };

      console.log('📤 Sending payload:', payload);

      const response = await fetch('/api/candidate/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('📥 Parsed response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      console.log('✅ Registration successful, redirecting...');
      router.push(`/candidate/${userId}/dashboard`);
      
    } catch (err: any) {
      console.error('💥 Submit error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>Complete Your Registration</h1>
      <p className={styles.userInfo}>User ID: {userId}</p> {/* Debug info */}
      
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Personal Information */}
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name *</label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Father's Name *</label>
            <input
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone *</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.formInput}
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Aadhar ID *</label>
            <input
              name="aadhar_id"
              value={formData.aadhar_id}
              onChange={handleChange}
              className={styles.formInput}
              pattern="[0-9]{12}"
              maxLength={12}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>10th Percentage *</label>
            <input
              name="tenth_percentage"
              type="number"
              value={formData.tenth_percentage}
              onChange={handleChange}
              className={styles.formInput}
              min="0"
              max="100"
              step="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Board *</label>
            <select
              name="board_name"
              value={formData.board_name}
              onChange={handleChange}
              className={styles.formSelect}
              required
            >
              <option value="">Select Board</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>State *</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={styles.formSelect}
              required
            >
              <option value="">Select State</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Chandigarh">Chandigarh</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.formSelect}
              required
            >
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Exam Rank *</label>
            <input
              name="exam_rank"
              type="number"
              value={formData.exam_rank}
              onChange={handleChange}
              className={styles.formInput}
              min="1"
              required
            />
          </div>
        </div>

        {/* Course Preferences */}
        <div className={styles.preferencesSection}>
          <h3 className={styles.preferencesTitle}>Course Preferences</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>1st Preference *</label>
            <select
              name="preference_1"
              value={formData.preference_1}
              onChange={handleChange}
              className={styles.formSelect}
              required
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.course_name} ({course.course_code})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>2nd Preference</label>
            <select
              name="preference_2"
              value={formData.preference_2}
              onChange={handleChange}
              className={styles.formSelect}
            >
              <option value="">Select Course</option>
              {courses
                .filter(course => course.id.toString() !== formData.preference_1)
                .map(course => (
                  <option key={course.id} value={course.id}>
                    {course.course_name} ({course.course_code})
                  </option>
                ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>3rd Preference</label>
            <select
              name="preference_3"
              value={formData.preference_3}
              onChange={handleChange}
              className={styles.formSelect}
            >
              <option value="">Select Course</option>
              {courses
                .filter(course => 
                  course.id.toString() !== formData.preference_1 && 
                  course.id.toString() !== formData.preference_2
                )
                .map(course => (
                  <option key={course.id} value={course.id}>
                    {course.course_name} ({course.course_code})
                  </option>
                ))}
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  );
}
