import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/signup`, form);
      if (res.data.token) {
        navigate('/login');
      } else {
        setError('Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          {['name', 'email', 'password'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block mb-1 capitalize">{field}</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          ))}

          <div className="mb-6">
            <label className="block mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
