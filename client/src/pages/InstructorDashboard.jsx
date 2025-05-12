import React from 'react';
import { useAuth } from '../context/AuthContext';

const InstructorDashboard = () => {
  const { user } = useAuth();

  const createdCourses = [
    { id: 1, title: 'Advanced JavaScript', students: 120 },
    { id: 2, title: 'MongoDB Deep Dive', students: 75 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">Instructor Dashboard</h1>

      <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-semibold mb-2 text-purple-300">Account Info</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> Instructor</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Your Courses</h2>
        {createdCourses.map(course => (
          <div key={course.id} className="mb-3 border-b border-gray-700 pb-2">
            <p className="text-lg">{course.title}</p>
            <p className="text-sm text-gray-400">Enrolled Students: {course.students}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorDashboard;
