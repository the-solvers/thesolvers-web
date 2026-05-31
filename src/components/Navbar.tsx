'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);

    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDark(false);
    }

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setDark(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: dark ? '#0f0e0d' : '#EDEAE3',
        backdropFilter: 'none',
        boxShadow: 'none',
        borderBottom: 'none',
        outline: 'none',
        transition: 'background 0.35s ease',
      }}>

        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px', zIndex: 101 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>The</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.5px' }}>Solvers</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
          {['Home', 'About', 'Blog', 'Contact'].map(item => {
            const href = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
            const isActive = item === 'Home' ? pathname === '/' : pathname.startsWith(`/${item.toLowerCase()}`);
            return (
              <a
                key={item}
                href={href}
                style={{
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-hover)' : 'transparent',
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
                  e.currentTarget.style.color = isActive ? 'var(--text-primary)' : 'var(--text-secondary)';
                  e.currentTarget.style.background = isActive ? 'var(--bg-hover)' : 'transparent';
                }}
              >
                {item}
              </a>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 101 }}>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: '34px', height: '34px',
              background: scrolled || menuOpen ? 'var(--bg-hover)' : 'transparent',
              border: scrolled || menuOpen ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: 'var(--text-secondary)',
            }}
          >
            {dark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* S Icon — desktop only */}
          <div className="nav-s-icon" style={{
            width: '34px', height: '34px',
            background: 'var(--accent)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px',
            color: 'white',
            boxShadow: '0 2px 8px rgba(232,99,58,0.35)',
          }}>S</div>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'none',
              width: '34px', height: '34px',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              borderRadius: '9px',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              flexDirection: 'column', gap: '5px', padding: '8px',
            }}
          >
            <span style={{
              display: 'block', width: '100%', height: '1.5px',
              background: 'var(--text-primary)',
              transition: 'all 0.3s',
              transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '100%', height: '1.5px',
              background: 'var(--text-primary)',
              transition: 'all 0.3s',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: '100%', height: '1.5px',
              background: 'var(--text-primary)',
              transition: 'all 0.3s',
              transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
            }} />
          </button>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99,
          background: dark ? 'rgba(15,14,13,0.98)' : 'rgba(237,234,227,0.98)',
          backdropFilter: 'blur(20px)',
          padding: '1.5rem 2rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '8px',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-110%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {['Home', 'About', 'Blog', 'Contact'].map(item => (
          <a
            key={item}
            href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: '18px', fontWeight: 500,
              color: 'var(--text-primary)',
              padding: '14px 16px', borderRadius: '10px',
              fontFamily: 'var(--font-body)',
              transition: 'background 0.18s',
              borderBottom: '1px solid var(--border)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {item}
          </a>
        ))}
      </div>
    </>
  );
}
