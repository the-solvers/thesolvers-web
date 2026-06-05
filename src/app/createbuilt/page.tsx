'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getMilestoneProgress } from '@/lib/progress';

const CATEGORIES = ['Productivity', 'Health', 'Finance', 'Education', 'Developer Tools', 'Social', 'Environment', 'Other'];
const STATUSES = ['on-track', 'building', 'live', 'planned', 'paused', 'coming-soon'];

type Milestone = { label: string; done: boolean };

export default function CreateBuiltPage() {
  // ── Core Fields ──────────────────────────────────────────────
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Productivity');
  const [status, setStatus] = useState('on-track');
  const [url, setUrl] = useState('');
  const [techStack, setTechStack] = useState('');
  const [weekNumber, setWeekNumber] = useState('');

  // ── Card-specific Fields (from image) ────────────────────────
  const [users, setUsers] = useState('0');
  const [valuation, setValuation] = useState('0.0');
  const [valuationSince, setValuationSince] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { label: 'MVP Launch', done: false },
    { label: 'First 100 Subscribers', done: false },
    { label: 'Product Hunt Launch', done: false },
  ]);
  const [newMilestone, setNewMilestone] = useState('');

  // ── UI State ──────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  // ── Drag State ────────────────────────────────────────────────
  const dragIndex = React.useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  // ── Styles ────────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 13px', boxSizing: 'border-box',
    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
    borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px',
    fontFamily: 'inherit', outline: 'none', transition: 'border 0.2s',
  };
  const sel: React.CSSProperties = {
    ...inp, appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(128,128,128,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,

    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
    backgroundSize: '14px', paddingRight: '36px', cursor: 'pointer',
  };
  const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent)';
  };
  const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--border-light)';
  };

  const F = (label: string, hint: string, el: React.ReactNode) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px', letterSpacing: '0.02em' }}>{label}</label>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', margin: '0 0 6px' }}>{hint}</p>
      {el}
    </div>
  );

  // ── Milestone Helpers ─────────────────────────────────────────
  const toggleMilestone = (i: number) =>
    setMilestones(ms => ms.map((m, idx) => idx === i ? { ...m, done: !m.done } : m));
  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setMilestones(ms => [...ms, { label: newMilestone.trim(), done: false }]);
    setNewMilestone('');
  };
  const removeMilestone = (i: number) =>
    setMilestones(ms => ms.filter((_, idx) => idx !== i));

  const onDragStart = (i: number) => { dragIndex.current = i; };
  const onDragEnter = (i: number) => { setDragOver(i); };
  const onDragEnd   = () => {
    if (dragIndex.current === null || dragOver === null || dragIndex.current === dragOver) {
      dragIndex.current = null;
      setDragOver(null);
      return;
    }
    setMilestones(ms => {
      const next = [...ms];
      const [moved] = next.splice(dragIndex.current!, 1);
      next.splice(dragOver, 0, moved);
      return next;
    });
    dragIndex.current = null;
    setDragOver(null);
  };

  // ── Save ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim() || !tagline.trim()) {
      setMessage('Name and Tagline are required.');
      setMsgType('error');
      return;
    }
    setSaving(true);
    setMessage('');

    const slug = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');

    const { error } = await supabase.from('solutions').insert([{
      name: name.trim(),
      slug,
      tagline: tagline.trim(),
      problem: problem.trim(),
      description: description.trim(),
      category,
      status,
      url: url.trim() || null,
      tech_stack: techStack.trim() || null,
      users: parseInt(users) || 0,
      week_number: weekNumber ? parseInt(weekNumber) : null,
      progress: getMilestoneProgress(milestones),
      valuation: valuation.trim() || null,
      valuation_since: valuationSince.trim() || null,
      last_update: lastUpdate || null,
      milestones: milestones,
    }]);

    setSaving(false);
    if (error) {
      setMessage('Error: ' + error.message);
      setMsgType('error');
    } else {
      setMessage('✓ Solution saved successfully!');
      setMsgType('success');
      setName(''); setTagline(''); setProblem(''); setDescription('');
      setUrl(''); setTechStack(''); setWeekNumber('');
      setCategory('Productivity'); setStatus('on-track');
      setUsers('0'); setValuation('0.0'); setValuationSince('');
      setLastUpdate(''); setMilestones([]);
    }
  };

  // ── Status Badge Color ────────────────────────────────────────
  const badgeColor = (s: string) => {
    if (s === 'on-track' || s === 'live') return { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' };
    if (s === 'building') return { bg: 'rgba(168,85,247,0.15)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' };
    if (s === 'paused') return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' };
    if (s === 'coming-soon') return { bg: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)' };
    return { bg: 'rgba(255,255,255,0.08)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.12)' };
  };

  const prog = getMilestoneProgress(milestones);

  const sectionHead = (n: string, t: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{n}</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t}</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>

      {/* Top Bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg-card)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ← Back
          </a>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Add New Built
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {message && (
            <span style={{ fontSize: '13px', color: msgType === 'success' ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '8px 20px', fontSize: '13px', fontWeight: 600,
              background: saving ? 'var(--border)' : 'var(--accent)',
              border: 'none', borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              color: 'white', transition: 'opacity 0.2s',
            }}
          >
            {saving ? 'Saving…' : 'Save →'}
          </button>
        </div>
      </div>

      {/* Main Layout: Form + Preview */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem 6rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

        {/* ── LEFT: Form ── */}
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Solution Editor</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Fill in all the card details — the preview on the right will update live.
          </p>

          {/* Section 1 — Basic Info */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
            {sectionHead('01', 'Basic Info')}
            {F('Product Name *', 'e.g. VoiceDouble, FocusBlock',
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="VoiceDouble" style={inp} onFocus={onF} onBlur={onB} />
            )}
            {F('Tagline *', 'Describe it in one line',
              <input type="text" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Speak in meetings without speaking." style={inp} onFocus={onF} onBlur={onB} />
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                {F('Category', 'Select a category',
                  <select value={category} onChange={e => setCategory(e.target.value)} style={sel} onFocus={onF} onBlur={onB}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>
              <div>
                {F('Status', 'Current status',
                  <select value={status} onChange={e => setStatus(e.target.value)} style={sel} onFocus={onF} onBlur={onB}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Section 2 — Progress & Stats */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
            {sectionHead('02', 'Progress & Stats')}
            {F('Progress %', 'Calculated from completed milestones',
              <div style={{
                ...inp,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-secondary)',
              }}>
                <span>{milestones.filter(m => m.done).length}/{milestones.length} milestones complete</span>
                <strong style={{ color: 'var(--text-primary)' }}>{prog}%</strong>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                {F('Users / Downloads', 'Total number of users',
                  <input type="number" value={users} onChange={e => setUsers(e.target.value)} placeholder="6" style={inp} onFocus={onF} onBlur={onB} />
                )}
              </div>
              <div>
                {F('Valuation ($M)', 'Company valuation in millions',
                  <input type="number" step="0.1" value={valuation} onChange={e => setValuation(e.target.value)} placeholder="0.0" style={inp} onFocus={onF} onBlur={onB} />
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                {F('Valuation Since', 'Since when? (e.g. May 2026)',
                  <input type="text" value={valuationSince} onChange={e => setValuationSince(e.target.value)} placeholder="May 2026" style={inp} onFocus={onF} onBlur={onB} />
                )}
              </div>
              <div>
                {F('Last Update Date', 'Displayed on the card',
                  <input type="date" value={lastUpdate} onChange={e => setLastUpdate(e.target.value)} style={{ ...inp, colorScheme: 'dark' }} onFocus={onF} onBlur={onB} />
                )}
              </div>
            </div>
          </div>

          {/* Section 3 — Milestones */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
            {sectionHead('03', 'Milestones')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {milestones.map((m, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragEnter={() => onDragEnter(i)}
                  onDragOver={e => e.preventDefault()}
                  onDragEnd={onDragEnd}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px',
                    background: dragOver === i ? 'var(--accent-dim)' : 'var(--bg)',
                    borderRadius: '8px',
                    border: dragOver === i ? '1px solid var(--accent)' : '1px solid var(--border)',
                    cursor: 'grab',
                    transition: 'background 0.15s, border-color 0.15s',
                    userSelect: 'none',
                  }}
                >
                  {/* Drag handle */}
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px', flexShrink: 0, cursor: 'grab', lineHeight: 1 }} title="Drag to reorder">
                    ⠿
                  </span>
                  <button
                    onClick={() => toggleMilestone(i)}
                    style={{
                      width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer',
                      background: m.done ? '#22c55e' : 'transparent',
                      border: m.done ? 'none' : '2px solid #f59e0b',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    {m.done && <span style={{ color: 'white', fontSize: '11px' }}>✓</span>}
                    {!m.done && <span style={{ color: '#f59e0b', fontSize: '10px' }}>◷</span>}
                  </button>
                  <span style={{ flex: 1, fontSize: '14px', color: m.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: m.done ? 'line-through' : 'none' }}>
                    {m.label}
                  </span>
                  <button onClick={() => removeMilestone(i)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text" value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMilestone()}
                placeholder="Type a new milestone and press Enter…"
                style={{ ...inp, flex: 1 }} onFocus={onF} onBlur={onB}
              />
              <button onClick={addMilestone} style={{ padding: '0 16px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>+</button>
            </div>
          </div>

          {/* Section 4 — Problem & Description */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
            {sectionHead('04', 'Problem & Solution')}
            {F('What Was the Problem?', 'The real problem you observed',
              <textarea value={problem} onChange={e => setProblem(e.target.value)} rows={3}
                placeholder="People hesitate to speak up in meetings…"
                style={{ ...inp, resize: 'vertical', lineHeight: 1.65 }} onFocus={onF} onBlur={onB}
              />
            )}
            {F('Solution Description', 'What did you build?',
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                placeholder="An AI voice clone that attends Zoom calls in your voice…"
                style={{ ...inp, resize: 'vertical', lineHeight: 1.65 }} onFocus={onF} onBlur={onB}
              />
            )}
          </div>

          {/* Section 5 — Tech & Links */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            {sectionHead('05', 'Tech & Links')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                {F('Live URL', 'App link (optional)',
                  <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://yourapp.com" style={inp} onFocus={onF} onBlur={onB} />
                )}
              </div>
              <div>
                {F('Week Number', 'Which week is this solution from?',
                  <input type="number" value={weekNumber} onChange={e => setWeekNumber(e.target.value)} placeholder="3" style={inp} onFocus={onF} onBlur={onB} />
                )}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                {F('Tech Stack', 'Separate with commas',
                  <input type="text" value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="Next.js, Supabase, OpenAI, Tailwind" style={inp} onFocus={onF} onBlur={onB} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Live Card Preview ── */}
        <div style={{ position: 'sticky', top: '76px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            Live Preview
          </p>

          <div style={{
            background: 'var(--bg-card)',
            border: status === 'coming-soon' ? '1px dashed var(--accent)' : '1px solid var(--border)',
            borderRadius: '16px', padding: '1.4rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {name || 'Product Name'}
                </h3>
                {status === 'coming-soon' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent-dim)" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                )}
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '4px 10px',
                borderRadius: '100px', ...badgeColor(status),
                textTransform: 'capitalize', letterSpacing: '0.04em'
              }}>{status}</span>
            </div>

            {/* Tagline */}
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              {tagline || 'Your tagline will appear here…'}
            </p>

            {/* Progress */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Progress</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{prog}%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${prog}%`,
                  background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                  borderRadius: '999px', transition: 'width 0.4s ease',
                }} />
              </div>
            </div>

            {/* Stats: Users + Valuation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.2rem' }}>
              <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px' }}>👥</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Users</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {parseInt(users) || 0}
                </div>
              </div>
              <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Valuation</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  ${parseFloat(valuation || '0').toFixed(1)}M
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {valuationSince ? `Since ${valuationSince}` : 'Since —'}
                </div>
              </div>
            </div>

            {/* Milestones */}
            {milestones.length > 0 && (
              <div style={{ marginBottom: '1.2rem' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>Milestones</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[...milestones].sort((a, b) => (a.done === b.done ? 0 : a.done ? -1 : 1)).map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {m.done
                        ? <span style={{ fontSize: '16px', color: '#22c55e' }}>✅</span>
                        : <span style={{ fontSize: '14px', color: '#f59e0b' }}>⏳</span>}
                      <span style={{
                        fontSize: '13px',
                        color: m.done ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: m.done ? 'line-through' : 'none',
                      }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }} />

            {/* Last Update + View Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Last update</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lastUpdate
                  ? new Date(lastUpdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              {status === 'coming-soon' ? (
                <span style={{
                  fontSize: '11px', fontWeight: 600, color: 'var(--accent)',
                  background: 'var(--accent-dim)', padding: '4px 10px',
                  borderRadius: '100px', textTransform: 'uppercase',
                  letterSpacing: '0.04em', display: 'inline-block'
                }}>
                  Coming Soon
                </span>
              ) : (
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', cursor: 'pointer' }}>
                  View Details →
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
