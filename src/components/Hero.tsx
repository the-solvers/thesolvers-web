'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function Hero() {
  const [dark, setDark] = useState(false);
  const [launched, setLaunched] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [animatedUsers, setAnimatedUsers] = useState(0);
  const [weeksIn, setWeeksIn] = useState<number>(0);

  useEffect(() => {
    // Weeks since project start
    const startDate = new Date('2026-01-01');
    const now = new Date();
    const weeks = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
    setWeeksIn(weeks);

    // Fetch from Supabase
    const load = async () => {
      const { data: sols } = await supabase
        .from('solutions')
        .select('users, status');
      if (sols) {
        const live = sols.filter(s => s.status === 'live' || s.status === 'on-track').length;
        const sum = sols.reduce((acc, s) => acc + (s.users || 0), 0);
        setLaunched(live);
        setTotalUsers(sum);
      }
    };
    load();

    // Dark mode observer
    const checkDark = () => setDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Animate users counter when totalUsers loads
  useEffect(() => {
    if (totalUsers === 0) return;
    const duration = 2000;
    const step = totalUsers / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= totalUsers) {
        setAnimatedUsers(totalUsers);
        clearInterval(timer);
      } else {
        setAnimatedUsers(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [totalUsers]);

  const stats = [
    { label: 'Live Now',     value: launched !== null ? `${launched}` : '—', suffix: '/100' },
    { label: 'Users Helped', value: animatedUsers.toLocaleString(),              suffix: '+'    },
    { label: 'Weeks In',     value: `${weeksIn}`,                                suffix: '/100' },
  ];

  return (
    <section className="hero-section" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '100px 3rem 80px',
      maxWidth: '1300px',
      margin: '0 auto',
      position: 'relative',
    }}>

      {/* Accent glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(232,99,58,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Two-column layout */}
      <div className="hero-grid" style={{
      position: 'relative', zIndex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '4rem',
      alignItems: 'center',
      width: '100%',
      }}>

        {/* Left — Content */}
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 600, lineHeight: 1.05,
            letterSpacing: '-0.025em',
            marginBottom: '1.75rem',
            color: 'var(--text-primary)',
          }}>
            100 Real Problems.{' '}
            <span style={{ color: 'var(--accent)' }}>100 Real</span>{' '}
            Solutions.
          </h1>

          <p className="hero-desc" style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)',
            color: 'var(--text-secondary)',
            maxWidth: '420px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}>
            Real problems. Real people. Real products. No hype, no fluff — just solutions that work.
          </p>

          {/* CTA buttons */}
          <div className="hero-cta" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <a
              href="#solutions"
              style={{
                padding: '13px 30px', fontSize: '15px',
                background: 'var(--accent)', color: 'white',
                borderRadius: '8px', fontWeight: 500,
                transition: 'all 0.2s', display: 'inline-block',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
            >
              See All Solutions →
            </a>
            <a
              href="https://github.com/the-solvers"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '13px 30px', fontSize: '15px',
                border: '1px solid var(--border-light)', color: 'var(--text-secondary)',
                borderRadius: '8px', fontWeight: 400,
                transition: 'all 0.2s', display: 'inline-block',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--text-secondary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Follow the Journey
            </a>
          </div>

          <div className="hero-stats" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'var(--border)',
          }}>
            {stats.map(stat => (
              <div key={stat.label} style={{ background: 'var(--bg-card)', padding: '1.1rem 1rem' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px', fontWeight: 600,
                  color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px',
                }}>
                  {stat.value}
                  <span style={{ color: 'var(--accent)', fontSize: '16px' }}>{stat.suffix}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Illustration */}
        <div className="hero-image" style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          maxWidth: '520px',
          justifySelf: 'center',
        }}>
          <Image
            src="/hero-illustration2.png"
            alt="Building real solutions illustration"
            fill
            sizes="(max-width: 768px) 100vw, 520px"
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

      </div>
    </section>
  );
}