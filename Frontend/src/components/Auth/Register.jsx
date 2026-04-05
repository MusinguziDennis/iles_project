import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Add registration API call here
      console.log('Registering:', formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
      padding: '20px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      width: '100%',
      maxWidth: '500px',
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
    select: {
      width: '100%',
      padding: '12px 15px',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    row: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
    },
    half: {
      flex: 1,
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
  };

  const [focusedField, setFocusedField] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>📝</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join ILES to track your internship journey</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.half}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                onFocus={() => setFocusedField('first_name')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...styles.input,
                  ...(focusedField === 'first_name' ? styles.inputFocus : {}),
                }}
              />
            </div>
            <div style={styles.half}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                onFocus={() => setFocusedField('last_name')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...styles.input,
                  ...(focusedField === 'last_name' ? styles.inputFocus : {}),
                }}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username *</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField('')}
              style={{
                ...styles.input,
                ...(focusedField === 'username' ? styles.inputFocus : {}),
              }}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              style={{
                ...styles.input,
                ...(focusedField === 'email' ? styles.inputFocus : {}),
              }}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="student">Student Intern</option>
              <option value="workplace_supervisor">Workplace Supervisor</option>
              <option value="academic_supervisor">Academic Supervisor</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>

          <div style={styles.row}>
            <div style={styles.half}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...styles.input,
                  ...(focusedField === 'password' ? styles.inputFocus : {}),
                }}
                required
              />
            </div>
            <div style={styles.half}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                type="password"
                name="confirm_password"
                placeholder="••••••••"
                value={formData.confirm_password}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirm_password')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...styles.input,
                  ...(focusedField === 'confirm_password' ? styles.inputFocus : {}),
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              ...styles.button,
              ...(isHovered ? styles.buttonHover : {}),
              ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;