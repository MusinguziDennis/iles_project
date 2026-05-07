import React, { useState, useEffect } from 'react';
import { fetchSupervisorNotifications, markSupervisorNotificationRead, markAllSupervisorNotificationsRead } from '../../services/supervisorApi';

const NotificationsPanel = ({ onClose, onUnreadChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupervisorNotifications()
      .then(res => setNotifications(res.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await markSupervisorNotificationRead(id);
      const updated = notifications.map(n => n.id === id ? { ...n, is_read: true } : n);
      setNotifications(updated);
      if (onUnreadChange) onUnreadChange(updated.filter(n => !n.is_read).length);
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await markAllSupervisorNotificationsRead();
      const updated = notifications.map(n => ({ ...n, is_read: true }));
      setNotifications(updated);
      if (onUnreadChange) onUnreadChange(0);
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{
      position: 'fixed', top: '70px', right: '20px', width: '360px',
      background: 'white', borderRadius: '16px', boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
      border: '1px solid #e2e8f0', zIndex: 200, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>Notifications</span>
          {unreadCount > 0 && (
            <span style={{ marginLeft: '8px', background: '#6366f1', color: 'white', borderRadius: '100px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              Mark all read
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
            <p style={{ margin: 0, fontSize: '14px' }}>No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)} style={{
              padding: '14px 20px', borderBottom: '1px solid #f8fafc', cursor: 'pointer',
              background: n.is_read ? 'white' : '#f0f4ff',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'white' : '#f0f4ff'}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.is_read ? '#e2e8f0' : '#6366f1', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>{n.message}</p>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(n.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
