import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // import useNavigate

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate(); // initialize navigate

  const handleLogout = () => {
    logout();             // clear auth token and state
    navigate('/login');   // redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Dashboard</h1>
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
