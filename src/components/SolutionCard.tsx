'use client';
import { Solution } from '@/data/solutions';

const statusConfig = {
  live: { label: 'Live', color: 'var(--green)' },
  building: { label: 'Building', color: 'var(--amber)' },
  planned: { label: 'Planned', color: 'var(--text-muted)' },
};

const categoryColors: Record<string, string> = {
  Productivity: '#4a7eb5',
  Health: '#4a9e6b',
  Finance: '#c9883a',
  Education: '#8b5cf6',
  'Developer Tools': '#e8633a',
  Social: '#e84393',
  Environment: '#3a9e8b',
};

export default function SolutionCard({ solution }: { solution: Solution }) {
  const status = statusConfig[solution.status];
  const catColor = categoryColors[solution.category] || 'var(--text-muted)';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '1rem',
      transition: 'border-color 0.2s, transform 0.2s',
      cursor: 'pointer',
      position: 'relative', overflow: 'hidden',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-light)';
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
    }}>

      {/* Number watermark */}
      <div style={{
        position: 'absolute', top: '-10px', right: '16px',
        fontFamily: 'var(--font-display)',
        fontSize: '80px', fontWeight: 600,
        color: 'var(--border)', lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none',
      }}>
        {String(solution.number).padStart(2, '0')}
      </div>

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '11px', fontWeight: 500,
          color: catColor,
          background: `${catColor}18`,
          padding: '3px 10px', borderRadius: '100px',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {solution.category}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: status.color }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: status.color,
            boxShadow: solution.status === 'live' ? `0 0 6px ${status.color}` : 'none',
          }} />
          {status.label}
        </span>
      </div>

      {/* Name */}
      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px', fontWeight: 500,
          marginBottom: '4px',
        }}>
          {solution.name}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--accent)', fontStyle: 'italic' }}>
          "{solution.tagline}"
        </p>
      </div>

      {/* Problem */}
      <div style={{
        background: 'rgba(232,99,58,0.06)',
        border: '1px solid rgba(232,99,58,0.15)',
        borderRadius: '8px', padding: '10px 12px',
      }}>
        <p style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
          The Problem
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {solution.problem}
        </p>
      </div>

      {/* Stats */}
      {solution.status !== 'planned' && (
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 500, fontFamily: 'var(--font-display)' }}>
              {solution.users.toLocaleString()}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Users</p>
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 500, fontFamily: 'var(--font-display)', color: solution.monthlyGrowth > 0 ? 'var(--green)' : 'var(--text-secondary)' }}>
              +{solution.monthlyGrowth}%
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>This month</p>
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 500, fontFamily: 'var(--font-display)' }}>
              {solution.buildTime}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Build time</p>
          </div>
        </div>
      )}

      {/* Milestones */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {solution.milestones.map((m, i) => (
          <span key={i} style={{
            fontSize: '11px',
            padding: '3px 10px', borderRadius: '100px',
            background: m.done ? 'rgba(74,158,107,0.12)' : 'var(--bg)',
            border: `1px solid ${m.done ? 'rgba(74,158,107,0.3)' : 'var(--border)'}`,
            color: m.done ? 'var(--green)' : 'var(--text-muted)',
          }}>
            {m.done ? '✓' : '○'} {m.title}
          </span>
        ))}
      </div>

      {/* View link */}
      {solution.status === 'live' && solution.url && (
        <a href={`/solutions/${solution.slug}`} style={{
          fontSize: '13px', color: 'var(--accent)',
          marginTop: 'auto',
          display: 'inline-flex', alignItems: 'center', gap: '4px',
        }}>
          View Details →
        </a>
      )}
    </div>
  );
}