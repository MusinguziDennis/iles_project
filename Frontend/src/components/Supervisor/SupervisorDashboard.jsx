import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchSupervisorStats, fetchSupervisorLogs, fetchAssignedStudents, fetchLogDetail } from '../../services/supervisorApi';
import LogList from './LogList';
import ReviewForm from './ReviewForm';
import StudentCard from './StudentCard';

const StatCard = ({ icon, value, label, color }) => (
  <div style={{
    background: 'white', borderRadius: '16px', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
    display: 'flex', alignItems: 'center', gap: '16px',
  }}>
    <div style={{
      width: '52px', height: '52px', borderRadius: '14px',
      background: `${color}15`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '24px', flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: '30px', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>{value ?? '—'}</div>
      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>{label}</div>
    </div>
  </div>
);

const SupervisorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('students');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, logsRes, studentsRes] = await Promise.all([
        fetchSupervisorStats(),
        fetchSupervisorLogs(),
        fetchAssignedStudents(),
      ]);
      setStats(statsRes.data);
      setLogs(logsRes.data);
      setStudents(studentsRes.data);
    } catch (e) {
      setError('Failed to load dashboard. Make sure you are logged in as a supervisor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleReviewUpdated = async () => {
    if (selectedLog) {
      try {
        const res = await fetchLogDetail(selectedLog.id);
        setSelectedLog(res.data);
      } catch (_) {}
    }
    loadData();
  };

  // When clicking View Logs from a student card, filter logs for that student
  const handleViewStudentLogs = (student) => {
    setActiveTab('logs');
  };

  const pendingLogs = logs.filter(l => l.status === 'submitted');
  const reviewedLogs = logs.filter(l => l.status === 'reviewed');
  const displayedLogs = activeTab === 'pending' ? pendingLogs : reviewedLogs;

  const tabs = [
    { key: 'students', label: `👥 My Students (${students.length})` },
    { key: 'pending', label: `⏳ Pending (${pendingLogs.length})` },
    { key: 'logs', label: `👁️ Reviewed (${reviewedLogs.length})` },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0f0c29 100%)',
      fontFamily: "'Inter','Segoe UI',sans-serif", padding: '24px',
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '28px 32px', marginBottom: '28px',
          backdropFilter: 'blur(12px)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <div style={{ fontSize: '13px', color: '#818cf8', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Supervisor Portal
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: 'white' }}>
              Welcome back, {user?.first_name || user?.username} 👋
            </h1>
            <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
              Review and approve your students' weekly internship logs.
            </p>
          </div>
          <div style={{
            background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '12px', padding: '10px 20px', color: '#a5b4fc', fontSize: '13px', fontWeight: '600',
          }}>
            🎓 {user?.role === 'work_supervisor' ? 'Workplace Supervisor' : 'Academic Supervisor'}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', color: '#dc2626', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '60px', fontSize: '16px' }}>
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              <StatCard icon="👥" value={stats?.total_students} label="Assigned Students" color="#6366f1" />
              <StatCard icon="⏳" value={stats?.pending_review} label="Pending Review" color="#f59e0b" />
              <StatCard icon="👁️" value={stats?.reviewed} label="Reviewed" color="#3b82f6" />
              <StatCard icon="✅" value={stats?.approved} label="Approved" color="#22c55e" />
            </div>

            {/* Tabs */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#f8fafc', borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
                {tabs.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                    padding: '9px 20px', borderRadius: '9px', border: 'none',
                    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                    background: activeTab === tab.key ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                    color: activeTab === tab.key ? 'white' : '#64748b',
                    transition: 'all 0.2s',
                  }}>{tab.label}</button>
                ))}
              </div>

              {/* Students grid */}
              {activeTab === 'students' && (
                students.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                    <p style={{ fontSize: '16px', fontWeight: '600' }}>No students assigned yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {students.map(s => <StudentCard key={s.id} student={s} onViewLogs={handleViewStudentLogs} />)}
                  </div>
                )
              )}

              {/* Pending logs */}
              {activeTab === 'pending' && <LogList logs={pendingLogs} onSelectLog={setSelectedLog} />}

              {/* Reviewed logs */}
              {activeTab === 'logs' && <LogList logs={reviewedLogs} onSelectLog={setSelectedLog} />}
            </div>
          </>
        )}
      </div>

      {/* Review Modal */}
      {selectedLog && (
        <ReviewForm
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          onUpdated={handleReviewUpdated}
        />
      )}
    </div>
  );
};

export default SupervisorDashboard;
