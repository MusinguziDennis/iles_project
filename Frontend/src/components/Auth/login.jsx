import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getDashboardPath } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const successMessage = location.state?.message || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(username, password);
      navigate(getDashboardPath(userData.role));
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      width: '100%',
      maxWidth: '450px',
      padding: '40px',
      animation: 'fadeIn 0.5s ease-in-out',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    logo: {
      fontSize: '48px',
      marginBottom: '10px',
    },
    title: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '8px',
      fontWeight: 'bold',
    },
    subtitle: {
      color: '#666',
      fontSize: '14px',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#555',
      fontWeight: '500',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box',
    },
    inputFocus: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
    button: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      marginTop: '10px',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
    },
    footer: {
      textAlign: 'center',
      marginTop: '25px',
      color: '#666',
      fontSize: '14px',
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: 'bold',
      marginLeft: '5px',
    },
    error: {
      backgroundColor: '#fee',
      color: '#e74c3c',
      padding: '10px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
      fontSize: '14px',
    },
    forgotPassword: {
      textAlign: 'right',
      marginTop: '5px',
    },
    forgotLink: {
      color: '#999',
      textDecoration: 'none',
      fontSize: '12px',
    },
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>📘</div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Login to access your internship logbook</p>
        </div>

        {successMessage && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', color: '#16a34a' }}>
            ✅ {successMessage}
          </div>
        )}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username or Email</label>
            <input
              type="text"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
              style={{
                ...styles.input,
                ...(isUsernameFocused ? styles.inputFocus : {}),
              }}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              style={{
                ...styles.input,
                ...(isPasswordFocused ? styles.inputFocus : {}),
              }}
              required
            />
            <div style={styles.forgotPassword}>
              <Link to="/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isHovered ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          disabled={loading}
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?
          <Link to="/register" style={styles.link}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;