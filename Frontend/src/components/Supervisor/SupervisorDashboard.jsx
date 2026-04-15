import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StudentList from './StudentList';
import StudentLogs from './StudentLogs';

const SupervisorDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    // Mock data – replace with API call later
    setStudents([
      {
        id: 1,
        name: 'Alice Nambi',
        reg_no: '2020/CS/001',
        company: 'Tech Corp Uganda',
        placement_id: 101,
        logs: [
          { id: 101, week_number: 1, title: 'First Week', content: 'Learned about company policies...', status: 'submitted', submitted_at: '2026-04-01' },
          { id: 102, week_number: 2, title: 'Project Work', content: 'Started working on frontend...', status: 'reviewed', submitted_at: '2026-04-08', feedback: 'Good progress, add more details', feedback_from: 'Workplace Supervisor' }
        ]
      },
      {
        id: 2,
        name: 'Brian Mutebi',
        reg_no: '2020/CS/045',
        company: 'Innovate Solutions',
        placement_id: 102,
        logs: [
          { id: 201, week_number: 1, title: 'Orientation', content: 'Met the team...', status: 'submitted', submitted_at: '2026-04-02' },
          { id: 202, week_number: 2, title: 'Development', content: 'Working on API integration...', status: 'draft', submitted_at: null }
        ]
      }
    ]);
    setLoading(false);
  }, []);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setActiveTab('logs');
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setActiveTab('students');
  };

  const handleUpdateLog = (updatedLog) => {
    // Update the log in the selected student's logs
    if (selectedStudent) {
      const updatedLogs = selectedStudent.logs.map(log =>
        log.id === updatedLog.id ? updatedLog : log
      );
      setSelectedStudent({ ...selectedStudent, logs: updatedLogs });
      // Also update in the main students array
      setStudents(students.map(s =>
        s.id === selectedStudent.id ? { ...s, logs: updatedLogs } : s
      ));
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
    },
    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    welcomeCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      padding: '30px',
      color: 'white',
      marginBottom: '30px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    },
    welcomeTitle: {
      fontSize: '28px',
      marginBottom: '10px',
    },
    welcomeSubtitle: {
      fontSize: '16px',
      opacity: 0.9,
    },
    tabsContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '5px',
    },
    tab: {
      flex: 1,
      padding: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      borderRadius: '10px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.3s',
    },
    activeTab: {
      backgroundColor: '#667eea',
      color: 'white',
    },
    inactiveTab: {
      backgroundColor: 'transparent',
      color: '#666',
    },
    contentCard: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading dashboard...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>Welcome, {user?.username || 'Supervisor'} 👋</h1>
          <p style={styles.welcomeSubtitle}>Manage and review internship logs of your assigned students.</p>
        </div>

        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('students')}
            style={{ ...styles.tab, ...(activeTab === 'students' ? styles.activeTab : styles.inactiveTab) }}
          >
            👥 My Students
          </button>
          {selectedStudent && (
            <button
              onClick={() => setActiveTab('logs')}
              style={{ ...styles.tab, ...(activeTab === 'logs' ? styles.activeTab : styles.inactiveTab) }}
            >
              📝 {selectedStudent.name}'s Logs
            </button>
          )}
        </div>

        <div style={styles.contentCard}>
          {activeTab === 'students' && (
            <StudentList students={students} onSelectStudent={handleSelectStudent} />
          )}
          {activeTab === 'logs' && selectedStudent && (
            <StudentLogs
              student={selectedStudent}
              onBack={handleBackToList}
              onUpdateLog={handleUpdateLog}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
