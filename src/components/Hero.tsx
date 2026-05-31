'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = 100;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{
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
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        width: '100%',
      }}>

        {/* Left — Content */}
        <div>
          {/* Main heading */}
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

          {/* Sub text */}
          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)',
            color: 'var(--text-secondary)',
            maxWidth: '420px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}>
            Real problems. Real people. Real products. No hype, no fluff — just solutions that work.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <a href="#solutions" style={{
              padding: '13px 30px', fontSize: '15px',
              background: 'var(--accent)', color: 'white',
              borderRadius: '8px', fontWeight: 500,
              transition: 'all 0.2s', display: 'inline-block',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}>
              See All Solutions →
            </a>
            <a href="#newsletter" style={{
              padding: '13px 30px', fontSize: '15px',
              border: '1px solid var(--border-light)', color: 'var(--text-secondary)',
              borderRadius: '8px', fontWeight: 400,
              transition: 'all 0.2s', display: 'inline-block',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              Follow the Journey
            </a>
          </div>

          {/* Live stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'var(--border)',
          }}>
            {[
              { label: 'Total Solutions', value: '100', suffix: '' },
              { label: 'Live Now', value: '2', suffix: '' },
              { label: 'Users Helped', value: count.toLocaleString(), suffix: '+' },
              { label: 'Weeks In', value: '8', suffix: '/100' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'var(--bg-card)', padding: '1.1rem 1rem' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px', fontWeight: 600,
                  color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px',
                }}>
                  {stat.value}<span style={{ color: 'var(--accent)', fontSize: '16px' }}>{stat.suffix}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Illustration */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          maxWidth: '520px',
          justifySelf: 'center',
        }}>
          <Image
            src="/hero-illustration.png"
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