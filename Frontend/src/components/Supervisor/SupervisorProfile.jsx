import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const SupervisorProfile = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [pwData, setPwData] = useState({ old_password: '', new_password: '', confirm_password: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/users/me/', formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwData.new_password !== pwData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/users/change-password/', { old_password: pwData.old_password, new_password: pwData.new_password });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPwData({ old_password: '', new_password: '', confirm_password: '' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to change password. Check your current password.' });
    } finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const label = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' };

  return (
    <div style={{ maxWidth: '700px' }}>
      <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>My Profile</h2>

      {message.text && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px',
          background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: message.type === 'success' ? '#16a34a' : '#dc2626',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
        }}>
          {message.type === 'success' ? '✅' : '⚠️'} {message.text}
        </div>
      )}

      {/* Profile card */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: '800', color: 'white', flexShrink: 0,
          }}>
            {(user?.first_name || user?.username || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
              {user?.first_name} {user?.last_name}
            </div>
            <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: '600', marginTop: '2px' }}>
              {user?.role === 'work_supervisor' ? '🏢 Workplace Supervisor' : '📚 Academic Supervisor'}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>{user?.email}</div>
          </div>
          <button onClick={() => setEditing(!editing)} style={{
            marginLeft: 'auto', background: editing ? '#f1f5f9' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: editing ? '#64748b' : 'white', border: 'none', padding: '9px 20px',
            borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
          }}>
            {editing ? 'Cancel' : '✏️ Edit Profile'}
          </button>
        </div>

        {!editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'First Name', value: user?.first_name },
              { label: 'Last Name', value: user?.last_name },
              { label: 'Email', value: user?.email },
              { label: 'Phone', value: user?.phone_number || 'Not set' },
              { label: 'Username', value: user?.username },
              { label: 'Role', value: user?.role?.replace('_', ' ') },
            ].map(f => (
              <div key={f.label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 16px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{f.label}</div>
                <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600', marginTop: '4px' }}>{f.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={label}>First Name</label><input style={inp} value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} /></div>
              <div><label style={label}>Last Name</label><input style={inp} value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} /></div>
              <div><label style={label}>Email</label><input type="email" style={inp} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
              <div><label style={label}>Phone Number</label><input style={inp} value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} /></div>
            </div>
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      {/* Change password */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>🔒 Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div><label style={label}>Current Password</label><input type="password" style={inp} value={pwData.old_password} onChange={e => setPwData({ ...pwData, old_password: e.target.value })} required /></div>
            <div><label style={label}>New Password</label><input type="password" style={inp} value={pwData.new_password} onChange={e => setPwData({ ...pwData, new_password: e.target.value })} required /></div>
            <div><label style={label}>Confirm New Password</label><input type="password" style={inp} value={pwData.confirm_password} onChange={e => setPwData({ ...pwData, confirm_password: e.target.value })} required /></div>
          </div>
          <button type="submit" disabled={loading} style={{ background: '#0f172a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupervisorProfile;
