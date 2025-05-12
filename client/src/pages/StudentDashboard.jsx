import React from 'react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();

  const enrolledCourses = [
    { id: 1, title: 'React Basics', progress: '80%' },
    { id: 2, title: 'Node.js Mastery', progress: '50%' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Student Dashboard</h1>

      <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-semibold mb-2 text-blue-300">Account Info</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> Student</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">Enrolled Courses</h2>
        {enrolledCourses.map(course => (
          <div key={course.id} className="mb-3 border-b border-gray-700 pb-2">
            <p className="text-lg">{course.title}</p>
            <p className="text-sm text-gray-400">Progress: {course.progress}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
