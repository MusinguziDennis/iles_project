import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserList from './UserList';
import PlacementList from './PlacementList';
import StatsCards from './StatsCards';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data – replace with API calls later
    setUsers([
      { id: 1, username: 'alice_n', email: 'alice@example.com', first_name: 'Alice', last_name: 'Nambi', role: 'student', is_active: true },
      { id: 2, username: 'brian_m', email: 'brian@example.com', first_name: 'Brian', last_name: 'Mutebi', role: 'student', is_active: true },
      { id: 3, username: 'john_okello', email: 'john@techcorp.com', first_name: 'John', last_name: 'Okello', role: 'workplace_supervisor', is_active: true },
      { id: 4, username: 'sarah_nam', email: 'sarah@university.ac.ug', first_name: 'Sarah', last_name: 'Namukasa', role: 'academic_supervisor', is_active: true },
      { id: 5, username: 'admin_tracy', email: 'admin@iles.com', first_name: 'Tracy', last_name: 'Komukama', role: 'administrator', is_active: true },
    ]);

    setPlacements([
      { id: 101, student: { id: 1, name: 'Alice Nambi' }, company_name: 'Tech Corp Uganda', workplace_supervisor: { id: 3, name: 'John Okello' }, academic_supervisor: { id: 4, name: 'Sarah Namukasa' }, start_date: '2026-01-15', end_date: '2026-05-15' },
      { id: 102, student: { id: 2, name: 'Brian Mutebi' }, company_name: 'Innovate Solutions', workplace_supervisor: { id: 3, name: 'John Okello' }, academic_supervisor: { id: 4, name: 'Sarah Namukasa' }, start_date: '2026-02-01', end_date: '2026-06-01' },
    ]);
    setLoading(false);
  }, []);

  const handleAddUser = () => {
    alert('Add user form – to be implemented with modal or separate page');
  };

  const handleEditUser = (user) => {
    alert(`Edit user ${user.username} – to be implemented`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleAddPlacement = () => {
    alert('Add placement form – to be implemented');
  };

  const handleEditPlacement = (placement) => {
    alert(`Edit placement for ${placement.student.name} – to be implemented`);
  };

  const handleDeletePlacement = (placementId) => {
    if (window.confirm('Are you sure you want to delete this placement?')) {
      setPlacements(placements.filter(p => p.id !== placementId));
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

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading admin dashboard...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>Admin Dashboard, {user?.username || 'Admin'} 👑</h1>
          <p style={styles.welcomeSubtitle}>Manage users, placements, and oversee the entire internship programme.</p>
        </div>

        <StatsCards users={users} placements={placements} />

        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('users')}
            style={{ ...styles.tab, ...(activeTab === 'users' ? styles.activeTab : styles.inactiveTab) }}
          >
            👥 Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('placements')}
            style={{ ...styles.tab, ...(activeTab === 'placements' ? styles.activeTab : styles.inactiveTab) }}
          >
            🏢 Placements ({placements.length})
          </button>
        </div>

        <div style={styles.contentCard}>
          {activeTab === 'users' && (
            <UserList
              users={users}
              onAdd={handleAddUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          )}
          {activeTab === 'placements' && (
            <PlacementList
              placements={placements}
              onAdd={handleAddPlacement}
              onEdit={handleEditPlacement}
              onDelete={handleDeletePlacement}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
