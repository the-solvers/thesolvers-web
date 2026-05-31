'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);

    // Always default to light mode — remove any saved dark theme
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    setDark(false);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setDark(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 3rem',
      height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled
        ? dark
          ? 'rgba(15, 14, 13, 0.95)'
          : 'rgba(237, 234, 227, 0.94)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.07)' : 'none',
      transition: 'all 0.35s ease',
    }}>

      {/* Wordmark Logo */}
      <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '20px',
          fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px',
        }}>The</span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '20px',
          fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.5px',
        }}>Solvers</span>
      </a>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
        {['Home', 'About', 'Blog', 'Contact'].map(item => (
          <a
            key={item}
            href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
            style={{
              fontSize: '14px', fontWeight: 500,
              color: 'var(--text-secondary)',
              padding: '7px 16px', borderRadius: '8px',
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

      {/* Right side — theme toggle + S icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            width: '34px', height: '34px',
            background: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          }}
        >
          {dark ? (
            /* Sun icon */
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            /* Moon icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

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

      </div>
    </nav>
  );
}