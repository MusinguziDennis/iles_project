import React from 'react';

const StatsCards = ({ users, placements }) => {
  const students = users.filter(u => u.role === 'student').length;
  const supervisors = users.filter(u => u.role === 'workplace_supervisor' || u.role === 'academic_supervisor').length;
  const admins = users.filter(u => u.role === 'administrator').length;

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
    value: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#667eea',
    },
    label: {
      color: '#666',
      marginTop: '5px',
    },
  };

  return (
    <div style={styles.grid}>
      <div style={styles.card}>
        <div style={styles.value}>{users.length}</div>
        <div style={styles.label}>Total Users</div>
      </div>
      <div style={styles.card}>
        <div style={styles.value}>{students}</div>
        <div style={styles.label}>Students</div>
      </div>
      <div style={styles.card}>
        <div style={styles.value}>{supervisors}</div>
        <div style={styles.label}>Supervisors</div>
      </div>
      <div style={styles.card}>
        <div style={styles.value}>{placements.length}</div>
        <div style={styles.label}>Active Placements</div>
      </div>
    </div>
  );
};

export default StatsCards;
