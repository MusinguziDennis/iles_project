import React, { useState } from 'react';
import { postReview, updateLogStatus } from '../../services/supervisorApi';
import StatusBadge from './StatusBadge';

// Valid status transitions a supervisor can trigger
const TRANSITIONS = {
  submitted: [
    { value: 'reviewed', label: '👁️ Mark as Reviewed' },
  ],
  reviewed: [
    { value: 'approved', label: '✅ Approve Log' },
    { value: 'submitted', label: '↩️ Push Back to Submitted' },
  ],
};

const ReviewForm = ({ log, onClose, onUpdated }) => {
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isLocked = log.status === 'approved';
  const transitions = TRANSITIONS[log.status] || [];

  const handlePostComment = async () => {
    if (!comment.trim()) { setError('Comment cannot be empty.'); return; }
    setError(''); setSubmittingComment(true);
    try {
      await postReview(log.id, comment);
      setComment('');
      setSuccess('Comment posted successfully.');
      onUpdated();
    } catch (e) {
      setError(e.response?.data?.detail || e.response?.data?.comment?.[0] || 'Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setError(''); setUpdatingStatus(true);
    try {
      await updateLogStatus(log.id, newStatus);
      setSuccess(`Status updated to "${newStatus}".`);
      onUpdated();
    } catch (e) {
      setError(e.response?.data?.status?.[0] || e.response?.data?.detail || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px',
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '20px', width: '100%', maxWidth: '640px',
        maxHeight: '90vh', overflowY: 'auto', padding: '32px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
              Week {log.week_number} — {log.student.full_name}
            </h2>
            <div style={{ marginTop: '8px' }}><StatusBadge status={log.status} /></div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>

        {/* Log content */}
        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Log Content</div>
          <p style={{ margin: 0, color: '#334155', lineHeight: '1.8', fontSize: '15px', whiteSpace: 'pre-wrap' }}>{log.content}</p>
        </div>

        {/* Existing feedback */}
        {log.feedback?.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Previous Feedback ({log.feedback.length})
            </div>
            {log.feedback.map(fb => (
              <div key={fb.id} style={{ background: '#f0f4ff', borderRadius: '10px', padding: '14px 16px', marginBottom: '10px', borderLeft: '3px solid #6366f1' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#4338ca', marginBottom: '4px' }}>{fb.supervisor_name}</div>
                <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>{fb.comment}</p>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>{new Date(fb.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#dc2626', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#16a34a', fontSize: '14px' }}>
            ✅ {success}
          </div>
        )}

        {isLocked ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '14px' }}>
            🔒 This log is approved and locked. No further actions allowed.
          </div>
        ) : (
          <>
            {/* Comment box */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                Add Feedback Comment
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Write your feedback for the student..."
                rows={4}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  border: '1.5px solid #e2e8f0', fontSize: '14px', resize: 'vertical',
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  lineHeight: '1.6',
                }}
              />
              <button
                onClick={handlePostComment}
                disabled={submittingComment}
                style={{
                  marginTop: '10px', background: '#6366f1', color: 'white',
                  border: 'none', padding: '10px 24px', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '600', cursor: submittingComment ? 'not-allowed' : 'pointer',
                  opacity: submittingComment ? 0.7 : 1,
                }}
              >
                {submittingComment ? 'Posting...' : '💬 Post Comment'}
              </button>
            </div>

            {/* Status transitions */}
            {transitions.length > 0 && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '12px' }}>
                  Update Log Status
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {transitions.map(t => (
                    <button
                      key={t.value}
                      onClick={() => handleStatusChange(t.value)}
                      disabled={updatingStatus}
                      style={{
                        padding: '10px 20px', borderRadius: '8px', border: 'none',
                        fontSize: '14px', fontWeight: '600', cursor: updatingStatus ? 'not-allowed' : 'pointer',
                        opacity: updatingStatus ? 0.7 : 1,
                        background: t.value === 'approved' ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                          : t.value === 'reviewed' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                          : '#f1f5f9',
                        color: t.value === 'submitted' ? '#374151' : 'white',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;
