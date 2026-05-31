'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Milestone = { title?: string; label?: string; done: boolean };

type Solution = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  status: string;
  progress: number;
  users: number;
  monthly_growth: number;
  valuation: string;
  milestones: Milestone[];
  url?: string;
  updated_at: string;
};

const statusColor: Record<string, { bg: string; color: string }> = {
  'on-track': { bg: 'rgba(74,158,107,0.15)', color: '#4a9e6b' },
  live:       { bg: 'rgba(74,158,107,0.15)', color: '#4a9e6b' },
  building:   { bg: 'rgba(184,120,42,0.15)', color: '#b8782a' },
  planned:    { bg: 'rgba(138,136,128,0.15)', color: '#8a8880' },
};

export default function SolutionsGrid() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [comingSoon, setComingSoon] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('solutions')
        .select('*')
        .order('created_at', { ascending: true });
      setSolutions(data || []);
      setLoading(false);
    };
    const fetchComingSoon = async () => {
      const { data } = await supabase
        .from('coming_soon')
        .select('name')
        .order('created_at', { ascending: true });
      setComingSoon((data || []).map((d: { name: string }) => d.name));
    };
    fetchData();
    fetchComingSoon();
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <section id="solutions" style={{ padding: '0 2rem 100px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{
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
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading…</p>
      ) : solutions.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          No solutions added yet. Go to /createbuilt to add the first one!
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}>
          {solutions.map(s => {
            const st = statusColor[s.status] || statusColor['planned'];
            const milestones: Milestone[] = Array.isArray(s.milestones) ? s.milestones : [];
            return (
              <div key={s.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '1.1rem',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-light)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
              }}>

                {/* Row 1: Name + status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
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

                {/* Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>Progress</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.progress ?? 0}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${s.progress ?? 0}%`,
                      background: 'linear-gradient(90deg, var(--accent), #f07040)',
                      borderRadius: '100px',
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>

                {/* Stats grid */}
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
                    <div style={{ fontSize: '12px', color: s.monthly_growth > 0 ? 'var(--green)' : 'var(--text-muted)' }}>
                      {s.monthly_growth > 0 ? `↗ +${s.monthly_growth}%` : `→ +0%`} this month
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Valuation</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>
                      {s.valuation || '$0.0M'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Since {formatDate(s.updated_at || new Date().toISOString()).split(',')[1]?.trim() || 'Now'}</div>
                  </div>
                </div>

                {/* Milestones */}
                {milestones.length > 0 && (
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Milestones</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {milestones.map((m, i) => (
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
                            fontSize: '13px',
                          }}>{m.title || m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Last update &nbsp; {formatDate(s.updated_at || new Date().toISOString())}
                  </span>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: '13px', fontWeight: 600, color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none',
                    }}>
                      View Details →
                    </a>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Coming Soon Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px',
        marginTop: '16px',
      }}>
        {comingSoon.map((item, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-light)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '160px',
            gap: '12px',
            opacity: 0.7,
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              textAlign: 'center',
            }}>{item}</h3>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              background: 'var(--accent-dim)',
              padding: '4px 12px',
              borderRadius: '100px',
            }}>Coming Soon</span>
          </div>
        ))}
      </div>

    </section>
  );
}