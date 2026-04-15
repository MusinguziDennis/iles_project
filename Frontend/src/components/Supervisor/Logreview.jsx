import React, { useState } from 'react';

const LogReviewModal = ({ log, studentName, onClose, onSave }) => {
  const [feedback, setFeedback] = useState(log.feedback || '');
  const [status, setStatus] = useState(log.status);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Simulate saving
    setTimeout(() => {
      const updatedLog = { ...log, feedback, status, feedback_from: 'Workplace Supervisor' };
      onSave(updatedLog);
      setLoading(false);
    }, 500);
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
    },
    logContent: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '10px',
      marginBottom: '20px',
    },
    label: {
      fontWeight: 'bold',
      display: 'block',
      marginBottom: '8px',
      color: '#555',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px',
      marginBottom: '20px',
      fontFamily: 'inherit',
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '16px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
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
          <h2 style={styles.title}>Review Log - Week {log.week_number}</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
        <div style={styles.logContent}>
          <strong>Student:</strong> {studentName}<br />
          <strong>Title:</strong> {log.title}<br />
          <strong>Content:</strong><br />
          {log.content}
        </div>

        <label style={styles.label}>Feedback / Comments</label>
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Provide feedback to the student..."
          style={styles.textarea}
        />

        <label style={styles.label}>Update Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)} style={styles.select}>
          <option value="submitted">Submitted (Pending)</option>
          <option value="reviewed">Reviewed</option>
          <option value="approved">Approved</option>
          <option value="draft">Request Changes (back to draft)</option>
        </select>

        <div style={styles.buttonGroup}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={styles.saveBtn}>
            {loading ? 'Saving...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogReviewModal;
