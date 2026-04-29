import React, { useState } from 'react';

const WeeklyLogForm = ({ log, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    week_number: log?.week_number || '',
    title: log?.title || '',
    content: log?.content || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.week_number || !formData.content) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      onSuccess(formData);
    } catch (err) {
      setError('Failed to save log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    modalOverlay: {
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
      maxWidth: '600px',
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
      color: '#999',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '16px',
      minHeight: '150px',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
      marginTop: '20px',
    },
    buttonSubmit: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    buttonCancel: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    error: {
      backgroundColor: '#fee',
      color: '#e74c3c',
      padding: '10px',
      borderRadius: '8px',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{log ? 'Edit Weekly Log' : 'Create New Weekly Log'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Week Number</label>
            <input
              type="number"
              name="week_number"
              value={formData.week_number}
              onChange={handleChange}
              placeholder="e.g., 1, 2, 3..."
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Log Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What did you work on this week?"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Weekly Report Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Describe your activities, achievements, challenges, and lessons learned this week..."
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.buttonCancel}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.buttonSubmit}>
              {loading ? 'Saving...' : (log ? 'Update Log' : 'Create Log')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeeklyLogForm;