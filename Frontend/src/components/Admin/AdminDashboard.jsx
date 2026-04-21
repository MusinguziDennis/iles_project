import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserList from './Userlist';
import PlacementList from './PlacementList';
import StatsCards from './StatsCards';
import UserFormModal from './UserForm';
import PlacementFormModal from './PlacmentForm';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(null);

  useEffect(() => {
    // Mock data – replace with API calls later
    setUsers([
      { id: 1, username: 'trisha_k', email: 'trisha@example.com', first_name: 'Trisha', last_name: 'Komugisa', role: 'student', is_active: true },
      { id: 2, username: 'brian_m', email: 'brian@example.com', first_name: 'Brian', last_name: 'Muhwezi', role: 'student', is_active: true },
      { id: 3, username: 'amos_k', email: 'amos@techcorp.com', first_name: 'Amos', last_name: 'Karuhanga', role: 'workplace_supervisor', is_active: true },
      { id: 4, username: 'peter_w', email: 'peter@university.ac.ug', first_name: 'Peter', last_name: 'Wakholi', role: 'academic_supervisor', is_active: true },
      { id: 5, username: 'admin_tracy', email: 'admin@iles.com', first_name: 'Tracy', last_name: 'Komukama', role: 'administrator', is_active: true },
    ]);

    setPlacements([
      { id: 101, student: { id: 1, name: 'Trisha Komugisa' }, company_name: 'Tech Corp Uganda', workplace_supervisor: { id: 3, name: 'Amos Karuhanga' }, academic_supervisor: { id: 4, name: 'Peter Wakholi' }, start_date: '2026-01-15', end_date: '2026-05-15' },
      { id: 102, student: { id: 2, name: 'Brian Muhwezi' }, company_name: 'Innovate Solutions', workplace_supervisor: { id: 3, name: 'Amos Karuhanga' }, academic_supervisor: { id: 4, name: 'Peter Wakholi' }, start_date: '2026-02-01', end_date: '2026-06-01' },
    ]);
    setLoading(false);
  }, []);

  // User CRUD
  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
    } else {
      // Create new user with a mock ID
      const newId = Math.max(...users.map(u => u.id), 0) + 1;
      setUsers([...users, { id: newId, ...userData, is_active: userData.is_active ?? true }]);
    }
  };

  // Placement CRUD
  const handleAddPlacement = () => {
    setEditingPlacement(null);
    setShowPlacementModal(true);
  };

  const handleEditPlacement = (placement) => {
    setEditingPlacement(placement);
    setShowPlacementModal(true);
  };

  const handleDeletePlacement = (placementId) => {
    if (window.confirm('Are you sure you want to delete this placement?')) {
      setPlacements(placements.filter(p => p.id !== placementId));
    }
  };

  const handleSavePlacement = (placementData) => {
    if (editingPlacement) {
      // Update existing placement
      setPlacements(placements.map(p =>
        p.id === editingPlacement.id
          ? {
              ...p,
              company_name: placementData.company_name,
              start_date: placementData.start_date,
              end_date: placementData.end_date,
              workplace_supervisor: users.find(u => u.id === parseInt(placementData.workplace_supervisor_id)) || null,
              academic_supervisor: users.find(u => u.id === parseInt(placementData.academic_supervisor_id)) || null,
            }
          : p
      ));
    } else {
      // Create new placement
      const newId = Math.max(...placements.map(p => p.id), 0) + 1;
      const student = users.find(u => u.id === parseInt(placementData.student_id));
      const workplaceSupervisor = users.find(u => u.id === parseInt(placementData.workplace_supervisor_id));
      const academicSupervisor = users.find(u => u.id === parseInt(placementData.academic_supervisor_id));
      setPlacements([...placements, {
        id: newId,
        student: { id: placementData.student_id, name: student ? `${student.first_name} ${student.last_name}` : 'Unknown' },
        company_name: placementData.company_name,
        workplace_supervisor: workplaceSupervisor ? { id: workplaceSupervisor.id, name: `${workplaceSupervisor.first_name} ${workplaceSupervisor.last_name}` } : null,
        academic_supervisor: academicSupervisor ? { id: academicSupervisor.id, name: `${academicSupervisor.first_name} ${academicSupervisor.last_name}` } : null,
        start_date: placementData.start_date,
        end_date: placementData.end_date,
      }]);
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

      {/* Modals */}
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
          supervisors={users.filter(u => u.role === 'workplace_supervisor' || u.role === 'academic_supervisor')}
          onClose={() => setShowPlacementModal(false)}
          onSave={handleSavePlacement}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
