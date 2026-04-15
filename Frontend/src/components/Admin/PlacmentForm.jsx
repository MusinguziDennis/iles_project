import React, { useState, useEffect } from 'react';

const PlacementFormModal = ({ placement, students, supervisors, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    company_name: '',
    workplace_supervisor_id: '',
    academic_supervisor_id: '',
    start_date: '',
    end_date: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (placement) {
      setFormData({
        student_id: placement.student?.id || '',
        company_name: placement.company_name || '',
        workplace_supervisor_id: placement.workplace_supervisor?.id || '',
        academic_supervisor_id: placement.academic_supervisor?.id || '',
        start_date: placement.start_date || '',
        end_date: placement.end_date || '',
      });
    }
  }, [placement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) delete errors[name];
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.student_id) newErrors.student_id = 'Please select a student';
    if (!formData.company_name) newErrors.company_name = 'Company name is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(formData);
      onClose();
    } catch (err) {
      setErrors({ form: 'Failed to save placement.' });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '20px',
      width: '90%',
      maxWidth: '550px',
      maxHeight: '90vh',
      overflow: 'auto',
      padding: '30px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      color: '#333',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#555',
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
    },
    error: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '4px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
      marginTop: '20px',
    },
    saveBtn: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    cancelBtn: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
  };

  // Filter students and supervisors from props
  const studentList = students.filter(u => u.role === 'student');
  const workplaceSupervisors = supervisors.filter(u => u.role === 'workplace_supervisor');
  const academicSupervisors = supervisors.filter(u => u.role === 'academic_supervisor');

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{placement ? 'Edit Placement' : 'Add New Placement'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
        {errors.form && <div style={styles.error}>{errors.form}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Student *</label>
            <select name="student_id" value={formData.student_id} onChange={handleChange} style={styles.select}>
              <option value="">Select student</option>
              {studentList.map(s => (
                <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.username})</option>
              ))}
            </select>
            {errors.student_id && <div style={styles.error}>{errors.student_id}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Company Name *</label>
            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} style={styles.input} />
            {errors.company_name && <div style={styles.error}>{errors.company_name}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Workplace Supervisor</label>
            <select name="workplace_supervisor_id" value={formData.workplace_supervisor_id} onChange={handleChange} style={styles.select}>
              <option value="">Select workplace supervisor</option>
              {workplaceSupervisors.map(s => (
                <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.username})</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Academic Supervisor</label>
            <select name="academic_supervisor_id" value={formData.academic_supervisor_id} onChange={handleChange} style={styles.select}>
              <option value="">Select academic supervisor</option>
              {academicSupervisors.map(s => (
                <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.username})</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Start Date *</label>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} style={styles.input} />
              {errors.start_date && <div style={styles.error}>{errors.start_date}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>End Date *</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} style={styles.input} />
              {errors.end_date && <div style={styles.error}>{errors.end_date}</div>}
            </div>
          </div>
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={styles.saveBtn}>{loading ? 'Saving...' : 'Save Placement'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlacementFormModal;
