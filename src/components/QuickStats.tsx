'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function QuickStats() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [launched,   setLaunched]   = useState<number | null>(null);
  const [weeksIn,    setWeeksIn]    = useState<number>(0);

  useEffect(() => {
    // Weeks since project start (adjust date as needed)
    const startDate = new Date('2026-01-01');
    const now = new Date();
    const weeks = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
    setWeeksIn(weeks);

    const load = async () => {
      const { data: sols } = await supabase
        .from('solutions')
        .select('users, status');

      if (sols) {
        const sum  = sols.reduce((acc, s) => acc + (s.users || 0), 0);
        const live = sols.filter(s => s.status === 'live' || s.status === 'on-track').length;
        setTotalUsers(sum);
        setLaunched(live);
      }
    };
    load();
  }, []);

  const fmt = (n: number | null) =>
    n === null ? '—' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toLocaleString();

  const stats = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      value: launched === null ? '—' : (
        <span>
          {launched}
          <span style={{ fontSize: '18px', color: 'var(--accent)', fontWeight: 500 }}>/100</span>
        </span>
      ),
      label: 'Live Now',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      value: (
        <span>
          {fmt(totalUsers)}
          <span style={{ fontSize: '18px', color: 'var(--accent)', fontWeight: 500 }}>+</span>
        </span>
      ),
      label: 'Users Helped',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      value: (
        <span>
          {weeksIn}
          <span style={{ fontSize: '18px', color: 'var(--accent)', fontWeight: 500 }}>/100</span>
        </span>
      ),
      label: 'Weeks In',
    },
  ];

  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem 64px',
    }}>
      {/* Label */}
      <p style={{
        fontSize: '11px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '1.25rem',
        fontFamily: 'var(--font-body)',
      }}>
        $ quick_stats
      </p>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
      }}>
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '1.4rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              transition: 'border-color 0.2s, transform 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-light)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            {/* Icon */}
            <div style={{
              width: '38px', height: '38px',
              background: 'var(--accent-dim)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {s.icon}
            </div>

            {/* Value */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}>
              {s.value}
            </div>

            {/* Label */}
            <div style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
