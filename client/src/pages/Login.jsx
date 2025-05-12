import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import {InstructorDashboard} from '../pages/InstructorDashboard';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/user/login', form);

      if (res.data.token && res.data.user) {
        // Save token + user in context
        login(res.data.token, res.data.user);

        // Navigate based on role
        if (res.data.user.role === 'instructor') {
          console.log("Role :",res.data.user.role);
          navigate('/dashboard');
        } else {
          console.log("Role :",res.data.user.role);

          navigate('/dashboard');
        }
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">SkillHub Login</h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {['email', 'password'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block mb-1 capitalize">{field}</label>
              <input
                type={field === 'password' ? 'password' : 'email'}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
