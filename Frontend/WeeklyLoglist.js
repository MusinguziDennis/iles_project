// src/components/Student/WeeklyLogList.js
import React from 'react';

const WeeklyLogList = ({ logs, onEdit, onSubmit }) => {
  if (logs.length === 0) {
    return <p>No logs yet. Create your first weekly log!</p>;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Week</th>
          <th>Content</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>{log.week_number}</td>
            <td>{log.content.substring(0, 50)}...</td>
            <td>
              <span style={getStatusStyle(log.status)}>{log.status}</span>
            </td>
            <td>
              {log.status === 'draft' && (
                <>
                  <button onClick={() => onEdit(log)} style={styles.actionBtn}>Edit</button>
                  <button onClick={() => onSubmit(log.id)} style={styles.submitBtn}>Submit</button>
                </>
              )}
              {log.status === 'submitted' && <span>Awaiting review</span>}
              {log.status === 'reviewed' && <span>Reviewed by workplace</span>}
              {log.status === 'approved' && <span>✓ Approved</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const getStatusStyle = (status) => {
  const base = { padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' };
  switch (status) {
    case 'draft': return { ...base, backgroundColor: '#f0f0f0', color: '#666' };
    case 'submitted': return { ...base, backgroundColor: '#fff3cd', color: '#856404' };
    case 'reviewed': return { ...base, backgroundColor: '#cfe2ff', color: '#084298' };
    case 'approved': return { ...base, backgroundColor: '#d1e7dd', color: '#0f5132' };
    default: return base;
  }
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  actionBtn: {
    marginRight: '8px',
    padding: '4px 8px',
    cursor: 'pointer',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  submitBtn: {
    padding: '4px 8px',
    cursor: 'pointer',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default WeeklyLogList;
