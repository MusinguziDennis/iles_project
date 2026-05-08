import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchMyPlacement, fetchMyLogs, createLog, updateLog, deleteLog, submitLog, fetchMyNotifications } from '../../services/studentApi';
import WeeklyLogForm from './WeeklyLogForm';
import PlacementDetails from './PlacementDetails';
import StudentNotifications from './StudentNotifications';

const NAV = [
  { key: 'overview',   icon: '🏠', label: 'Overview' },
  { key: 'logs',       icon: '📝', label: 'My Logs' },
  { key: 'placement',  icon: '🏢', label: 'Placement' },
];

const StatusBadge = ({ status }) => {
  const cfg = {
    draft:     { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' },
    submitted: { bg: '#fef9c3', color: '#854d0e', dot: '#eab308' },
    reviewed:  { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
    approved:  { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
  }[status] || { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: cfg.bg, color: cfg.color, padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '700' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [placement, setPlacement] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePage, setActivePage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
      const [placementRes, logsRes, notifRes] = await Promise.all([
        fetchMyPlacement().catch(() => ({ data: [] })),
        fetchMyLogs().catch(() => ({ data: [] })),
        fetchMyNotifications().catch(() => ({ data: [] })),
      ]);
      setPlacement(placementRes.data.length > 0 ? placementRes.data[0] : null);
      setLogs(logsRes.data);
      setUnreadCount(notifRes.data.filter(n => !n.is_read).length);
    } catch {
      setError('Failed to load dashboard.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveLog = async (formData) => {
    try {
      if (editingLog) {
        await updateLog(editingLog.id, formData);
      } else {
        await createLog({ ...formData, student: user.id });
      }
      setShowForm(false);
      setEditingLog(null);
      await loadData();
    } catch (e) {
      alert(e.response?.data ? JSON.stringify(e.response.data) : 'Failed to save log.');
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Delete this log? This action cannot be undone.')) return;
    try { await deleteLog(logId); loadData(); }
    catch (e) { alert(e.response?.data?.detail || 'Failed to delete log.'); }
  };

  const handleSubmitLog = async (logId) => {
    if (!window.confirm('Submit this log for review? You will not be able to edit it afterwards unless your supervisor requests changes.')) return;
    try { await submitLog(logId); loadData(); }
    catch (e) { alert(e.response?.data?.detail || 'Failed to submit log.'); }
  };

  const navigate = (page) => {
    setActivePage(page);
    if (isMobile) setSidebarOpen(false);
  };

  const stats = {
    total: logs.length,
    draft: logs.filter(l => l.status === 'draft').length,
    submitted: logs.filter(l => l.status === 'submitted').length,
    reviewed: logs.filter(l => l.status === 'reviewed').length,
    approved: logs.filter(l => l.status === 'approved').length,
    completion: logs.length > 0 ? Math.round((logs.filter(l => l.status === 'approved').length / logs.length) * 100) : 0,
  };

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <>
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
      )}
      <aside style={{
        position: isMobile ? 'fixed' : 'sticky',
        top: 0, left: 0, height: '100vh',
        width: sidebarOpen ? '260px' : (isMobile ? '0' : '72px'),
        background: 'linear-gradient(180deg,#0f172a 0%,#1e293b 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden', zIndex: 100, flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: '72px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📘</div>
          {sidebarOpen && <span style={{ color: 'white', fontWeight: '800', fontSize: '18px', whiteSpace: 'nowrap' }}>ILES</span>}
        </div>

        {/* User info */}
        {sidebarOpen && (
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '10px' }}>
              {(user?.first_name || user?.username || 'S').charAt(0).toUpperCase()}
            </div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
            </div>
            <div style={{ color: '#38bdf8', fontSize: '12px', marginTop: '2px' }}>🎓 Student Intern</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV.map(item => {
            const isActive = activePage === item.key;
            return (
              <div key={item.key} onClick={() => navigate(item.key)} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: sidebarOpen ? '11px 14px' : '11px 18px',
                borderRadius: '10px', cursor: 'pointer', marginBottom: '4px',
                background: isActive ? 'rgba(99,102,241,0.25)' : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                transition: 'all 0.2s', justifyContent: sidebarOpen ? 'flex-start' : 'center',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && (
                  <span style={{ color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: isActive ? '700' : '500', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: sidebarOpen ? '11px 14px' : '11px 18px', borderRadius: '10px', cursor: 'pointer', justifyContent: sidebarOpen ? 'flex-start' : 'center', transition: 'background 0.2s' }}
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

  // ── Log table ─────────────────────────────────────────────────────────────
  const LogTable = ({ logList }) => {
    const th = { padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '2px solid #e2e8f0', background: '#f8fafc', textAlign: 'left' };
    const td = { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' };

    if (logList.length === 0) return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
        <p style={{ fontWeight: '600' }}>No logs yet. Create your first weekly log!</p>
      </div>
    );

    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Week', 'Content Preview', 'Status', 'Submitted', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {logList.map((log, i) => (
              <tr key={log.id}
                style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
              >
                <td style={td}><strong>Week {log.week_number}</strong></td>
                <td style={td}>{log.content?.substring(0, 80)}...</td>
                <td style={td}><StatusBadge status={log.status} /></td>
                <td style={{ ...td, color: '#94a3b8' }}>{log.submitted_at ? new Date(log.submitted_at).toLocaleDateString() : '—'}</td>
                <td style={td}>
                  {log.status === 'draft' && (
                    <>
                      <button onClick={() => { setEditingLog(log); setShowForm(true); }} style={{ background: '#fef9c3', color: '#854d0e', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginRight: '6px' }}>✏️ Edit</button>
                      <button onClick={() => handleSubmitLog(log.id)} style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginRight: '6px' }}>📤 Submit</button>
                      <button onClick={() => handleDeleteLog(log.id)} style={{ background: '#fce7f3', color: '#9d174d', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>🗑️</button>
                    </>
                  )}
                  {log.status === 'submitted' && <span style={{ color: '#854d0e', fontSize: '12px', fontWeight: '600' }}>⏳ Awaiting review</span>}
                  {log.status === 'reviewed' && <span style={{ color: '#1e40af', fontSize: '12px', fontWeight: '600' }}>👁️ Reviewed</span>}
                  {log.status === 'approved' && <span style={{ color: '#166534', fontSize: '12px', fontWeight: '600' }}>✅ Approved</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ── Page content ──────────────────────────────────────────────────────────
  const PageContent = () => {
    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#94a3b8' }}>⏳ Loading...</div>;
    if (error) return <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px', color: '#dc2626' }}>⚠️ {error}</div>;

    switch (activePage) {
      case 'overview':
        return (
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Welcome back, {user?.first_name || user?.username}! 👋</h2>
            <p style={{ margin: '0 0 24px', color: '#64748b' }}>Track your internship progress and submit weekly logs.</p>

            {/* No placement warning */}
            {!placement && (
              <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#854d0e' }}>No Placement Assigned</div>
                  <div style={{ color: '#92400e', fontSize: '13px', marginTop: '2px' }}>You have not been assigned to a supervisor yet. Contact your administrator.</div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { icon: '📝', value: stats.total, label: 'Total Logs', color: '#6366f1' },
                { icon: '📄', value: stats.draft, label: 'Drafts', color: '#94a3b8' },
                { icon: '⏳', value: stats.submitted, label: 'Submitted', color: '#f59e0b' },
                { icon: '👁️', value: stats.reviewed, label: 'Reviewed', color: '#3b82f6' },
                { icon: '✅', value: stats.approved, label: 'Approved', color: '#22c55e' },
              ].map(s => (
                <div key={s.label} style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent logs */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>📝 Recent Logs</h3>
                <button onClick={() => navigate('logs')} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>View all →</button>
              </div>
              <LogTable logList={logs.slice(0, 5)} />
            </div>
          </div>
        );

      case 'logs':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>📝 My Weekly Logs ({logs.length})</h2>
              <button onClick={() => { setEditingLog(null); setShowForm(true); }} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                + New Log
              </button>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <LogTable logList={logs} />
            </div>
          </div>
        );

      case 'placement':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>🏢 My Placement</h2>
            {!placement ? (
              <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                <h3 style={{ color: '#854d0e', margin: '0 0 8px' }}>No Placement Assigned</h3>
                <p style={{ color: '#92400e', margin: 0 }}>You have not been assigned to a company or supervisor yet. Please contact your administrator.</p>
              </div>
            ) : (
              <PlacementDetails placement={placement} />
            )}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Navbar */}
        <header style={{ height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: '20px', height: '2px', background: '#64748b', borderRadius: '2px' }} />)}
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
              {NAV.find(n => n.key === activePage)?.icon} {NAV.find(n => n.key === activePage)?.label}
            </span>
          </div>
          {showNotifications && <StudentNotifications onClose={() => setShowNotifications(false)} onUnreadChange={setUnreadCount} />}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: showNotifications ? '#f0f4ff' : '#f8fafc', border: `1px solid ${showNotifications ? '#6366f1' : '#e2e8f0'}`, borderRadius: '10px', padding: '8px 10px', cursor: 'pointer', fontSize: '16px' }}>🔔</button>
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>
            )}
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px' }}>
            {(user?.first_name || user?.username || 'S').charAt(0).toUpperCase()}
          </div>
        </header>

        <main style={{ flex: 1, padding: '28px 24px', overflowY: 'auto' }}>
          <PageContent />
        </main>
      </div>

      {showForm && (
        <WeeklyLogForm
          log={editingLog}
          onClose={() => { setShowForm(false); setEditingLog(null); }}
          onSuccess={handleSaveLog}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
