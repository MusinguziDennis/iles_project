import React from 'react';

const PlacementList = ({ placements, onAdd, onEdit, onDelete }) => {
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    addBtn: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
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
    actionBtn: {
      padding: '4px 8px',
      marginRight: '8px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
    },
    editBtn: {
      backgroundColor: '#ffc107',
      color: '#333',
    },
    deleteBtn: {
      backgroundColor: '#dc3545',
      color: 'white',
    },
    empty: {
      textAlign: 'center',
      padding: '40px',
      color: '#999',
    },
  };

  if (placements.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No placements found. Click "Add Placement" to create one.</p>
        <button onClick={onAdd} style={styles.addBtn}>+ Add Placement</button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h2>Placement Management</h2>
        <button onClick={onAdd} style={styles.addBtn}>+ Add Placement</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Student</th>
            <th style={styles.th}>Company</th>
            <th style={styles.th}>Workplace Supervisor</th>
            <th style={styles.th}>Academic Supervisor</th>
            <th style={styles.th}>Period</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {placements.map(placement => (
            <tr key={placement.id}>
              <td style={styles.td}>{placement.student.name}</td>
              <td style={styles.td}>{placement.company_name}</td>
              <td style={styles.td}>{placement.workplace_supervisor?.name || 'Not assigned'}</td>
              <td style={styles.td}>{placement.academic_supervisor?.name || 'Not assigned'}</td>
              <td style={styles.td}>{placement.start_date} to {placement.end_date}</td>
              <td style={styles.td}>
                <button onClick={() => onEdit(placement)} style={{ ...styles.actionBtn, ...styles.editBtn }}>✏️ Edit</button>
                <button onClick={() => onDelete(placement.id)} style={{ ...styles.actionBtn, ...styles.deleteBtn }}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlacementList;
