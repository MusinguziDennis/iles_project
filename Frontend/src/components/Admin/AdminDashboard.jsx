import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserList from './Userlist';
import PlacementList from './PlacementList';
import UserFormModal from './UserFormModal';
import PlacementFormModal from './PlacementFormModal';
import {
  fetchUsers, createUser, updateUser, deleteUser,
  fetchPlacements, createPlacement, updatePlacement, deletePlacement,
} from '../../services/adminApi';

const NAV = [
  { key: 'overview',    icon: '🏠', label: 'Overview' },
  { key: 'users',       icon: '👥', label: 'Users' },
  { key: 'placements',  icon: '🏢', label: 'Placements' },
  { key: 'students',    icon: '🎓', label: 'Students' },
  { key: 'supervisors', icon: '👨‍🏫', label: 'Supervisors' },
];

const StatCard = ({ icon, value, label, color, onClick }) => (
  <div onClick={onClick} style={{
    background: 'white', borderRadius: '16px', padding: '20px 24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
    display: 'flex', alignItems: 'center', gap: '16px',
    cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s',
  }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.boxShadow = `0 8px 24px ${color}30`; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
  >
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: `${color}15`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '22px', flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>{value ?? '—'}</div>
      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>{label}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('overview');
  const [users, setUsers] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(null);

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
      const [usersRes, placementsRes] = await Promise.all([fetchUsers(), fetchPlacements()]);
      setUsers(usersRes.data);
      setPlacements(placementsRes.data.map(p => ({
        ...p,
        student: { id: p.student, name: p.student_name },
        workplace_supervisor: { name: p.workplace_supervisor_name },
        academic_supervisor: { name: p.academic_supervisor_name },
      })));
    } catch {
      setError('Failed to load data. Make sure you are logged in as admin.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
      } else {
        const res = await createUser({ ...userData, confirm_password: userData.password });
        if (res.data.email_sent) {
          alert(`✅ User created! Login credentials sent to ${userData.email}`);
        } else {
          alert(`⚠️ User created but email could not be sent. Please share credentials manually.\n\nUsername: ${userData.username}\nPassword: ${userData.password}`);
        }
      }
      setShowUserModal(false);
      setEditingUser(null);
      loadData();
    } catch (e) {
      alert(e.response?.data ? JSON.stringify(e.response.data) : 'Failed to save user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? This will also remove all their associated data.')) return;
    try { await deleteUser(userId); loadData(); }
    catch (e) { alert(e.response?.data?.detail || 'Failed to delete user.'); }
  };

  const handleSavePlacement = async (placementData) => {
    try {
      if (editingPlacement) await updatePlacement(editingPlacement.id, placementData);
      else await createPlacement(placementData);
      setShowPlacementModal(false);
      setEditingPlacement(null);
      loadData();
    } catch (e) {
      alert(e.response?.data ? JSON.stringify(e.response.data) : 'Failed to save placement.');
    }
  };

  const handleDeletePlacement = async (placementId) => {
    if (!window.confirm('Delete this placement? The student will lose their assigned supervisors.')) return;
    try { await deletePlacement(placementId); loadData(); }
    catch (e) { alert(e.response?.data?.detail || 'Failed to delete placement.'); }
  };

  const navigate = (page) => {
    setActivePage(page);
    if (isMobile) setSidebarOpen(false);
  };

  const students = users.filter(u => u.role === 'student');
  const supervisors = users.filter(u => u.role === 'work_supervisor' || u.role === 'university_supervisor');

  const counts = {
    users: users.length,
    placements: placements.length,
    students: students.length,
    supervisors: supervisors.length,
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
        background: 'linear-gradient(180deg,#1e1b4b 0%,#312e81 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden', zIndex: 100, flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: '72px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📘</div>
          {sidebarOpen && <span style={{ color: 'white', fontWeight: '800', fontSize: '18px', whiteSpace: 'nowrap' }}>ILES Admin</span>}
        </div>

        {/* User info */}
        {sidebarOpen && (
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '10px' }}>
              {(user?.first_name || user?.username || 'A').charAt(0).toUpperCase()}
            </div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
            </div>
            <div style={{ color: '#fbbf24', fontSize: '12px', marginTop: '2px' }}>👑 Administrator</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV.map(item => {
            const count = counts[item.key] ?? null;
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
                    <span style={{ color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: isActive ? '700' : '500', flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>
                    {count !== null && (
                      <span style={{ background: isActive ? '#6366f1' : 'rgba(255,255,255,0.1)', color: isActive ? 'white' : 'rgba(255,255,255,0.6)', borderRadius: '100px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>{count}</span>
                    )}
                  </>
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

  // ── Page content ──────────────────────────────────────────────────────────
  const PageContent = () => {
    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#94a3b8', fontSize: '16px' }}>⏳ Loading...</div>;
    if (error) return <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px', color: '#dc2626' }}>⚠️ {error}</div>;

    switch (activePage) {
      case 'overview':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '32px' }}>
              <StatCard icon="👥" value={users.length} label="Total Users" color="#6366f1" onClick={() => navigate('users')} />
              <StatCard icon="🎓" value={students.length} label="Students" color="#0ea5e9" onClick={() => navigate('students')} />
              <StatCard icon="👨‍🏫" value={supervisors.length} label="Supervisors" color="#10b981" onClick={() => navigate('supervisors')} />
              <StatCard icon="🏢" value={placements.length} label="Placements" color="#f59e0b" onClick={() => navigate('placements')} />
            </div>
            {/* Quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>⚡ Quick Actions</h3>
                {[
                  { label: '+ Add New User', color: '#6366f1', action: () => { setEditingUser(null); setShowUserModal(true); } },
                  { label: '+ Assign Student to Supervisor', color: '#10b981', action: () => { setEditingPlacement(null); setShowPlacementModal(true); } },
                  { label: '👥 Manage All Users', color: '#0ea5e9', action: () => navigate('users') },
                  { label: '🏢 View All Placements', color: '#f59e0b', action: () => navigate('placements') },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.action} style={{
                    display: 'block', width: '100%', padding: '10px 16px', marginBottom: '8px',
                    background: `${btn.color}10`, border: `1px solid ${btn.color}30`,
                    borderRadius: '10px', color: btn.color, fontWeight: '600', fontSize: '14px',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}>{btn.label}</button>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>📊 User Breakdown</h3>
                {[
                  { label: 'Students', count: students.length, color: '#0ea5e9' },
                  { label: 'Work Supervisors', count: users.filter(u => u.role === 'work_supervisor').length, color: '#6366f1' },
                  { label: 'Academic Supervisors', count: users.filter(u => u.role === 'university_supervisor').length, color: '#10b981' },
                  { label: 'Admins', count: users.filter(u => u.role === 'admin').length, color: '#f59e0b' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>{item.label}</span>
                    <span style={{ fontWeight: '700', color: item.color, fontSize: '16px' }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>👥 All Users ({users.length})</h2>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <UserList users={users} onAdd={() => { setEditingUser(null); setShowUserModal(true); }} onEdit={(u) => { setEditingUser(u); setShowUserModal(true); }} onDelete={handleDeleteUser} />
            </div>
          </div>
        );

      case 'placements':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>🏢 Placements ({placements.length})</h2>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <PlacementList placements={placements} onAdd={() => { setEditingPlacement(null); setShowPlacementModal(true); }} onEdit={(p) => { setEditingPlacement(p); setShowPlacementModal(true); }} onDelete={handleDeletePlacement} />
            </div>
          </div>
        );

      case 'students':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>🎓 Students ({students.length})</h2>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <UserList users={students} onAdd={() => { setEditingUser(null); setShowUserModal(true); }} onEdit={(u) => { setEditingUser(u); setShowUserModal(true); }} onDelete={handleDeleteUser} />
            </div>
          </div>
        );

      case 'supervisors':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>👨‍🏫 Supervisors ({supervisors.length})</h2>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <UserList users={supervisors} onAdd={() => { setEditingUser(null); setShowUserModal(true); }} onEdit={(u) => { setEditingUser(u); setShowUserModal(true); }} onDelete={handleDeleteUser} />
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top navbar */}
        <header style={{ height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: '20px', height: '2px', background: '#64748b', borderRadius: '2px' }} />)}
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
              {NAV.find(n => n.key === activePage)?.icon} {NAV.find(n => n.key === activePage)?.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px' }}>
              {(user?.first_name || user?.username || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '28px 24px', overflowY: 'auto' }}>
          <PageContent />
        </main>
      </div>

      {showUserModal && (
        <UserFormModal user={editingUser} onClose={() => setShowUserModal(false)} onSave={handleSaveUser} />
      )}
      {showPlacementModal && (
        <PlacementFormModal
          placement={editingPlacement}
          students={students}
          supervisors={supervisors}
          onClose={() => setShowPlacementModal(false)}
          onSave={handleSavePlacement}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
