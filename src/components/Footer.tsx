'use client';
export default function Footer() {
  return (
    <footer style={{
      padding: '3rem 2rem',
      maxWidth: '1200px', margin: '0 auto',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px', background: 'var(--accent)',
          borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', color: 'white',
        }}>S</div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px' }}>TheSolvers</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>— Building 100 solutions to real problems</span>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
          <a key={s} href="#" style={{ fontSize: '13px', color: 'var(--text-muted)', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            {s}
          </a>
        ))}
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        © 2026 TheSolvers. All rights reserved.
      </p>
    </footer>
  );
}