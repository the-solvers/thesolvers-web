'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setError('');

    const { error: sbError } = await supabase
      .from('contacts')
      .insert([{ name: form.name, email: form.email, message: form.message }]);

    setLoading(false);

    if (sbError) {
      setError('Something went wrong. Please try again.');
    } else {
      setSent(true);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    background: 'transparent',
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '64px' }}>

        {/* Page Header */}
        <section className="contact-header" style={{
          padding: '72px 2rem 56px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <p style={{
            fontSize: '11px',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: '1.2rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
          }}>
            Contact
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 5vw, 68px)',
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            maxWidth: '600px',
          }}>
            Say hello.<br />
            <span style={{ color: 'var(--accent)' }}>We're listening.</span>
          </h1>
        </section>

        {/* Main Grid */}
        <section className="contact-grid" style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 2rem 120px',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '5rem',
          alignItems: 'start',
        }}>

          {/* Left — Info */}
          <div>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
            }}>
              Have a problem worth solving? A collaboration idea? Or just want to follow the journey — we'd love to hear from you.
            </p>

            {/* Email block */}
            <div style={{
              paddingTop: '2rem',
              borderTop: '1px solid var(--border)',
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}>
                Email
              </div>
              <a
                href="mailto:solvers.real@gmail.com"
                style={{
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  display: 'block',
                  marginBottom: '4px',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
              >
                solvers.real@gmail.com
              </a>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                We reply within 24 hours
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            {sent ? (
              <div style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                background: 'var(--bg-card)',
              }}>
                <div style={{
                  width: '52px', height: '52px',
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontSize: '22px', color: 'white',
                }}>✓</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.6rem',
                }}>Message sent</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Name + Email row */}
                <div className="contact-name-email" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--text-muted)',
                      marginBottom: '8px',
                    }}>Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                      required
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--text-muted)',
                      marginBottom: '8px',
                    }}>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                  }}>Message</label>
                  <textarea
                    name="message"
                    placeholder="Tell us about the problem you want to solve, or just say hi..."
                    value={form.message}
                    onChange={handleChange}
                    rows={7}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    We'll reply to your email address
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '13px 32px',
                      background: loading ? 'var(--border-light)' : 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'var(--font-body)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'background 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)'; }}
                    onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; }}
                  >
                    {loading ? 'Sending…' : 'Send Message →'}
                  </button>
                </div>
                {error && (
                  <p style={{ fontSize: '13px', color: 'var(--red)', marginTop: '-0.5rem' }}>
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>

        </section>
      </main>
      <Footer />
    </>
  );
}
