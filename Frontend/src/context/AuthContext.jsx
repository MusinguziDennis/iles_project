import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const BASE = 'http://localhost:8000/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await axios.post(`${BASE}/token/`, { username, password });
    const { access, refresh } = res.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    const profileRes = await axios.get(`${BASE}/users/me/`, {
      headers: { Authorization: `Bearer ${access}` },
    });
    const userData = profileRes.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await axios.post(`${BASE}/users/register/`, formData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Refresh access token using refresh token
  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) { logout(); return null; }
    try {
      const res = await axios.post(`${BASE}/token/refresh/`, { refresh });
      localStorage.setItem('access_token', res.data.access);
      return res.data.access;
    } catch {
      logout();
      return null;
    }
  };

  // Helper: get the correct dashboard path for a role
  const getDashboardPath = (role) => {
    switch (role) {
      case 'work_supervisor':
      case 'university_supervisor': return '/supervisor/dashboard';
      case 'student': return '/student/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, getDashboardPath, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
