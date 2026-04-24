import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#0f0c29,#1e1b4b)',
        color: 'white', fontSize: '18px', fontFamily: 'Inter,sans-serif',
      }}>
        Loading...
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role → go back to their correct dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const redirects = {
      student: '/student/dashboard',
      work_supervisor: '/supervisor/dashboard',
      university_supervisor: '/supervisor/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={redirects[user.role] || '/'} replace />;
  }

  return children;
};

export default PrivateRoute;
