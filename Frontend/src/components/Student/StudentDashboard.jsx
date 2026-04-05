import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PlacementDetails from './PlacementDetails';
import WeeklyLogList from './WeeklyLogList';
import WeeklyLogForm from './WeeklyLogForm';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [placement, setPlacement] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [activeTab, setActiveTab] = useState('logs');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      setPlacement({
        company_name: 'NexaNovel Tech Uganda',
        company_logo: '🏢',
        workplace_supervisor: 'Mr. Amos Mirembe',
        workplace_supervisor_email: 'amosm256@tech.com',
        academic_supervisor: 'Dr. Peter Wakholi',
        academic_supervisor_email: 'peterw256@mak.ac.ug',
        start_date: '2026-06-01',
        end_date: '2026-08-01',
        status: 'Active'
      });

      setLogs([
        { id: 1, week_number: 1, title: 'First Week Orientation', content: 'Learned about company policies...', status: 'approved', submitted_at: '2026-01-20', feedback: 'Great work!', feedback_from: 'Workplace Supervisor' },
        { id: 2, week_number: 2, title: 'Project Planning', content: 'Started working on the mobile app project...', status: 'reviewed', submitted_at: '2026-01-27', feedback: 'Good progress, add more details next time', feedback_from: 'Academic Supervisor' },
        { id: 3, week_number: 3, title: 'Development Phase', content: 'Working on frontend components...', status: 'submitted', submitted_at: '2026-02-03', feedback: null },
        { id: 4, week_number: 4, title: 'Testing and Debugging', content: 'Writing unit tests...', status: 'draft', submitted_at: null, feedback: null },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLog = () => {
    setEditingLog(null);
    setShowForm(true);
  };

  const handleEditLog = (log) => {
    if (log.status !== 'draft') {
      alert('You can only edit draft logs.');
      return;
    }
    setEditingLog(log);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLog(null);
  };

  const handleFormSuccess = () => {
    fetchData();
    handleFormClose();
  };

  const handleSubmitLog = async (logId) => {
    if (window.confirm('Submit this log for review? You cannot edit it afterwards.')) {
      // Add API call here
      alert('Log submitted successfully!');
      fetchData();
    }
  };

  const getProgressStats = () => {
    const total = logs.length;
    const submitted = logs.filter(l => l.status === 'submitted').length;
    const reviewed = logs.filter(l => l.status === 'reviewed').length;
    const approved = logs.filter(l => l.status === 'approved').length;
    const draft = logs.filter(l => l.status === 'draft').length;
    return { total, submitted, reviewed, approved, draft };
  };

  const stats = getProgressStats();

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
    header: {
      marginBottom: '30px',
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s',
    },
    statValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#667eea',
    },
    statLabel: {
      color: '#666',
      marginTop: '5px',
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
    buttonPrimary: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.3s',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '24px',
      color: 'white',
    },
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Loading your dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Welcome Header */}
        <div style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>Welcome back, {user?.username || 'Student'}! 👋</h1>
          <p style={styles.welcomeSubtitle}>Track your internship progress, submit weekly logs, and receive feedback.</p>
        </div>

        {/* Statistics */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Total Logs</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.draft}</div>
            <div style={styles.statLabel}>In Draft</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.submitted + stats.reviewed}</div>
            <div style={styles.statLabel}>Pending Review</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.approved}</div>
            <div style={styles.statLabel}>Approved</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('logs')}
            style={{
              ...styles.tab,
              ...(activeTab === 'logs' ? styles.activeTab : styles.inactiveTab),
            }}
          >
            📝 Weekly Logs
          </button>
          <button
            onClick={() => setActiveTab('placement')}
            style={{
              ...styles.tab,
              ...(activeTab === 'placement' ? styles.activeTab : styles.inactiveTab),
            }}
          >
            🏢 Placement Details
          </button>
        </div>

        {/* Content */}
        <div style={styles.contentCard}>
          {activeTab === 'logs' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#333' }}>My Weekly Logs</h2>
                <button onClick={handleCreateLog} style={styles.buttonPrimary}>
                  + New Weekly Log
                </button>
              </div>
              <WeeklyLogList 
                logs={logs} 
                onEdit={handleEditLog} 
                onSubmit={handleSubmitLog} 
              />
            </>
          )}

          {activeTab === 'placement' && (
            <PlacementDetails placement={placement} />
          )}
        </div>
      </div>

      {/* Weekly Log Form Modal */}
      {showForm && (
        <WeeklyLogForm
          log={editingLog}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default StudentDashboard;