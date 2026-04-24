import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateUser } = useAuth(); // we'll add updateUser to context
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to update profile
      // await api.patch('/users/profile/', formData);
      // updateUser({ ...user, ...formData });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      // await api.post('/users/change-password/', {
      //   old_password: passwordData.old_password,
      //   new_password: passwordData.new_password,
      // });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Poppins', sans-serif",
    },
    card: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '10px',
    },
    subtitle: {
      color: '#666',
      marginBottom: '30px',
      borderBottom: '2px solid #f0f0f0',
      paddingBottom: '15px',
    },
    section: {
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '20px',
      color: '#667eea',
      marginBottom: '20px',
    },
    infoRow: {
      display: 'flex',
      marginBottom: '15px',
      padding: '10px 0',
      borderBottom: '1px solid #f0f0f0',
    },
    label: {
      width: '150px',
      fontWeight: 'bold',
      color: '#555',
    },
    value: {
      flex: 1,
      color: '#333',
    },
    editBtn: {
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      padding: '8px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
    },
    formGroup: {
      marginBottom: '15px',
    },
    button: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginRight: '10px',
    },
    cancelBtn: {
      backgroundColor: '#6c757d',
    },
    message: {
      padding: '10px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
    },
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.subtitle}>Manage your account information</p>

        {message.text && (
          <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
            {message.text}
          </div>
        )}

        {/* Profile Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Personal Information</h2>
          {!isEditing ? (
            <>
              <div style={styles.infoRow}>
                <div style={styles.label}>Username</div>
                <div style={styles.value}>{user.username}</div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.label}>Full Name</div>
                <div style={styles.value}>{user.first_name} {user.last_name}</div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.label}>Email</div>
                <div style={styles.value}>{user.email}</div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.label}>Role</div>
                <div style={styles.value}>{user.role?.replace('_', ' ')}</div>
              </div>
              <button onClick={() => setIsEditing(true)} style={styles.editBtn}>Edit Profile</button>
            </>
          ) : (
            <form onSubmit={handleProfileSubmit}>
              <div style={styles.formGroup}>
                <label>First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleProfileChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label>Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleProfileChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleProfileChange} style={styles.input} />
              </div>
              <button type="submit" disabled={loading} style={styles.button}>Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ ...styles.button, ...styles.cancelBtn }}>Cancel</button>
            </form>
          )}
        </div>

        {/* Change Password */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div style={styles.formGroup}>
              <label>Current Password</label>
              <input type="password" name="old_password" value={passwordData.old_password} onChange={handlePasswordChange} style={styles.input} required />
            </div>
            <div style={styles.formGroup}>
              <label>New Password</label>
              <input type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} style={styles.input} required />
            </div>
            <div style={styles.formGroup}>
              <label>Confirm New Password</label>
              <input type="password" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} style={styles.input} required />
            </div>
            <button type="submit" disabled={loading} style={styles.button}>Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
