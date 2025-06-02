  import { ToastContainer, toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import EnrolledCourses from './EnrolledCourses';


const StudentDashboard = () => {
    const { id } = useParams();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);

  return (
    
    <div className="min-h-screen bg-gray-900 text-white p-6">
            <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Student Dashboard</h1>

      <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-semibold mb-2 text-blue-300">Account Info</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> Student</p>
      </div>
    <EnrolledCourses/>
     
    </div>
  );
};

export default StudentDashboard;
