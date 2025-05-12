// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
  token: localStorage.getItem('authToken'),
  user: JSON.parse(localStorage.getItem('authUser')),
  isAuthenticated: !!localStorage.getItem('authToken'),
});

const login = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));
  setAuth({ token, user, isAuthenticated: true });
};

const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  setAuth({ token: null, user: null, isAuthenticated: false });
};

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Export hook as named constant to avoid HMR issues
const useAuth = () => useContext(AuthContext);
export { useAuth };
