// src/components/Student/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import WeeklyLogList from './WeeklyLogList';
import WeeklyLogForm from './WeeklyLogForm';
import PlacementDetails from './PlacementDetails';

const StudentDashboard = () => {
  const [placement, setPlacement] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [placementRes, logsRes] = await Promise.all([
        api.get('/placements/my/'),
        api.get('/logs/'),
      ]);
      setPlacement(placementRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error(err);
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
      try {
        await api.patch(`/logs/${logId}/submit/`);
        fetchData();
      } catch (err) {
        alert('Submission failed: ' + (err.response?.data?.detail || 'Unknown error'));
      }
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Student Dashboard</h1>
      <PlacementDetails placement={placement} />
      <hr />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Weekly Logs</h2>
        <button onClick={handleCreateLog} style={styles.button}>+ New Log</button>
      </div>
      <WeeklyLogList logs={logs} onEdit={handleEditLog} onSubmit={handleSubmitLog} />
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

const styles = {
  button: {
    backgroundColor: '#1a73e8',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default StudentDashboard;
