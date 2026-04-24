import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const featureInterval = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    featureInterval.current = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(featureInterval.current);
  }, []);

  const navScrolled = scrollY > 40;

  const features = [
    {
      icon: '📝',
      title: 'Weekly Log Submission',
      desc: 'Students create structured weekly reports, save drafts, and submit when ready. The system guides every step.',
      color: '#6366f1',
    },
    {
      icon: '🏢',
      title: 'Workplace Supervision',
      desc: 'Workplace supervisors review logs, leave detailed feedback, and track each student\'s on-site progress.',
      color: '#0ea5e9',
    },
    {
      icon: '🎓',
      title: 'Academic Oversight',
      desc: 'Academic supervisors give final approvals, ensuring both university and industry standards are met.',
      color: '#10b981',
    },
    {
      icon: '🔄',
      title: 'Enforced Workflow',
      desc: 'Logs follow a strict Draft → Submitted → Reviewed → Approved pipeline with role-based access control.',
      color: '#f59e0b',
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      desc: 'Real-time alerts keep students and supervisors informed at every stage of the review process.',
      color: '#ec4899',
    },
    {
      icon: '📊',
      title: 'Reports & Analytics',
      desc: 'Generate detailed performance reports, approval rates, and internship summaries with one click.',
      color: '#8b5cf6',
    },
  ];

  const workflow = [
    { step: '01', title: 'Student Submits', desc: 'Student writes and submits a weekly log entry for review.', icon: '✍️', color: '#6366f1' },
    { step: '02', title: 'Workplace Reviews', desc: 'Workplace supervisor reads, comments, and marks as reviewed.', icon: '👁️', color: '#0ea5e9' },
    { step: '03', title: 'Academic Approves', desc: 'Academic supervisor gives final approval, locking the log.', icon: '✅', color: '#10b981' },
    { step: '04', title: 'Admin Oversees', desc: 'Admin manages users, placements, and generates reports.', icon: '🛡️', color: '#f59e0b' },
  ];

  const testimonials = [
    { name: 'Alice Nambi', role: 'Student Intern', text: 'ILES made it so easy to track my internship progress. My supervisors could see my work instantly!', avatar: '👩🏾‍💻' },
    { name: 'Dr. Peter Wakholi', role: 'Academic Supervisor', text: 'I can now manage all my students\' logs in one place. The approval workflow is seamless.', avatar: '👨🏾‍🏫' },
    { name: 'Amos Karuhanga', role: 'Workplace Supervisor', text: 'Reviewing logs and giving feedback has never been this straightforward. Highly recommended.', avatar: '👨🏾‍💼' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#ffffff', color: '#0f172a', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: navScrolled ? '14px 60px' : '22px 60px',
        background: navScrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: navScrolled ? 'blur(16px)' : 'none',
        borderBottom: navScrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        boxShadow: navScrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>📘</div>
          <span style={{ fontSize: '20px', fontWeight: '800', color: navScrolled ? '#0f172a' : 'white', letterSpacing: '-0.5px' }}>ILES</span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '32px' }}>
          {['Features', 'How It Works', 'Testimonials'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{
              color: navScrolled ? '#475569' : 'rgba(255,255,255,0.85)',
              textDecoration: 'none', fontSize: '14px', fontWeight: '500',
              transition: 'color 0.2s',
            }}>{item}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!user ? (
            <>
              <Link to="/login" style={{
                color: navScrolled ? '#6366f1' : 'white',
                textDecoration: 'none', fontSize: '14px', fontWeight: '600',
                padding: '8px 18px', borderRadius: '8px',
                border: navScrolled ? '1.5px solid #6366f1' : '1.5px solid rgba(255,255,255,0.5)',
                transition: 'all 0.2s',
              }}>Sign In</Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
                padding: '9px 22px', borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(99,102,241,0.45)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>Get Started Free</Link>
            </>
          ) : (
            <Link to="/dashboard" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
              padding: '9px 22px', borderRadius: '8px',
            }}>Go to Dashboard →</Link>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 40%, #312e81 70%, #1e1b4b 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '140px 60px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '15%', left: '8%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: '100px', padding: '6px 18px', marginBottom: '32px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', display: 'inline-block', boxShadow: '0 0 8px #6366f1' }} />
            <span style={{ color: '#a5b4fc', fontSize: '13px', fontWeight: '600' }}>University Internship Management Platform</span>
          </div>

          <h1 style={{ fontSize: '72px', fontWeight: '900', color: 'white', lineHeight: '1.08', marginBottom: '28px', letterSpacing: '-2px' }}>
            Manage Internships<br />
            <span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Like Never Before
            </span>
          </h1>

          <p style={{ fontSize: '19px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', marginBottom: '48px', maxWidth: '620px', margin: '0 auto 48px' }}>
            ILES connects students, workplace supervisors, and academic supervisors in one seamless platform — from weekly log submission to final approval.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={user ? '/dashboard' : '/register'} style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', padding: '16px 40px', borderRadius: '12px',
              textDecoration: 'none', fontWeight: '700', fontSize: '16px',
              boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              {user ? 'Go to Dashboard' : 'Start for Free'} <span>→</span>
            </Link>
            <Link to="/login" style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', padding: '16px 40px', borderRadius: '12px',
              textDecoration: 'none', fontWeight: '600', fontSize: '16px',
              backdropFilter: 'blur(8px)',
            }}>
              Sign In
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            {[['🔒', 'Role-Based Access'], ['⚡', 'Real-Time Updates'], ['📱', 'Fully Responsive'], ['🌍', 'Web-Based']].map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '500' }}>
                <span>{icon}</span><span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { value: '4', label: 'User Roles', sub: 'Student, Supervisor, Admin' },
            { value: '4', label: 'Log Stages', sub: 'Draft → Approved' },
            { value: '100%', label: 'Web Based', sub: 'No installation needed' },
            { value: '∞', label: 'Weekly Logs', sub: 'Unlimited submissions' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '40px 20px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid #e2e8f0' : 'none',
            }}>
              <div style={{ fontSize: '40px', fontWeight: '900', color: '#6366f1', letterSpacing: '-1px' }}>{s.value}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div id="features" style={{ background: 'white', padding: '120px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Features</span>
            <h2 style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', marginTop: '12px', marginBottom: '16px', letterSpacing: '-1.5px' }}>
              Everything in one place
            </h2>
            <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>
              Designed for universities, built for real internship workflows.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i}
                onMouseEnter={() => { setActiveFeature(i); clearInterval(featureInterval.current); }}
                onMouseLeave={() => {
                  featureInterval.current = setInterval(() => setActiveFeature(p => (p + 1) % features.length), 3000);
                }}
                style={{
                  borderRadius: '20px', padding: '36px 32px',
                  border: activeFeature === i ? `2px solid ${f.color}` : '2px solid #f1f5f9',
                  background: activeFeature === i ? `${f.color}08` : 'white',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  boxShadow: activeFeature === i ? `0 16px 48px ${f.color}20` : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: activeFeature === i ? 'translateY(-4px)' : 'none',
                }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `${f.color}15`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '24px', marginBottom: '20px',
                  border: `1px solid ${f.color}25`,
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div id="how-it-works" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0f0c29 100%)', padding: '120px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Workflow</span>
            <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginTop: '12px', marginBottom: '16px', letterSpacing: '-1.5px' }}>How It Works</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', maxWidth: '480px', margin: '0 auto' }}>
              A clear, enforced process from log creation to final approval.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {workflow.map((w, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {i < workflow.length - 1 && (
                  <div style={{ position: 'absolute', top: '36px', left: 'calc(50% + 36px)', right: '-10px', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
                )}
                <div style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px', padding: '32px 24px', textAlign: 'center',
                  backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1,
                  transition: 'all 0.3s',
                }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${w.color}, ${w.color}99)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', margin: '0 auto 20px',
                    boxShadow: `0 8px 24px ${w.color}50`,
                  }}>{w.icon}</div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: w.color, letterSpacing: '2px', marginBottom: '8px' }}>STEP {w.step}</div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'white', marginBottom: '10px' }}>{w.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div id="testimonials" style={{ background: '#f8fafc', padding: '120px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Testimonials</span>
            <h2 style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', marginTop: '12px', letterSpacing: '-1.5px' }}>Loved by users</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '20px', padding: '36px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: '#f59e0b', fontSize: '16px' }}>★</span>)}
                </div>
                <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8', marginBottom: '28px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{t.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        padding: '100px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-40px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '52px', fontWeight: '900', color: 'white', marginBottom: '20px', letterSpacing: '-1.5px' }}>
            Ready to get started?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', marginBottom: '44px', maxWidth: '480px', margin: '0 auto 44px', lineHeight: '1.7' }}>
            Join ILES and bring structure, transparency, and efficiency to your internship programme.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              background: 'white', color: '#6366f1',
              padding: '16px 40px', borderRadius: '12px',
              textDecoration: 'none', fontWeight: '800', fontSize: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}>Create Free Account</Link>
            <Link to="/login" style={{
              background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)',
              color: 'white', padding: '16px 40px', borderRadius: '12px',
              textDecoration: 'none', fontWeight: '600', fontSize: '16px',
              backdropFilter: 'blur(8px)',
            }}>Sign In</Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0f172a', padding: '60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px', marginBottom: '48px' }}>
            <div style={{ maxWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📘</div>
                <span style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>ILES</span>
              </div>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7' }}>
                Internship Logbook & Evaluation System — built to streamline university internship management.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
              {[
                { title: 'Product', links: ['Features', 'How It Works', 'Pricing'] },
                { title: 'Company', links: ['About', 'Contact', 'Privacy Policy'] },
                { title: 'Roles', links: ['Students', 'Supervisors', 'Administrators'] },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ color: 'white', fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>{col.title}</div>
                  {col.links.map(l => (
                    <div key={l} style={{ marginBottom: '10px' }}>
                      <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>{l}</a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: '#334155', fontSize: '14px', margin: 0 }}>© 2026 ILES. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy', 'Terms', 'Cookies'].map(l => (
                <a key={l} href="#" style={{ color: '#334155', textDecoration: 'none', fontSize: '14px' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
