import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-500">
          SkillHub
        </Link>

        {/* Nav links */}
        <div className="space-x-6">
        {<Link to="/" className="hover:text-blue-400">Home</Link>}
        <Link to="/about" className="hover:text-blue-400">About</Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-blue-400">Login</Link>
              <Link to="/signup" className="hover:text-blue-400">Signup</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-blue-400">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* User Info */}
        {isAuthenticated && user && (
          <div className="text-sm text-gray-400">
            {user.email} | <span className="capitalize">{user.role}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
