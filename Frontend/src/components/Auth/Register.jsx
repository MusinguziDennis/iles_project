import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { value: 'student', label: '🎓 Student Intern' },
  { value: 'work_supervisor', label: '🏢 Workplace Supervisor' },
  { value: 'university_supervisor', label: '📚 Academic Supervisor' },
  { value: 'admin', label: '🛡️ Administrator' },
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '', email: '', first_name: '', last_name: '',
    role: 'student', phone_number: '', password: '', confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: 'Passwords do not match.' });
      return;
    }
    if (formData.password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/login', { state: { message: 'Account created! Please log in.' } });
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        setErrors(data);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const inp = (name) => ({
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(''),
    style: {
      width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px',
      outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
      border: errors[name] ? '2px solid #ef4444' : focusedField === name ? '2px solid #6366f1' : '2px solid #e2e8f0',
      boxShadow: focusedField === name ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
      transition: 'all 0.2s',
    },
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0f0c29 100%)',
      padding: '20px', fontFamily: "'Inter','Segoe UI',sans-serif",
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '520px',
        padding: '40px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
          }}>📘</div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>Create Account</h1>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>Join ILES and manage your internship</p>
        </div>

        {/* General error */}
        {errors.general && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '14px' }}>
            ⚠️ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>First Name *</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" required {...inp('first_name')} />
              {errors.first_name && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.first_name}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Last Name *</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" required {...inp('last_name')} />
              {errors.last_name && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.last_name}</div>}
            </div>
          </div>

          {/* Username */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Username *</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe" required {...inp('username')} />
            {errors.username && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.username}</div>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required {...inp('email')} />
            {errors.email && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>}
          </div>

          {/* Role */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Role *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {ROLES.map(r => (
                <div key={r.value}
                  onClick={() => setFormData({ ...formData, role: r.value })}
                  style={{
                    padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                    border: formData.role === r.value ? '2px solid #6366f1' : '2px solid #e2e8f0',
                    background: formData.role === r.value ? '#f0f4ff' : 'white',
                    color: formData.role === r.value ? '#6366f1' : '#64748b',
                    transition: 'all 0.2s',
                  }}>
                  {r.label}
                </div>
              ))}
            </div>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Phone Number (optional)</label>
            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="+256 700 000000" {...inp('phone_number')} />
          </div>

          {/* Passwords */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required {...inp('password')} />
              {errors.password && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.password}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Confirm Password *</label>
              <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="••••••••" required {...inp('confirm_password')} />
              {errors.confirm_password && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.confirm_password}</div>}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white',
            fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
          }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
