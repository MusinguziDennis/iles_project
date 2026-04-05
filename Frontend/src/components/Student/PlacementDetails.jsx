import React from 'react';

const PlacementDetails = ({ placement }) => {
  if (!placement) {
    return (
      <div style={styles.noData}>
        <p>No placement details available. Please contact your administrator.</p>
      </div>
    );
  }

  const styles = {
    container: {
      padding: '10px',
    },
    header: {
      marginBottom: '25px',
    },
    title: {
      fontSize: '24px',
      color: '#333',
      marginBottom: '5px',
    },
    subtitle: {
      color: '#666',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    infoCard: {
      backgroundColor: '#f8f9fa',
      borderRadius: '15px',
      padding: '20px',
    },
    cardTitle: {
      fontSize: '18px',
      color: '#667eea',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    infoRow: {
      marginBottom: '12px',
    },
    label: {
      fontWeight: 'bold',
      color: '#555',
      display: 'block',
      marginBottom: '5px',
      fontSize: '12px',
      textTransform: 'uppercase',
    },
    value: {
      color: '#333',
      fontSize: '16px',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      backgroundColor: '#d4edda',
      color: '#155724',
    },
    noData: {
      textAlign: 'center',
      padding: '40px',
      color: '#999',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Internship Placement</h3>
        <p style={styles.subtitle}>Your internship assignment details</p>
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <div style={styles.cardTitle}>
            <span>🏢</span> Company Information
          </div>
          <div style={styles.infoRow}>
            <div style={styles.label}>Company Name</div>
            <div style={styles.value}>{placement.company_name}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.label}>Status</div>
            <div style={styles.statusBadge}>{placement.status || 'Active'}</div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.cardTitle}>
            <span>👨‍💼</span> Workplace Supervisor
          </div>
          <div style={styles.infoRow}>
            <div style={styles.label}>Name</div>
            <div style={styles.value}>{placement.workplace_supervisor}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.label}>Email</div>
            <div style={styles.value}>{placement.workplace_supervisor_email}</div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.cardTitle}>
            <span>👩‍🏫</span> Academic Supervisor
          </div>
          <div style={styles.infoRow}>
            <div style={styles.label}>Name</div>
            <div style={styles.value}>{placement.academic_supervisor}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.label}>Email</div>
            <div style={styles.value}>{placement.academic_supervisor_email}</div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.cardTitle}>
            <span>📅</span> Internship Period
          </div>
          <div style={styles.infoRow}>
            <div style={styles.label}>Start Date</div>
            <div style={styles.value}>{placement.start_date}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.label}>End Date</div>
            <div style={styles.value}>{placement.end_date}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDetails;