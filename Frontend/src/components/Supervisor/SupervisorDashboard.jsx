import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchSupervisorStats, fetchSupervisorLogs,
  fetchAssignedStudents, fetchLogDetail,
} from '../../services/supervisorApi';
import LogList from './LogList';
import ReviewForm from './ReviewForm';
import StudentCard from './StudentCard';
import NotificationsPanel from './NotificationsPanel';
import SupervisorProfile from './SupervisorProfile';

// ── Sidebar nav items ──────────────────────────────────────────────────────────
const NAV = [
  { key: 'overview',  icon: '🏠', label: 'Overview' },
  { key: 'students',  icon: '👥', label: 'My Students' },
  { key: 'pending',   icon: '⏳', label: 'Pending Review' },
  { key: 'reviewed',  icon: '👁️', label: 'Reviewed Logs' },
  { key: 'approved',  icon: '✅', label: 'Approved Logs' },
  { key: 'profile',   icon: '👤', label: 'My Profile' },
];

// ── Stat card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, color, onClick, active }) => (
  <div onClick={onClick} style={{
    background: active ? `linear-gradient(135deg,${color},${color}cc)` : 'white',
    borderRadius: '16px', padding: '20px 24px',
    boxShadow: active ? `0 8px 24px ${color}40` : '0 2px 12px rgba(0,0,0,0.06)',
    border: active ? 'none' : '1px solid #f1f5f9',
    display: 'flex', alignItems: 'center', gap: '16px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.25s',
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: active ? 'rgba(255,255,255,0.2)' : `${color}15`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '22px', flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: '28px', fontWeight: '900', color: active ? 'white' : '#0f172a', lineHeight: 1 }}>{value ?? '—'}</div>
      <div style={{ fontSize: '12px', color: active ? 'rgba(255,255,255,0.8)' : '#64748b', marginTop: '4px', fontWeight: '500' }}>{label}</div>
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const SupervisorDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats]         = useState(null);
  const [logs, setLogs]           = useState([]);
  const [students, setStudents]   = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [activePage, setActivePage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);
  const [showNotifications, setShowNotifications] = useState(false);

  // Responsive: detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [sRes, lRes, stRes] = await Promise.all([
        fetchSupervisorStats(), fetchSupervisorLogs(), fetchAssignedStudents(),
      ]);
      setStats(sRes.data); setLogs(lRes.data); setStudents(stRes.data);
    } catch {
      setError('Failed to load dashboard. Make sure you are logged in as a supervisor.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleReviewUpdated = async () => {
    if (selectedLog) {
      try { const r = await fetchLogDetail(selectedLog.id); setSelectedLog(r.data); } catch {}
    }
    loadData();
  };

  const pendingLogs  = logs.filter(l => l.status === 'submitted');
  const reviewedLogs = logs.filter(l => l.status === 'reviewed');
  const approvedLogs = logs.filter(l => l.status === 'approved');

  const navigate = (page) => {
    setActivePage(page);
    if (isMobile) setSidebarOpen(false);
  };

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99,
        }} />
      )}

      <aside style={{
        position: isMobile ? 'fixed' : 'sticky',
        top: 0, left: 0, height: '100vh',
        width: sidebarOpen ? '260px' : (isMobile ? '0' : '72px'),
        background: 'linear-gradient(180deg,#0f0c29 0%,#1e1b4b 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden', zIndex: 100, flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px', display: 'flex', alignItems: 'center',
          gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          minHeight: '72px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
          }}>📘</div>
          {sidebarOpen && (
            <span style={{ color: 'white', fontWeight: '800', fontSize: '18px', whiteSpace: 'nowrap' }}>ILES</span>
          )}
        </div>

        {/* User info */}
        {sidebarOpen && (
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '10px',
            }}>
              {(user?.first_name || user?.username || 'S').charAt(0).toUpperCase()}
            </div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
            </div>
            <div style={{ color: '#818cf8', fontSize: '12px', marginTop: '2px' }}>
              {user?.role === 'work_supervisor' ? 'Workplace Supervisor' : 'Academic Supervisor'}
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV.map(item => {
            const count = item.key === 'students' ? students.length
              : item.key === 'pending' ? pendingLogs.length
              : item.key === 'reviewed' ? reviewedLogs.length
              : item.key === 'approved' ? approvedLogs.length : null;
            const isActive = activePage === item.key;
            return (
              <div key={item.key} onClick={() => navigate(item.key)} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: sidebarOpen ? '11px 14px' : '11px 18px',
                borderRadius: '10px', cursor: 'pointer', marginBottom: '4px',
                background: isActive ? 'rgba(99,102,241,0.25)' : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                transition: 'all 0.2s',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span style={{ color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: isActive ? '700' : '500', flex: 1, whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                    {count !== null && (
                      <span style={{
                        background: isActive ? '#6366f1' : 'rgba(255,255,255,0.1)',
                        color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                        borderRadius: '100px', padding: '2px 8px', fontSize: '11px', fontWeight: '700',
                      }}>{count}</span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: sidebarOpen ? '11px 14px' : '11px 18px',
            borderRadius: '10px', cursor: 'pointer',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            {sidebarOpen && <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '500' }}>Logout</span>}
          </div>
        </div>
      </aside>
    </>
  );

  // ── Page content ───────────────────────────────────────────────────────────
  const PageContent = () => {
    if (loading) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#94a3b8', fontSize: '16px' }}>
        <div>⏳ Loading dashboard...</div>
      </div>
    );

    if (error) return (
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px', color: '#dc2626' }}>
        ⚠️ {error}
      </div>
    );

    switch (activePage) {
      case 'overview':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '32px' }}>
              <StatCard icon="👥" value={stats?.total_students} label="Assigned Students" color="#6366f1" onClick={() => navigate('students')} />
              <StatCard icon="⏳" value={stats?.pending_review} label="Pending Review" color="#f59e0b" onClick={() => navigate('pending')} active={false} />
              <StatCard icon="👁️" value={stats?.reviewed} label="Reviewed" color="#3b82f6" onClick={() => navigate('reviewed')} />
              <StatCard icon="✅" value={stats?.approved} label="Approved" color="#22c55e" onClick={() => navigate('approved')} />
            </div>

            {/* Recent pending logs */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>⏳ Logs Awaiting Review</h3>
                <button onClick={() => navigate('pending')} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>View all →</button>
              </div>
              <LogList logs={pendingLogs.slice(0, 5)} onSelectLog={setSelectedLog} />
            </div>
          </div>
        );

      case 'students':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>My Students ({students.length})</h2>
            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
                <p style={{ fontWeight: '600' }}>No students assigned yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: '20px' }}>
                {students.map(s => <StudentCard key={s.id} student={s} onViewLogs={() => navigate('pending')} />)}
              </div>
            )}
          </div>
        );

      case 'pending':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>⏳ Pending Review ({pendingLogs.length})</h2>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <LogList logs={pendingLogs} onSelectLog={setSelectedLog} />
            </div>
          </div>
        );

      case 'reviewed':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>👁️ Reviewed Logs ({reviewedLogs.length})</h2>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <LogList logs={reviewedLogs} onSelectLog={setSelectedLog} />
            </div>
          </div>
        );

      case 'approved':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>✅ Approved Logs ({approvedLogs.length})</h2>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <LogList logs={approvedLogs} onSelectLog={setSelectedLog} />
            </div>
          </div>
        );

      case 'profile':
        return <SupervisorProfile />;

      default: return null;
    }
  };

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <Sidebar />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top navbar */}
        <header style={{
          height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', padding: '0 24px',
          gap: '16px', position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {/* Hamburger */}
          {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
            borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '5px',
          }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: '20px', height: '2px', background: '#64748b', borderRadius: '2px' }} />
            ))}
          </button>

          {/* Page title */}
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
              {NAV.find(n => n.key === activePage)?.icon} {NAV.find(n => n.key === activePage)?.label}
            </span>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notification bell */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: showNotifications ? '#f0f4ff' : '#f8fafc', border: `1px solid ${showNotifications ? '#6366f1' : '#e2e8f0'}`, borderRadius: '10px', padding: '8px 10px', cursor: 'pointer', fontSize: '16px' }}>🔔</button>
              {pendingLogs.length > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#ef4444', color: 'white', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '10px', fontWeight: '800',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{pendingLogs.length}</span>
              )}
            </div>

            {/* Avatar */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '800', fontSize: '14px', cursor: 'pointer',
            }}>
              {(user?.first_name || user?.username || 'S').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 24px', overflowY: 'auto' }}>
          <PageContent />
        </main>
      </div>

      {/* Review modal */}
      {selectedLog && (
        <ReviewForm log={selectedLog} onClose={() => setSelectedLog(null)} onUpdated={handleReviewUpdated} />
      )}
    </div>
  );
};

export default SupervisorDashboard;
