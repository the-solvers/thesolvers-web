'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const principles = [
  {
    number: '01',
    title: 'Real problems only',
    desc: 'We do not build solutions looking for problems. Every product starts with a frustration someone actually experiences.',
  },
  {
    number: '02',
    title: 'Ship fast, learn faster',
    desc: 'A working product in 7 days beats a perfect product in 6 months. We ship, measure, and improve.',
  },
  {
    number: '03',
    title: 'Everything in public',
    desc: 'The wins, the failures, the pivots — all of it is documented and shared. No filters, no marketing spin.',
  },
  {
    number: '04',
    title: 'Simplicity over complexity',
    desc: 'The best solution is the one that solves the problem with the least friction. We resist over-engineering.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '64px' }}>

        {/* ── Hero ── */}
        <section style={{ padding: '80px 4rem 72px', maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.5rem',
          }}>About TheSolvers</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'end' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 5.5vw, 72px)',
              fontWeight: 600, letterSpacing: '-0.025em',
              lineHeight: 1.05, color: 'var(--text-primary)',
            }}>
              We build what<br />
              <span style={{ color: 'var(--accent)' }}>people need,</span><br />
              not what trends.
            </h1>
            <div>
              <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                TheSolvers is a challenge: find 100 real problems that real people face, then build 100 products that actually solve them — one per week, for 100 weeks.
              </p>
              <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                No VC funding. No hype cycle. No "move fast and break things." Just consistent, honest problem-solving, documented in public.
              </p>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 4rem' }}>
          <div style={{ height: '1px', background: 'var(--border)' }} />
        </div>

        {/* ── Stats strip ── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 4rem' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px', background: 'var(--border)',
            border: '1px solid var(--border)', borderTop: 'none',
          }}>
            {[
              { value: '100', label: 'Problems to solve' },
              { value: '8', label: 'Weeks completed' },
              { value: '2', label: 'Live products' },
              { value: '100+', label: 'Users reached' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg)', padding: '2.5rem 2rem' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '44px',
                  fontWeight: 600, letterSpacing: '-0.02em',
                  color: 'var(--text-primary)', lineHeight: 1, marginBottom: '8px',
                }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Story ── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '5rem' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '32px',
                fontWeight: 600, letterSpacing: '-0.02em',
                color: 'var(--text-primary)', lineHeight: 1.2,
              }}>The Story</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.85 }}>
                It started with frustration. Every startup we saw was chasing the same things — AI wrappers, crypto, the next big trend. Nobody was asking the simple question: <em style={{ color: 'var(--text-primary)' }}>what actually bothers people every day?</em>
              </p>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.85 }}>
                We had notebooks full of problems we had personally faced — a friend who missed his medicine, a group trip where splitting the bill turned into a week-long argument, a student who learned everything but could not find one real project to work on.
              </p>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.85 }}>
                These were not billion-dollar ideas. They were real problems. And nobody was building for them. So we decided to.
              </p>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.85 }}>
                100 problems. 100 products. 100 weeks. That is TheSolvers.
              </p>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 4rem' }}>
          <div style={{ height: '1px', background: 'var(--border)' }} />
        </div>

        {/* ── Principles ── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '5rem' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '32px',
                fontWeight: 600, letterSpacing: '-0.02em',
                color: 'var(--text-primary)', lineHeight: 1.2,
              }}>How We Work</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {principles.map((p, i) => (
                <div key={p.number} style={{
                  display: 'grid', gridTemplateColumns: '48px 1fr',
                  gap: '1.5rem', padding: '1.75rem 0',
                  borderBottom: i < principles.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'start',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '13px',
                    fontWeight: 600, color: 'var(--accent)',
                    letterSpacing: '0.05em', paddingTop: '4px',
                  }}>{p.number}</span>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontSize: '18px',
                      fontWeight: 600, color: 'var(--text-primary)',
                      marginBottom: '6px', letterSpacing: '-0.01em',
                    }}>{p.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 4rem' }}>
          <div style={{ height: '1px', background: 'var(--border)' }} />
        </div>

        {/* ── CTA ── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 4rem 100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 600, letterSpacing: '-0.02em',
                color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.1,
              }}>Follow the journey.</h2>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                Every week is documented — what we built, what failed, and what is next.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/blog" style={{
                padding: '13px 28px', fontSize: '14px', fontWeight: 500,
                background: 'var(--accent)', color: 'white',
                borderRadius: '8px', textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}>
                Read the Blog →
              </Link>
              <a href="https://github.com/the-solvers" target="_blank" rel="noopener noreferrer" style={{
                padding: '13px 28px', fontSize: '14px', fontWeight: 500,
                border: '1px solid var(--border-light)', color: 'var(--text-secondary)',
                borderRadius: '8px', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                GitHub
              </a>
              <Link href="/contact" style={{
                padding: '13px 28px', fontSize: '14px', fontWeight: 500,
                border: '1px solid var(--border-light)', color: 'var(--text-secondary)',
                borderRadius: '8px', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
