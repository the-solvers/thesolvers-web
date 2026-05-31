'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  category?: string;
  tech_stack?: string;
  problem?: string;
  solution?: string;
  week_number?: number;
  valuation_since?: string;
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

export default function SolutionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setSolution(data);
      }
      setLoading(false);
    };
    if (slug) fetch();
  }, [slug]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Loading…</p>
      </div>
      <Footer />
    </>
  );

  if (notFound || !solution) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text-primary)' }}>404</p>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>This solution doesn&apos;t exist.</p>
        <button onClick={() => router.push('/')} style={{
          marginTop: '8px', padding: '10px 24px',
          background: 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: '10px',
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px',
          cursor: 'pointer',
        }}>← Back to Home</button>
      </div>
      <Footer />
    </>
  );

  const st = statusColor[solution.status] || statusColor['planned'];
  const milestones: Milestone[] = Array.isArray(solution.milestones) ? solution.milestones : [];
  const dateStr = solution.last_update || solution.updated_at || new Date().toISOString();
  const techList = solution.tech_stack
    ? Array.isArray(solution.tech_stack)
      ? solution.tech_stack
      : solution.tech_stack.split(',').map((t: string) => t.trim())
    : [];

  return (
    <>
      <Navbar />
      <main className="solution-main" style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 2rem' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2.5rem' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', color: 'var(--text-muted)',
                fontFamily: 'var(--font-body)', padding: 0,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              ← All Solutions
            </button>
            <span style={{ color: 'var(--border-light)', fontSize: '13px' }}>/</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{solution.name}</span>
          </div>

          {/* Hero Section */}
          <div className="solution-hero-card" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '2.5rem',
            marginBottom: '20px',
          }}>
            <div className="solution-hero-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  $ solution_detail
                </p>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                  marginBottom: '12px',
                }}>{solution.name}</h1>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '520px' }}>
                  {solution.tagline}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <span style={{
                  fontSize: '12px', fontWeight: 600,
                  padding: '5px 14px', borderRadius: '100px',
                  background: st.bg, color: st.color,
                  textTransform: 'capitalize', letterSpacing: '0.04em',
                }}>{solution.status}</span>
                {solution.category && (
                  <span style={{
                    fontSize: '12px', fontWeight: 500,
                    padding: '5px 14px', borderRadius: '100px',
                    background: 'var(--bg)', color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}>{solution.category}</span>
                )}
              </div>
            </div>

            {/* Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Build Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{solution.progress ?? 0}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${solution.progress ?? 0}%`,
                  background: 'linear-gradient(90deg, var(--accent), #f07040)',
                  borderRadius: '100px',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="solution-stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '14px',
            marginBottom: '20px',
          }}>
            {[
              { label: 'Users', value: (solution.users ?? 0).toLocaleString(), sub: 'Total active users' },
              { label: 'Valuation', value: solution.valuation || '$0.0M', sub: solution.valuation_since ? `Since ${solution.valuation_since}` : 'Early stage' },
              { label: 'Week', value: solution.week_number ? `Week ${solution.week_number}` : '—', sub: 'Build journey' },
              { label: 'Last Update', value: formatDate(dateStr).split(',')[0], sub: formatDate(dateStr).split(',').slice(1).join(',').trim() },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '1.2rem',
              }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{stat.label}</p>
                <p style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>{stat.value}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Problem & Solution */}
          {(solution.problem || solution.solution) && (
            <div className="solution-problem-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              {solution.problem && (
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '1.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px' }}>⚡</span>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>The Problem</p>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{solution.problem}</p>
                </div>
              )}
              {solution.solution && (
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '1.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px' }}>🔧</span>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>The Solution</p>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{solution.solution}</p>
                </div>
              )}
            </div>
          )}

          {/* Tech Stack + Milestones */}
          <div className="solution-tech-milestones" style={{ display: 'grid', gridTemplateColumns: techList.length > 0 && milestones.length > 0 ? '1fr 1fr' : '1fr', gap: '14px', marginBottom: '20px' }}>

            {/* Tech Stack */}
            {techList.length > 0 && (
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '1.75rem',
              }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                  Tech Stack
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {techList.map((tech, i) => (
                    <span key={i} style={{
                      fontSize: '13px', fontWeight: 500,
                      padding: '6px 14px', borderRadius: '8px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                    }}>{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones */}
            {milestones.length > 0 && (
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '1.75rem',
              }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                  Milestones
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[...milestones].sort((a, b) => (a.done === b.done ? 0 : a.done ? -1 : 1)).map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      {m.done ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a9e6b" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b8782a" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                      )}
                      <span style={{
                        color: m.done ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: m.done ? 'line-through' : 'none',
                      }}>{m.title || m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          {solution.status === 'coming-soon' ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px dashed var(--accent)',
              borderRadius: '16px',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontSize: '14px', fontWeight: 600, color: 'var(--accent)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                ⏳ Coming Soon
              </span>
            </div>
          ) : solution.url && (
            <div style={{
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent)',
              borderRadius: '16px',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Try {solution.name}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Live and ready to use — check it out.
                </p>
              </div>
              <a
                href={solution.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 28px',
                  background: 'var(--accent)',
                  color: '#fff',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(232,99,58,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                Visit Live Site →
              </a>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
