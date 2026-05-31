'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type StatCard = {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
};

export default function QuickStats() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [launched,   setLaunched]   = useState<number | null>(null);
  const [total,      setTotal]      = useState<number | null>(null);
  const [comingSoon, setComingSoon] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: sols } = await supabase
        .from('solutions')
        .select('users, status');

      if (sols) {
        const sum  = sols.reduce((acc, s) => acc + (s.users || 0), 0);
        const live = sols.filter(s => s.status === 'live' || s.status === 'on-track').length;
        setTotalUsers(sum);
        setLaunched(live);
        setTotal(sols.length);
      }

      const { count } = await supabase
        .from('coming_soon')
        .select('*', { count: 'exact', head: true });
      setComingSoon(count ?? 0);
    };
    load();
  }, []);

  const fmt = (n: number | null) =>
    n === null ? '—' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toLocaleString();

  const stats: StatCard[] = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
      value: fmt(totalUsers),
      label: 'Total Users',
    },
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
      label: 'Solutions Launched',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      value: total === null ? '—' : `${total}`,
      label: 'Products Built',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      value: comingSoon === null ? '—' : `${comingSoon}`,
      label: 'Coming Soon',
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
