import React from 'react';

const StudentList = ({ students, onSelectStudent }) => {
  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '20px',
    },
    card: {
      backgroundColor: '#f8f9fa',
      borderRadius: '15px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    },
    studentName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '8px',
    },
    regNo: {
      color: '#666',
      fontSize: '14px',
      marginBottom: '5px',
    },
    company: {
      color: '#667eea',
      fontSize: '14px',
      marginBottom: '10px',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    pendingBadge: {
      backgroundColor: '#fff3cd',
      color: '#856404',
    },
    reviewedBadge: {
      backgroundColor: '#cfe2ff',
      color: '#084298',
    },
    empty: {
      textAlign: 'center',
      padding: '40px',
      color: '#999',
    },
  };

  const getPendingCount = (student) => {
    return student.logs.filter(log => log.status === 'submitted' || log.status === 'reviewed').length;
  };

  if (students.length === 0) {
    return <div style={styles.empty}>No students assigned to you yet.</div>;
  }

  const [hoveredId, setHoveredId] = React.useState(null);

  return (
    <div style={styles.grid}>
      {students.map(student => {
        const pending = getPendingCount(student);
        return (
          <div
            key={student.id}
            style={{
              ...styles.card,
              ...(hoveredId === student.id ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHoveredId(student.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectStudent(student)}
          >
            <div style={styles.studentName}>{student.name}</div>
            <div style={styles.regNo}>📚 {student.reg_no}</div>
            <div style={styles.company}>🏢 {student.company}</div>
            <div>
              {pending > 0 ? (
                <span style={{ ...styles.badge, ...styles.pendingBadge }}>
                  ⏳ {pending} pending review
                </span>
              ) : (
                <span style={{ ...styles.badge, ...styles.reviewedBadge }}>
                  ✅ All reviewed
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentList;
