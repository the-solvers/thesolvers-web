'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getMilestoneProgress } from '@/lib/progress';

type Milestone = { title?: string; label?: string; done: boolean };

type Solution = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  status: string;
  progress: number;
  users: number;
  valuation: string;
  milestones: Milestone[];
  url?: string;
  updated_at: string;
  last_update: string;
};

const statusColor: Record<string, { bg: string; color: string }> = {
  'on-track': { bg: 'rgba(74,158,107,0.15)', color: '#4a9e6b' },
  live:       { bg: 'rgba(74,158,107,0.15)', color: '#4a9e6b' },
  building:   { bg: 'rgba(184,120,42,0.15)', color: '#b8782a' },
  planned:    { bg: 'rgba(138,136,128,0.15)', color: '#8a8880' },
  paused:     { bg: 'rgba(201,74,74,0.15)',   color: '#c94a4a' },
  'coming-soon': { bg: 'var(--accent-dim)', color: 'var(--accent)' },
};

const selectStyle: React.CSSProperties = {
  padding: '8px 32px 8px 12px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-light)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontSize: '13px',
  fontFamily: 'var(--font-body)',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(128,128,128,0.8)' stroke-width='2'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
};

export default function SolutionsGrid() {
  const [solutions, setSolutions]     = useState<Solution[]>([]);
  const [loading, setLoading]         = useState(true);

  // Filters
  const [yearFilter,   setYearFilter]   = useState('All Years');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('solutions')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });
      setSolutions(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // helper: pick the best date field
  const getYear = (s: Solution) => {
    const raw = s.last_update || s.updated_at;
    if (!raw) return null;
    return new Date(raw).getFullYear();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Apply filters
  const filtered = solutions.filter(s => {
    // Year filter
    if (yearFilter !== 'All Years') {
      const yr = getYear(s);
      if (yr?.toString() !== yearFilter) return false;
    }
    // Status filter
    if (statusFilter !== 'All') {
      if (s.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    }
    return true;
  });

  return (
    <section id="solutions" className="solutions-section" style={{ padding: '0 2rem 100px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <div className="solutions-header" style={{
      display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: '2.5rem',
      flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            $ current_solutions
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, color: 'var(--text-primary)' }}>
            What we&apos;ve built so far
          </h2>
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

          {/* Year */}
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={selectStyle}>
            <option>All Years</option>
            <option>2025</option>
            <option>2026</option>
          </select>

          {/* Status */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
            <option value="All">All Status</option>
            <option value="live">Live</option>
            <option value="building">Building</option>
            <option value="planned">Planned</option>
            <option value="on-track">On Track</option>
            <option value="paused">Paused</option>
            <option value="coming-soon">Coming Soon</option>
          </select>

        </div>
      </div>

      {/* Main Cards Grid */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          No solutions match this filter.
        </p>
      ) : (
        <div className="solutions-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '28px',
        }}>
          {filtered.map(s => {
            const st = statusColor[s.status] || statusColor['planned'];
            const milestones: Milestone[] = Array.isArray(s.milestones) ? s.milestones : [];
            const progress = getMilestoneProgress(milestones, s.progress ?? 0);
            const dateStr = s.last_update || s.updated_at || new Date().toISOString();
            const isComingSoon = s.status === 'coming-soon';

            /* ── COMING SOON CARD ─────────────────────────────── */
            if (isComingSoon) {
              return (
                <div key={s.id}
                  style={{
                    position: 'relative',
                    borderRadius: '16px',
                    padding: '2px',
                    background: 'linear-gradient(135deg, var(--accent), #f07040, var(--accent))',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease infinite',
                    height: '100%',
                    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
                    zIndex: 1,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03) translateY(-5px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 50px rgba(232,99,58,0.28)';
                    (e.currentTarget as HTMLDivElement).style.zIndex = '3';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLDivElement).style.zIndex = '1';
                  }}
                >
                  <style>{`
                    @keyframes gradientShift {
                      0%   { background-position: 0% 50%; }
                      50%  { background-position: 100% 50%; }
                      100% { background-position: 0% 50%; }
                    }
                    @keyframes blink {
                      0%, 100% { opacity: 1; }
                      50%       { opacity: 0.35; }
                    }
                  `}</style>

                  {/* Inner card — same layout as regular card */}
                  <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.1rem',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>

                    {/* Row 1: Name + COMING SOON badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                            {s.name}
                          </h3>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{s.tagline}</p>
                      </div>
                      {/* Animated badge replacing the status pill */}
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px', flexShrink: 0,
                        background: 'var(--accent)', color: '#fff',
                        fontSize: '10px', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '4px 10px', borderRadius: '100px',
                        whiteSpace: 'nowrap',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'blink 1.2s ease-in-out infinite', flexShrink: 0 }} />
                        Coming Soon
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        <span>Progress</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{progress}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: 'linear-gradient(90deg, var(--accent), #f07040)',
                          borderRadius: '100px',
                        }} />
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                          Users
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1 }}>
                          {(s.users ?? 0).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Valuation</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>
                          {s.valuation || '$0.0M'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {formatDate(dateStr).split(',').slice(0, 2).join(',')}
                        </div>
                      </div>
                    </div>

                    {/* Milestones */}
                    {milestones.length > 0 && (
                      <div style={{ flexGrow: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Milestones</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                          {[...milestones].sort((a, b) => (a.done === b.done ? 0 : a.done ? -1 : 1)).map((m, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                              {m.done ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a9e6b" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8782a" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              )}
                              <span style={{ color: m.done ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: m.done ? 'line-through' : 'none' }}>
                                {m.title || m.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {milestones.length === 0 && <div style={{ flexGrow: 1 }} />}

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Last update &nbsp; {formatDate(dateStr)}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>Stay tuned →</span>
                    </div>

                  </div>
                </div>
              );
            }

            /* ── REGULAR CARD ─────────────────────────────────── */
            return (
              <div key={s.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '1.1rem',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, box-shadow 0.3s ease',
                height: '100%',
                position: 'relative',
                zIndex: 1,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03) translateY(-5px)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-light)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
                (e.currentTarget as HTMLDivElement).style.zIndex = '3';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) translateY(0)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLDivElement).style.zIndex = '1';
              }}>

                {/* Row 1: Name + status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {s.name}
                      </h3>
                      {s.url && (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', display: 'flex' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{s.tagline}</p>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap',
                    padding: '4px 10px', borderRadius: '100px',
                    background: st.bg, color: st.color,
                    textTransform: 'capitalize', letterSpacing: '0.04em',
                  }}>{s.status}</span>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>Progress</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{progress}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, var(--accent), #f07040)',
                      borderRadius: '100px',
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      Users
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>
                      {(s.users ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Valuation</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>
                      {s.valuation || '$0.0M'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {formatDate(dateStr).split(',').slice(0, 2).join(',')}
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                {milestones.length > 0 && (
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Milestones</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {[...milestones].sort((a, b) => (a.done === b.done ? 0 : a.done ? -1 : 1)).map((m, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          {m.done ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a9e6b" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8782a" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                          )}
                          <span style={{
                            color: m.done ? 'var(--text-secondary)' : 'var(--text-primary)',
                            textDecoration: m.done ? 'line-through' : 'none',
                          }}>{m.title || m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {milestones.length === 0 && <div style={{ flexGrow: 1 }} />}

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Last update &nbsp; {formatDate(dateStr)}
                  </span>
                  <a href={`/solutions/${s.slug}`} style={{
                    fontSize: '13px', fontWeight: 600, color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none',
                  }}>
                    View Details →
                  </a>
                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}
