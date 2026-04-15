import React, { useState, useEffect } from 'react';

const UserFormModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'student',
    is_active: true,
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Editing existing user
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'student',
        is_active: user.is_active !== undefined ? user.is_active : true,
        password: '',
        confirm_password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error for this field
    if (errors[name]) delete errors[name];
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!user && !formData.password) newErrors.password = 'Password is required for new user';
    if (!user && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    if (formData.password && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Prepare data – remove confirm_password
      const { confirm_password, ...submitData } = formData;
      if (!user && !submitData.password) delete submitData.password;
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(submitData);
      onClose();
    } catch (err) {
      setErrors({ form: 'Failed to save user. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '20px',
      width: '90%',
      maxWidth: '550px',
      maxHeight: '90vh',
      overflow: 'auto',
      padding: '30px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      color: '#333',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white',
    },
    checkbox: {
      marginRight: '8px',
    },
    error: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '4px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
      marginTop: '20px',
    },
    saveBtn: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    cancelBtn: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{user ? 'Edit User' : 'Add New User'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
        {errors.form && <div style={styles.error}>{errors.form}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username *</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} style={styles.input} />
            {errors.username && <div style={styles.error}>{errors.username}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} />
            {errors.email && <div style={styles.error}>{errors.email}</div>}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>First Name *</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} style={styles.input} />
              {errors.first_name && <div style={styles.error}>{errors.first_name}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Last Name *</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} style={styles.input} />
              {errors.last_name && <div style={styles.error}>{errors.last_name}</div>}
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Role *</label>
            <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
              <option value="student">Student</option>
              <option value="workplace_supervisor">Workplace Supervisor</option>
              <option value="academic_supervisor">Academic Supervisor</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} style={styles.checkbox} />
              Active Account
            </label>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>{user ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} style={styles.input} />
            {errors.confirm_password && <div style={styles.error}>{errors.confirm_password}</div>}
          </div>
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={styles.saveBtn}>{loading ? 'Saving...' : 'Save User'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
