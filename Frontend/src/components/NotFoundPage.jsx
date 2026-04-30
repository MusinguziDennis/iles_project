import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFoundPage = () => {
  const { user, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#0f0c29 0%,#1e1b4b 50%,#0f0c29 100%)',
      fontFamily: "'Inter','Segoe UI',sans-serif", padding: '20px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '120px', lineHeight: 1, marginBottom: '24px' }}>🔍</div>
        <h1 style={{ fontSize: '80px', fontWeight: '900', color: 'white', margin: '0 0 8px', letterSpacing: '-3px' }}>404</h1>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'rgba(255,255,255,0.8)', margin: '0 0 16px' }}>Page Not Found</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: '1.7', marginBottom: '40px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', padding: '12px 28px', borderRadius: '10px',
            fontWeight: '600', fontSize: '15px', cursor: 'pointer',
          }}>
            ← Go Back
          </button>
          <Link to={user ? getDashboardPath(user.role) : '/'} style={{
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: 'white', padding: '12px 28px', borderRadius: '10px',
            textDecoration: 'none', fontWeight: '700', fontSize: '15px',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
          }}>
            {user ? 'Go to Dashboard' : 'Go Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
