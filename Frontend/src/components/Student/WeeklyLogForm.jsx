import React, { useState } from 'react';

const WeeklyLogForm = ({ log, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    week_number: log?.week_number || '',
    content: log?.content || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!formData.week_number) errs.week_number = 'Week number is required.';
    else if (formData.week_number < 1 || formData.week_number > 52) errs.week_number = 'Week number must be between 1 and 52.';
    if (!formData.content.trim()) errs.content = 'Content is required.';
    if (formData.content.trim().length < 20) errs.content = 'Content must be at least 20 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSuccess({ week_number: parseInt(formData.week_number), content: formData.content });
    } catch (err) {
      setErrors({ general: 'Failed to save log. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inp = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    style: {
      width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px',
      outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
      border: errors[name] ? '2px solid #ef4444' : '2px solid #e2e8f0',
      transition: 'border 0.2s',
    },
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
      onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
              {log ? '✏️ Edit Weekly Log' : '📝 New Weekly Log'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              {log ? 'Update your log entry' : 'Document your weekly internship activities'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>

        {errors.general && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '14px' }}>
            ⚠️ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Week number */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Week Number *
            </label>
            <input type="number" min="1" max="52" placeholder="e.g. 1, 2, 3..." {...inp('week_number')} />
            {errors.week_number && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.week_number}</div>}
          </div>

          {/* Content */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Weekly Report Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={7}
              placeholder="Describe your activities, achievements, challenges, and lessons learned this week. Be specific and detailed..."
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '10px', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical',
                border: errors.content ? '2px solid #ef4444' : '2px solid #e2e8f0', lineHeight: '1.6',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {errors.content
                ? <div style={{ color: '#ef4444', fontSize: '12px' }}>{errors.content}</div>
                : <div />
              }
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{formData.content.length} chars</div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 24px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              padding: '10px 24px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white',
              fontWeight: '700', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Saving...' : log ? 'Update Log' : 'Create Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeeklyLogForm;
