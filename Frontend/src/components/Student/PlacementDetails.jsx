import React from 'react';

const PlacementDetails = ({ placement }) => {
  if (!placement) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ color: '#854d0e', margin: '0 0 8px' }}>No Placement Assigned</h3>
        <p style={{ color: '#92400e', margin: 0 }}>You have not been assigned to a company or supervisor yet. Please contact your administrator.</p>
      </div>
    );
  }

  // Support both real API fields and legacy fields
  const workSupervisor = placement.workplace_supervisor;
  const acadSupervisor = placement.academic_supervisor;

  const card = (title, icon, children) => (
    <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '15px', fontWeight: '700', color: '#6366f1' }}>
        <span>{icon}</span>{title}
      </div>
      {children}
    </div>
  );

  const row = (label, value) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{value || '—'}</div>
    </div>
  );

  // Calculate internship progress
  const today = new Date();
  const start = new Date(placement.start_date);
  const end = new Date(placement.end_date);
  const total = end - start;
  const elapsed = today - start;
  const progress = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  const isActive = today >= start && today <= end;

  return (
    <div>
      {/* Status banner */}
      <div style={{
        background: isActive ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f1f5f9',
        borderRadius: '16px', padding: '20px 24px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: isActive ? 'white' : '#0f172a' }}>
            🏢 {placement.company_name}
          </div>
          <div style={{ fontSize: '13px', color: isActive ? 'rgba(255,255,255,0.75)' : '#64748b', marginTop: '4px' }}>
            {placement.start_date} → {placement.end_date}
          </div>
        </div>
        <span style={{
          background: isActive ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
          color: isActive ? 'white' : '#64748b',
          padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '700',
        }}>
          {isActive ? '🟢 Active' : today < start ? '🔵 Upcoming' : '⚫ Completed'}
        </span>
      </div>

      {/* Progress bar */}
      {isActive && (
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Internship Progress</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1' }}>{progress}%</span>
          </div>
          <div style={{ background: '#f1f5f9', borderRadius: '100px', height: '8px' }}>
            <div style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#6366f1,#22c55e)', borderRadius: '100px', height: '8px', transition: 'width 0.5s' }} />
          </div>
        </div>
      )}

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px' }}>
        {card('Workplace Supervisor', '👨💼', (
          <>
            {row('Name', workSupervisor?.full_name || workSupervisor?.username || placement.workplace_supervisor_name)}
            {row('Email', workSupervisor?.email)}
            {row('Phone', workSupervisor?.phone_number)}
          </>
        ))}
        {card('Academic Supervisor', '🎓', (
          <>
            {row('Name', acadSupervisor?.full_name || acadSupervisor?.username || placement.academic_supervisor_name)}
            {row('Email', acadSupervisor?.email)}
            {row('Phone', acadSupervisor?.phone_number)}
          </>
        ))}
        {card('Internship Period', '📅', (
          <>
            {row('Start Date', placement.start_date)}
            {row('End Date', placement.end_date)}
            {row('Duration', placement.duration_days ? `${placement.duration_days} days` : null)}
          </>
        ))}
      </div>
    </div>
  );
};

export default PlacementDetails;
