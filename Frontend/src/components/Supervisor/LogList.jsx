import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

const LogList = ({ logs, onSelectLog }) => {
  const [search, setSearch] = useState('');

  const filtered = logs.filter(log =>
    log.student.full_name.toLowerCase().includes(search.toLowerCase()) ||
    `week ${log.week_number}`.includes(search.toLowerCase())
  );

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#64748b' }}>All caught up!</p>
        <p style={{ fontSize: '14px' }}>No logs pending review right now.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍  Search by student name or week..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 16px', borderRadius: '10px',
            border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none',
            boxSizing: 'border-box', background: '#f8fafc',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Student', 'Week', 'Submitted', 'Status', 'Feedback', 'Action'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left', fontSize: '12px',
                  fontWeight: '700', color: '#64748b', textTransform: 'uppercase',
                  letterSpacing: '0.8px', borderBottom: '2px solid #e2e8f0',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => (
              <tr key={log.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
              >
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{log.student.full_name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{log.student.email}</div>
                </td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', fontWeight: '600', color: '#334155' }}>
                  Week {log.week_number}
                </td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#64748b' }}>
                  {log.submitted_at ? new Date(log.submitted_at).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <StatusBadge status={log.status} />
                </td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#64748b' }}>
                  {log.feedback?.length > 0 ? `${log.feedback.length} comment(s)` : 'None'}
                </td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => onSelectLog(log)}
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: 'white', border: 'none', padding: '7px 16px',
                      borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Review →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogList;
