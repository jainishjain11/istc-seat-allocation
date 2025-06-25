'use client';
import { useState, useEffect } from 'react';

export default function SeatMatrix() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error('Failed to fetch courses');
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="seat-matrix">
      <table className="matrix-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Total Seats</th>
            <th>Available</th>
            <th>General</th>
            <th>SC</th>
            <th>ST</th>
            <th>OBC</th>
            <th>EWS</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.course_name}</td>
              <td>{course.total_seats}</td>
              <td>{course.available_seats}</td>
              <td>{course.general_seats}</td>
              <td>{course.sc_seats}</td>
              <td>{course.st_seats}</td>
              <td>{course.obc_seats}</td>
              <td>{course.ews_seats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
