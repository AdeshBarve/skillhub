import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

useEffect(() => {
  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/course/getCourse/${id}`);
      console.log("Course:", res.data);

      // ✅ Fix: Access the first item from the array
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCourse(res.data[0]);
      } else {
        setError('Course not found');
      }
    } catch (err) {
      setError('Could not fetch course');
    }
  };

  fetchCourse();
}, [id, token]);


  const handleEnroll = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/auth/course/enroll/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Enrolled successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to enroll');
    }
  };

  if (error) return <div className="text-center text-red-500">{error}</div>;

  if (!course) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-4">{course.title}</h2>
      <p className="text-gray-600 mb-2"><strong>Instructor:</strong> {course.instructor}</p>
      <p className="text-gray-700 mb-4"><strong>Description:</strong> {course.description}</p>
      <p className="text-green-600 font-semibold mb-6"><strong>Price:</strong> ₹{course.price}</p>

      <button
        onClick={handleEnroll}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Enroll
      </button>
    </div>
  );
};

export default CourseDetails;
