import React from 'react';

const UserList = ({ users, onAdd, onEdit, onDelete }) => {
  const getRoleBadge = (role) => {
    const base = { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    switch (role) {
      case 'student': return { ...base, backgroundColor: '#d4edda', color: '#155724' };
      case 'workplace_supervisor': return { ...base, backgroundColor: '#cfe2ff', color: '#084298' };
      case 'academic_supervisor': return { ...base, backgroundColor: '#fff3cd', color: '#856404' };
      case 'administrator': return { ...base, backgroundColor: '#f8d7da', color: '#721c24' };
      default: return base;
    }
  };

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

  if (users.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No users found. Click "Add User" to create one.</p>
        <button onClick={onAdd} style={styles.addBtn}>+ Add User</button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h2>User Management</h2>
        <button onClick={onAdd} style={styles.addBtn}>+ Add New User</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={styles.td}>{user.username}</td>
              <td style={styles.td}>{user.first_name} {user.last_name}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}><span style={getRoleBadge(user.role)}>{user.role.replace('_', ' ')}</span></td>
              <td style={styles.td}>{user.is_active ? '✅ Active' : '❌ Inactive'}</td>
              <td style={styles.td}>
                <button onClick={() => onEdit(user)} style={{ ...styles.actionBtn, ...styles.editBtn }}>✏️ Edit</button>
                <button onClick={() => onDelete(user.id)} style={{ ...styles.actionBtn, ...styles.deleteBtn }}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
