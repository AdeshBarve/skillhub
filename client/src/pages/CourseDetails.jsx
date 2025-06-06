import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const [instructor, setInstructor] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/course/getCourse/${id}`);
        const instructorId = res.data[0].instructor;
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCourse(res.data[0]);
        } else {
          setError('Course not found');
        }
        fetchInstructor(instructorId);
      } catch (err) {
        setError('Could not fetch course');
      }
    };

    const fetchInstructor = async (instructorId) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/course/getInstructorName/${instructorId}`);
        setInstructor(response.data);
      } catch (err) {
        console.log("Error:", err.response);
        setError('Could not fetch instructor');
      }
    };

    fetchCourse();
  }, [id, token]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/course/enroll/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    }
  };

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  if (!course) return <div className="text-center text-gray-400 mt-10">Loading course details...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h2>
        
        <p className="text-md text-gray-500 mb-2">
          <span className="font-semibold text-gray-700">Instructor:</span> {instructor?.name}
        </p>
        
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Description:</span> {course.description}
        </p>

        <p className="text-green-600 text-lg font-semibold mb-6">
          <span className="text-gray-700">Price:</span> ₹{course.price}
        </p>

        <button
          onClick={handleEnroll}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-sm"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
