import React, { useState, useEffect } from 'react';
import { fetchMyNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/studentApi';

const StudentNotifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyNotifications()
      .then(res => setNotifications(res.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  const unread = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{
      position: 'fixed', top: '70px', right: '20px', width: '340px',
      background: 'white', borderRadius: '16px', boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
      border: '1px solid #e2e8f0', zIndex: 200, overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>Notifications</span>
          {unread > 0 && <span style={{ background: '#6366f1', color: 'white', borderRadius: '100px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>{unread}</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {unread > 0 && <button onClick={markAll} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Mark all read</button>}
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
            <p style={{ margin: 0, fontSize: '14px' }}>No notifications yet</p>
          </div>
        ) : notifications.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)} style={{
            padding: '14px 20px', borderBottom: '1px solid #f8fafc', cursor: 'pointer',
            background: n.is_read ? 'white' : '#f0f4ff',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'white' : '#f0f4ff'}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.is_read ? '#e2e8f0' : '#6366f1', marginTop: '5px', flexShrink: 0 }} />
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>{n.message}</p>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(n.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentNotifications;
