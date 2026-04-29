import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserList from './Userlist';
import PlacementList from './PlacementList';
import StatsCards from './StatsCards';
import UserFormModal from './UserFormModal';
import PlacementFormModal from './PlacementFormModal';
import {
  fetchUsers, createUser, updateUser, deleteUser,
  fetchPlacements, createPlacement, updatePlacement, deletePlacement,
} from '../../services/adminApi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [usersRes, placementsRes] = await Promise.all([
        fetchUsers(),
        fetchPlacements(),
      ]);
      setUsers(usersRes.data);
      // Normalize placement data to match component expectations
      setPlacements(placementsRes.data.map(p => ({
        ...p,
        student: { id: p.id, name: p.student_name },
        workplace_supervisor: { name: p.workplace_supervisor_name },
        academic_supervisor: { name: p.academic_supervisor_name },
      })));
    } catch (e) {
      setError('Failed to load data. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── User CRUD ──────────────────────────────────────────────────────────────
  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
      } else {
        await createUser({ ...userData, confirm_password: userData.password });
      }
      setShowUserModal(false);
      loadData();
    } catch (e) {
      alert(e.response?.data ? JSON.stringify(e.response.data) : 'Failed to save user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      loadData();
    } catch {
      alert('Failed to delete user.');
    }
  };

  // ── Placement CRUD ─────────────────────────────────────────────────────────
  const handleSavePlacement = async (placementData) => {
    try {
      if (editingPlacement) {
        await updatePlacement(editingPlacement.id, placementData);
      } else {
        await createPlacement(placementData);
      }
      setShowPlacementModal(false);
      loadData();
    } catch (e) {
      alert(e.response?.data ? JSON.stringify(e.response.data) : 'Failed to save placement.');
    }
  };

  const handleDeletePlacement = async (placementId) => {
    if (!window.confirm('Are you sure you want to delete this placement?')) return;
    try {
      await deletePlacement(placementId);
      loadData();
    } catch {
      alert('Failed to delete placement.');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter','Segoe UI',sans-serif",
      padding: '20px',
    },
    mainContent: { maxWidth: '1400px', margin: '0 auto' },
    welcomeCard: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px', padding: '30px', color: 'white',
      marginBottom: '30px', border: '1px solid rgba(255,255,255,0.2)',
    },
    tabsContainer: {
      display: 'flex', gap: '10px', marginBottom: '20px',
      backgroundColor: 'white', borderRadius: '15px', padding: '5px',
    },
    tab: {
      flex: 1, padding: '12px', textAlign: 'center', cursor: 'pointer',
      borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: '600', transition: 'all 0.3s',
    },
    contentCard: {
      backgroundColor: 'white', borderRadius: '20px', padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white', fontSize: '18px' }}>Loading admin dashboard...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>

        {/* Header */}
        <div style={styles.welcomeCard}>
          <h1 style={{ fontSize: '28px', margin: '0 0 8px', fontWeight: '800' }}>
            Admin Dashboard 👑
          </h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Welcome, {user?.first_name || user?.username}. Manage users and internship placements.
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', marginBottom: '20px', color: '#dc2626' }}>
            ⚠️ {error}
          </div>
        )}

        <StatsCards users={users} placements={placements} />

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <button onClick={() => setActiveTab('users')} style={{
            ...styles.tab,
            background: activeTab === 'users' ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'transparent',
            color: activeTab === 'users' ? 'white' : '#666',
          }}>
            👥 Users ({users.length})
          </button>
          <button onClick={() => setActiveTab('placements')} style={{
            ...styles.tab,
            background: activeTab === 'placements' ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'transparent',
            color: activeTab === 'placements' ? 'white' : '#666',
          }}>
            🏢 Placements ({placements.length})
          </button>
        </div>

        <div style={styles.contentCard}>
          {activeTab === 'users' && (
            <UserList
              users={users}
              onAdd={() => { setEditingUser(null); setShowUserModal(true); }}
              onEdit={(u) => { setEditingUser(u); setShowUserModal(true); }}
              onDelete={handleDeleteUser}
            />
          )}
          {activeTab === 'placements' && (
            <PlacementList
              placements={placements}
              onAdd={() => { setEditingPlacement(null); setShowPlacementModal(true); }}
              onEdit={(p) => { setEditingPlacement(p); setShowPlacementModal(true); }}
              onDelete={handleDeletePlacement}
            />
          )}
        </div>
      </div>

      {showUserModal && (
        <UserFormModal
          user={editingUser}
          onClose={() => setShowUserModal(false)}
          onSave={handleSaveUser}
        />
      )}
      {showPlacementModal && (
        <PlacementFormModal
          placement={editingPlacement}
          students={users.filter(u => u.role === 'student')}
          supervisors={users.filter(u => u.role === 'work_supervisor' || u.role === 'university_supervisor')}
          onClose={() => setShowPlacementModal(false)}
          onSave={handleSavePlacement}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
