import React from 'react';

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' },
  submitted: { label: 'Submitted', bg: '#fef9c3', color: '#854d0e', dot: '#eab308' },
  reviewed:  { label: 'Reviewed',  bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
  approved:  { label: 'Approved',  bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: cfg.bg, color: cfg.color,
      padding: '4px 12px', borderRadius: '100px',
      fontSize: '12px', fontWeight: '700', letterSpacing: '0.3px',
    }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
