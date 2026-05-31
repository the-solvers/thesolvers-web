'use client';
import { solutions } from '@/data/solutions';
import SolutionCard from './SolutionCard';

export default function SolutionsGrid() {
  return (
    <section id="solutions" style={{
      maxWidth: '1200px', margin: '0 auto',
      padding: '0 2rem 100px',
    }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '3rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1.5rem',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            $ current_solutions
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500,
          }}>
            What we've built so far
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['All', 'Live', 'Building', 'Planned'] as const).map(f => (
            <button key={f} style={{
              padding: '6px 16px', fontSize: '12px',
              border: '1px solid var(--border)',
              borderRadius: '100px',
              background: f === 'All' ? 'var(--accent)' : 'transparent',
              color: f === 'All' ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1px',
        background: 'var(--border)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {solutions.map(solution => (
          <div key={solution.id} style={{ background: 'var(--bg)' }}>
            <SolutionCard solution={solution} />
          </div>
        ))}

        {/* Placeholder cards for upcoming */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`placeholder-${i}`} style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: '200px', gap: '1rem',
            opacity: 0.4,
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '48px', fontWeight: 600, color: 'var(--border-light)',
            }}>
              {String(solutions.length + i + 1).padStart(2, '0')}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Coming soon...</p>
          </div>
        ))}
      </div>
    </section>
  );
}