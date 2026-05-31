'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = async () => {
    if (!email) return;
    setLoading(true);
    setError('');

    const { error: sbError } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    setLoading(false);

    if (sbError) {
      if (sbError.code === '23505') {
        setError('You are already subscribed!');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } else {
      setDone(true);
    }
  };

  return (
    <section id="newsletter" className="newsletter-section" style={{
      padding: '80px 2rem',
      overflow: 'hidden',
    }}>
      <div className="newsletter-grid" style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: '3rem',
      }}>

        {/* Left — Text & Form */}
        <div>
          <p style={{
            fontSize: '12px', color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem',
          }}>
            Weekly Dispatch
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 600,
            marginBottom: '1rem', lineHeight: 1.15,
            color: 'var(--text-primary)',
          }}>
            Follow the journey.<br />
            <span style={{ color: 'var(--accent)' }}>Get the real story.</span>
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            fontSize: '15px',
            lineHeight: 1.7,
            maxWidth: '480px',
          }}>
            Every week — what problem we tackled, how we built it, what failed, and what's next. No fluff, no marketing.
          </p>

          {done ? (
            <div style={{
              padding: '16px 24px',
              border: '1px solid rgba(74,158,107,0.3)',
              borderRadius: '10px', color: 'var(--green)',
              background: 'rgba(74,158,107,0.06)',
              display: 'inline-block',
            }}>
              ✓ You're in! First dispatch coming Sunday.
            </div>
          ) : (
            <>
        <div className="newsletter-input-row" style={{ display: 'flex', gap: '8px', maxWidth: '420px' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  style={{
                    flex: 1, padding: '13px 16px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px', color: 'var(--text-primary)',
                    fontSize: '14px', fontFamily: 'var(--font-body)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  style={{
                    padding: '13px 24px',
                    background: loading ? 'var(--border-light)' : 'var(--accent)',
                    color: 'white',
                    border: 'none', borderRadius: '8px',
                    fontSize: '14px', fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                  }}>
                  {loading ? 'Subscribing…' : 'Subscribe →'}
                </button>
              </div>
              {error && (
                <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--red)' }}>
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        {/* Right — Illustration */}
        <div className="newsletter-image" style={{
          position: 'relative',
          width: '320px',
          height: '320px',
          flexShrink: 0,
        }}>
          <Image
            src={dark ? '/newsletter.png' : '/newsletter.png'}
            alt="Newsletter illustration"
            fill
            sizes="320px"
            loading="eager"
            style={{ objectFit: 'contain' }}
          />
        </div>

      </div>
    </section>
  );
}