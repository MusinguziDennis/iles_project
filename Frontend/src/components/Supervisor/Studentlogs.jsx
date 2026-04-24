import React, { useState } from 'react';
import LogReviewModal from './Logreview';

const StudentLogs = ({ student, onBack, onUpdateLog }) => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleReviewClick = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const handleSaveReview = (updatedLog) => {
    onUpdateLog(updatedLog);
    setShowModal(false);
    setSelectedLog(null);
  };

  const getStatusStyle = (status) => {
    const base = { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    switch (status) {
      case 'draft': return { ...base, backgroundColor: '#e0e0e0', color: '#666' };
      case 'submitted': return { ...base, backgroundColor: '#fff3cd', color: '#856404' };
      case 'reviewed': return { ...base, backgroundColor: '#cfe2ff', color: '#084298' };
      case 'approved': return { ...base, backgroundColor: '#d4edda', color: '#155724' };
      default: return base;
    }
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    backBtn: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    title: {
      fontSize: '24px',
      color: '#333',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #e0e0e0',
      color: '#555',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
    },
    reviewBtn: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
    },
    empty: {
      textAlign: 'center',
      padding: '40px',
      color: '#999',
    },
  };

  const pendingLogs = student.logs.filter(log => log.status === 'submitted' || log.status === 'reviewed');

  return (
    <div>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>← Back to Students</button>
        <h2 style={styles.title}>{student.name}'s Weekly Logs</h2>
        <div></div>
      </div>

      {pendingLogs.length === 0 ? (
        <div style={styles.empty}>No logs pending review. All caught up! 🎉</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Week</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Submitted</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingLogs.map(log => (
              <tr key={log.id}>
                <td style={styles.td}>Week {log.week_number}</td>
                <td style={styles.td}>{log.title}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(log.status)}>{log.status}</span>
                </td>
                <td style={styles.td}>{log.submitted_at || '—'}</td>
                <td style={styles.td}>
                  <button onClick={() => handleReviewClick(log)} style={styles.reviewBtn}>
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && selectedLog && (
        <LogReviewModal
          log={selectedLog}
          studentName={student.name}
          onClose={() => setShowModal(false)}
          onSave={handleSaveReview}
        />
      )}
    </div>
  );
};

export default StudentLogs;
