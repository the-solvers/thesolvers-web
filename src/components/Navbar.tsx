'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 3rem',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',

      background: scrolled ? 'rgba(237, 234, 227, 0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.07)' : 'none',
      transition: 'all 0.35s ease',
    }}>

      {/* Wordmark Logo */}
      <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px',
        }}>The</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--accent)',
          letterSpacing: '-0.5px',
        }}>Solvers</span>
      </a>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
        {['Home', 'About', 'Blog', 'Contact'].map(item => (
          <a
            key={item}
            href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              padding: '7px 16px',
              borderRadius: '8px',
              transition: 'all 0.18s ease',
              letterSpacing: '0.01em',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {item}
          </a>
        ))}
      </div>

      {/* S Icon */}
      <div style={{
        width: '34px', height: '34px',
        background: 'var(--accent)',
        borderRadius: '9px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px',
        color: 'white',
        boxShadow: '0 2px 8px rgba(232,99,58,0.35)',
      }}>S</div>

    </nav>
  );
}