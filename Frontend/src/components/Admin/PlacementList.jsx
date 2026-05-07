import React, { useState } from 'react';

const PlacementList = ({ placements, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');

  const filtered = placements.filter(p =>
    `${p.student?.name || p.student_name || ''} ${p.company_name} ${p.workplace_supervisor?.name || p.workplace_supervisor_name || ''} ${p.academic_supervisor?.name || p.academic_supervisor_name || ''}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const th = { padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '2px solid #e2e8f0', background: '#f8fafc', textAlign: 'left' };
  const td = { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Placement Management</h2>
        <button onClick={onAdd} style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
          + Assign Student
        </button>
      </div>

      <input
        type="text" placeholder="🔍 Search placements..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box' }}
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏢</div>
          <p style={{ fontWeight: '600' }}>No placements found.</p>
          <button onClick={onAdd} style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', marginTop: '12px' }}>
            + Assign First Student
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Student', 'Company', 'Workplace Supervisor', 'Academic Supervisor', 'Period', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}
                  style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
                >
                  <td style={td}><strong>{p.student?.name || p.student_name}</strong></td>
                  <td style={td}>{p.company_name}</td>
                  <td style={td}>{p.workplace_supervisor?.name || p.workplace_supervisor_name || '—'}</td>
                  <td style={td}>{p.academic_supervisor?.name || p.academic_supervisor_name || '—'}</td>
                  <td style={{ ...td, fontSize: '12px', color: '#64748b' }}>{p.start_date} → {p.end_date}</td>
                  <td style={td}>
                    <button onClick={() => onEdit(p)} style={{ background: '#fef9c3', color: '#854d0e', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginRight: '6px' }}>✏️ Edit</button>
                    <button onClick={() => onDelete(p.id)} style={{ background: '#fce7f3', color: '#9d174d', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px', borderTop: '1px solid #f1f5f9' }}>
            Showing {filtered.length} of {placements.length} placements
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementList;
