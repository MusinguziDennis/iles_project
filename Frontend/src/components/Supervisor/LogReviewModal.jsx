// frontend/src/components/Supervisor/LogReviewModal.jsx
import React, { useState } from 'react';
import api from '../../services/api';

const LogReviewModal = ({ log, onClose, onSuccess }) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(''); // 'review', 'approve', 'reject'

  const handleAction = async (selectedAction) => {
    setAction(selectedAction);
    setLoading(true);
    
    try {
      let endpoint = '';
      let payload = {};
      
      switch (selectedAction) {
        case 'review':
          endpoint = `/logs/${log.id}/review/`;
          payload = { feedback };
          break;
        case 'approve':
          endpoint = `/logs/${log.id}/approve/`;
          payload = { feedback };
          break;
        case 'reject':
          endpoint = `/logs/${log.id}/reject/`;
          payload = { feedback, status: 'draft' };
          break;
        default:
          break;
      }
      
      await api.patch(endpoint, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to process log. Please try again.');
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
      borderRadius: '12px',
      padding: '30px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    },
    header: {
      borderBottom: '2px solid #f0f0f0',
      paddingBottom: '15px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      color: '#333',
      margin: 0,
    },
    section: {
      marginBottom: '20px',
    },
    label: {
      fontWeight: 'bold',
      color: '#555',
      display: 'block',
      marginBottom: '8px',
    },
    content: {
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '8px',
      lineHeight: '1.6',
      color: '#333',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
      justifyContent: 'flex-end',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    reviewBtn: {
      backgroundColor: '#17a2b8',
      color: 'white',
    },
    approveBtn: {
      backgroundColor: '#28a745',
      color: 'white',
    },
    rejectBtn: {
      backgroundColor: '#dc3545',
      color: 'white',
    },
    cancelBtn: {
      backgroundColor: '#6c757d',
      color: 'white',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Review Log - Week {log?.week_number}</h2>
        </div>

        <div style={styles.section}>
          <div style={styles.label}>Student Content:</div>
          <div style={styles.content}>{log?.content}</div>
        </div>

        <div style={styles.section}>
          <div style={styles.label}>Feedback (Optional):</div>
          <textarea
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add your comments here..."
            style={styles.textarea}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={() => handleAction('review')}
            disabled={loading && action === 'review'}
            style={{ ...styles.button, ...styles.reviewBtn }}
          >
            {loading && action === 'review' ? 'Processing...' : 'Mark as Reviewed'}
          </button>
          <button
            onClick={() => handleAction('approve')}
            disabled={loading && action === 'approve'}
            style={{ ...styles.button, ...styles.approveBtn }}
          >
            {loading && action === 'approve' ? 'Processing...' : 'Approve'}
          </button>
          <button
            onClick={() => handleAction('reject')}
            disabled={loading && action === 'reject'}
            style={{ ...styles.button, ...styles.rejectBtn }}
          >
            {loading && action === 'reject' ? 'Processing...' : 'Request Changes'}
          </button>
          <button
            onClick={onClose}
            style={{ ...styles.button, ...styles.cancelBtn }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogReviewModal;