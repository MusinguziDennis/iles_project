import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/users/forgot-password/', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#0f0c29 0%,#1e1b4b 50%,#0f0c29 100%)',
      fontFamily: "'Inter','Segoe UI',sans-serif", padding: '20px',
    }}>
      <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '440px', padding: '40px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🔑</div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Forgot Password?</h1>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>Enter your email and we'll send you a new password.</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <h3 style={{ color: '#16a34a', margin: '0 0 8px' }}>Email Sent!</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Check your inbox for your new login credentials.</p>
            <Link to="/login" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '14px' }}>
                ⚠️ {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white',
                fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#6366f1', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
