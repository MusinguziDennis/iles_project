import React from 'react';

const WeeklyLogList = ({ logs, onEdit, onSubmit }) => {
  const getStatusStyle = (status) => {
    const base = { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    switch (status) {
      case 'draft':
        return { ...base, backgroundColor: '#e0e0e0', color: '#666' };
      case 'submitted':
        return { ...base, backgroundColor: '#fff3cd', color: '#856404' };
      case 'reviewed':
        return { ...base, backgroundColor: '#cfe2ff', color: '#084298' };
      case 'approved':
        return { ...base, backgroundColor: '#d4edda', color: '#155724' };
      default:
        return base;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'submitted': return 'Submitted';
      case 'reviewed': return 'Reviewed';
      case 'approved': return 'Approved ✓';
      default: return status;
    }
  };

  const styles = {
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
      fontWeight: 'bold',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
    },
    logTitle: {
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '5px',
    },
    logContent: {
      color: '#666',
      fontSize: '14px',
    },
    buttonEdit: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      marginRight: '8px',
      fontSize: '12px',
    },
    buttonSubmit: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
    },
    feedbackText: {
      fontSize: '12px',
      color: '#667eea',
      marginTop: '8px',
      padding: '8px',
      backgroundColor: '#f0f4ff',
      borderRadius: '8px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#999',
    },
  };

  if (logs.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>📝 No logs yet. Create your first weekly log!</p>
      </div>
    );
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Week</th>
          <th style={styles.th}>Title & Content</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td style={styles.td}>
              <strong>Week {log.week_number}</strong>
              {log.submitted_at && (
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                  {log.submitted_at}
                </div>
              )}
            </td>
            <td style={styles.td}>
              <div style={styles.logTitle}>{log.title}</div>
              <div style={styles.logContent}>{log.content.substring(0, 100)}...</div>
              {log.feedback && (
                <div style={styles.feedbackText}>
                  💬 <strong>{log.feedback_from}:</strong> {log.feedback}
                </div>
              )}
            </td>
            <td style={styles.td}>
              <span style={getStatusStyle(log.status)}>
                {getStatusText(log.status)}
              </span>
            </td>
            <td style={styles.td}>
              {log.status === 'draft' && (
                <>
                  <button onClick={() => onEdit(log)} style={styles.buttonEdit}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => onSubmit(log.id)} style={styles.buttonSubmit}>
                    📤 Submit
                  </button>
                </>
              )}
              {log.status === 'submitted' && (
                <span style={{ color: '#856404', fontSize: '12px' }}>⏳ Awaiting review</span>
              )}
              {log.status === 'reviewed' && (
                <span style={{ color: '#084298', fontSize: '12px' }}>👀 Reviewed by supervisor</span>
              )}
              {log.status === 'approved' && (
                <span style={{ color: '#155724', fontSize: '12px' }}>✅ Approved</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WeeklyLogList;