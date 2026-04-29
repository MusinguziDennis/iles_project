import React from 'react';

const StatsCards = ({ users, placements }) => {
  const students = users.filter(u => u.role === 'student').length;
  const supervisors = users.filter(u => u.role === 'work_supervisor' || u.role === 'university_supervisor').length;
  const admins = users.filter(u => u.role === 'admin').length;

  const cards = [
    { icon: '👥', value: users.length, label: 'Total Users', color: '#6366f1' },
    { icon: '🎓', value: students, label: 'Students', color: '#0ea5e9' },
    { icon: '👨🏫', value: supervisors, label: 'Supervisors', color: '#10b981' },
    { icon: '🏢', value: placements.length, label: 'Placements', color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{c.icon}</div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
