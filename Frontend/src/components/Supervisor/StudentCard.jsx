import React from 'react';

const StudentCard = ({ student, onViewLogs }) => {
  const progressPct = student.total_logs > 0
    ? Math.round((student.approved_logs / student.total_logs) * 100)
    : 0;

  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '24px',
      border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      transition: 'all 0.2s', cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
    >
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: '800', fontSize: '18px', flexShrink: 0,
        }}>
          {student.student_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{student.student_name}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{student.student_email}</div>
        </div>
      </div>

      {/* Company */}
      <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Company</div>
        <div style={{ fontSize: '14px', color: '#334155', fontWeight: '600', marginTop: '2px' }}>🏢 {student.company_name}</div>
      </div>

      {/* Log stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
        {[
          { label: 'Total', value: student.total_logs, color: '#6366f1' },
          { label: 'Pending', value: student.pending_logs, color: '#f59e0b' },
          { label: 'Approved', value: student.approved_logs, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', background: '#f8fafc', borderRadius: '8px', padding: '10px 6px' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Approval Progress</span>
          <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: '700' }}>{progressPct}%</span>
        </div>
        <div style={{ background: '#f1f5f9', borderRadius: '100px', height: '6px' }}>
          <div style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#6366f1,#22c55e)', borderRadius: '100px', height: '6px', transition: 'width 0.5s' }} />
        </div>
      </div>

      <button onClick={() => onViewLogs(student)} style={{
        width: '100%', padding: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600',
        fontSize: '14px', cursor: 'pointer',
      }}>
        View Logs →
      </button>
    </div>
  );
};

export default StudentCard;
