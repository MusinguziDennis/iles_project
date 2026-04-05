import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 50px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
    },
    navLinks: {
      display: 'flex',
      gap: '30px',
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '16px',
      transition: 'opacity 0.3s',
    },
    getStartedBtn: {
      backgroundColor: 'white',
      color: '#667eea',
      padding: '10px 25px',
      borderRadius: '25px',
      textDecoration: 'none',
      fontWeight: 'bold',
      transition: 'transform 0.3s',
      display: 'inline-block',
    },
    heroSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '50px 80px',
      color: 'white',
      flexWrap: 'wrap',
    },
    heroContent: {
      flex: 1,
      minWidth: '300px',
    },
    heroTitle: {
      fontSize: '48px',
      marginBottom: '20px',
      lineHeight: '1.2',
    },
    heroSubtitle: {
      fontSize: '18px',
      marginBottom: '30px',
      opacity: 0.9,
      lineHeight: '1.6',
    },
    ctaButton: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      padding: '12px 35px',
      borderRadius: '30px',
      textDecoration: 'none',
      fontWeight: 'bold',
      display: 'inline-block',
      transition: 'transform 0.3s',
      border: 'none',
      cursor: 'pointer',
    },
    heroImage: {
      flex: 1,
      textAlign: 'center',
      minWidth: '300px',
    },
    imagePlaceholder: {
      fontSize: '150px',
    },
    featuresSection: {
      backgroundColor: 'white',
      padding: '60px 80px',
      textAlign: 'center',
    },
    featuresTitle: {
      fontSize: '32px',
      color: '#333',
      marginBottom: '40px',
    },
    featuresGrid: {
      display: 'flex',
      justifyContent: 'center',
      gap: '40px',
      flexWrap: 'wrap',
    },
    featureCard: {
      flex: 1,
      minWidth: '200px',
      maxWidth: '300px',
      padding: '30px',
      backgroundColor: '#f8f9fa',
      borderRadius: '15px',
      transition: 'transform 0.3s',
    },
    featureIcon: {
      fontSize: '50px',
      marginBottom: '20px',
    },
    featureTitle: {
      fontSize: '20px',
      color: '#667eea',
      marginBottom: '15px',
    },
    featureDesc: {
      color: '#666',
      lineHeight: '1.5',
    },
    footer: {
      backgroundColor: '#2c3e50',
      color: 'white',
      textAlign: 'center',
      padding: '30px',
    },
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.logo}>📘 ILES</div>
        <div style={styles.navLinks}>
          <a href="#" style={styles.navLink}>Home</a>
          <a href="#" style={styles.navLink}>About</a>
          <a href="#" style={styles.navLink}>Features</a>
          <a href="#" style={styles.navLink}>Contact</a>
        </div>
        {!user ? (
          <Link to="/login" style={styles.getStartedBtn}>Get Started</Link>
        ) : (
          <Link to="/dashboard" style={styles.getStartedBtn}>Dashboard</Link>
        )}
      </nav>

      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Internship Logbook & Evaluation System
          </h1>
          <p style={styles.heroSubtitle}>
            Track your internship progress, submit weekly logs, and receive feedback 
            from both workplace and academic supervisors — all in one place.
          </p>
          {!user ? (
            <Link to="/register" style={styles.ctaButton}>Get Started Free</Link>
          ) : (
            <Link to="/dashboard" style={styles.ctaButton}>Go to Dashboard</Link>
          )}
        </div>
        <div style={styles.heroImage}>
          <div style={styles.imagePlaceholder}>📊</div>
        </div>
      </div>

      <div style={styles.featuresSection}>
        <h2 style={styles.featuresTitle}>Why Choose ILES?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📝</div>
            <h3 style={styles.featureTitle}>Weekly Logs</h3>
            <p style={styles.featureDesc}>
              Easily create and submit weekly internship logs with our intuitive interface.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👥</div>
            <h3 style={styles.featureTitle}>Dual Supervision</h3>
            <p style={styles.featureDesc}>
              Get feedback from both workplace and academic supervisors in one platform.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📈</div>
            <h3 style={styles.featureTitle}>Progress Tracking</h3>
            <p style={styles.featureDesc}>
              Track your progress with real-time status updates and notifications.
            </p>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; 2026 Internship Logbook & Evaluation System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;