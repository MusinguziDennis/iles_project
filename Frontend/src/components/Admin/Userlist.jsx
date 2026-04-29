import React, { useState } from 'react';

const ROLE_COLORS = {
  student:               { bg: '#dbeafe', color: '#1e40af' },
  work_supervisor:       { bg: '#dcfce7', color: '#166534' },
  university_supervisor: { bg: '#fef9c3', color: '#854d0e' },
  admin:                 { bg: '#fce7f3', color: '#9d174d' },
};

const UserList = ({ users, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter(u => {
    const matchSearch = `${u.first_name} ${u.last_name} ${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getRoleBadge = (role) => {
    const cfg = ROLE_COLORS[role] || { bg: '#f1f5f9', color: '#64748b' };
    return { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', background: cfg.bg, color: cfg.color };
  };

  const th = { textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '2px solid #e2e8f0', background: '#f8fafc' };
  const td = { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>User Management</h2>
        <button onClick={onAdd} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
          + Add New User
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="🔍 Search users..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
        />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', background: 'white', cursor: 'pointer' }}>
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="work_supervisor">Work Supervisors</option>
          <option value="university_supervisor">Academic Supervisors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
          <p style={{ fontWeight: '600' }}>No users found.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Username', 'Full Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id}
                  style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
                >
                  <td style={td}><strong>{u.username}</strong></td>
                  <td style={td}>{u.first_name} {u.last_name}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}><span style={getRoleBadge(u.role)}>{u.role.replace(/_/g, ' ')}</span></td>
                  <td style={td}>{u.is_active ? <span style={{ color: '#16a34a', fontWeight: '600' }}>✅ Active</span> : <span style={{ color: '#dc2626', fontWeight: '600' }}>❌ Inactive</span>}</td>
                  <td style={td}>
                    <button onClick={() => onEdit(u)} style={{ background: '#fef9c3', color: '#854d0e', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginRight: '6px' }}>✏️ Edit</button>
                    <button onClick={() => onDelete(u.id)} style={{ background: '#fce7f3', color: '#9d174d', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px', borderTop: '1px solid #f1f5f9' }}>
            Showing {filtered.length} of {users.length} users
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
