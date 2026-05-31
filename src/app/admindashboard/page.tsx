'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────────────
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
  category?: string;
  tech_stack?: string;
};

type ComingSoonItem = {
  id: number;
  name: string;
  created_at: string;
};

type Blog = {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  author: string;
};

type Subscriber = {
  id: number;
  email: string;
  created_at: string;
};

// ── Helpers ────────────────────────────────────────────────────
const statusColor: Record<string, { bg: string; color: string }> = {
  'on-track': { bg: 'rgba(74,158,107,0.15)', color: '#4a9e6b' },
  live:       { bg: 'rgba(74,158,107,0.15)', color: '#4a9e6b' },
  building:   { bg: 'rgba(184,120,42,0.15)', color: '#b8782a' },
  planned:    { bg: 'rgba(138,136,128,0.15)', color: '#8a8880' },
  paused:     { bg: 'rgba(201,74,74,0.15)',   color: '#c94a4a' },
  'coming-soon': { bg: 'var(--accent-dim)', color: 'var(--accent)' },
};


const fmt = (n: number | null) =>
  n === null ? '—' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toLocaleString();

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const STATUSES = ['on-track', 'building', 'live', 'planned', 'paused', 'coming-soon'];

// ── Shared Styles ──────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '14px',
  padding: '1.25rem 1.5rem',
};

const btnDanger: React.CSSProperties = {
  background: 'rgba(185,58,58,0.1)',
  color: '#b93a3a',
  border: '1px solid rgba(185,58,58,0.2)',
  borderRadius: '7px',
  padding: '5px 12px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const btnPrimary: React.CSSProperties = {
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: '7px',
  padding: '6px 14px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const btnGhost: React.CSSProperties = {
  background: 'var(--bg)',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border)',
  borderRadius: '7px',
  padding: '5px 12px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const inp: React.CSSProperties = {
  width: '100%',
  padding: '8px 11px',
  background: 'var(--bg)',
  border: '1px solid var(--border-light)',
  borderRadius: '7px',
  color: 'var(--text-primary)',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
};

const sel: React.CSSProperties = {
  ...inp,
  appearance: 'none',
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(128,128,128,0.6)' stroke-width='2'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '28px',
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
    {children}
  </div>
);

// ── Edit Modal ─────────────────────────────────────────────────
function EditModal({ solution, onClose, onSaved }: { solution: Solution; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: solution.name,
    tagline: solution.tagline,
    status: solution.status,
    progress: String(solution.progress ?? 0),
    users: String(solution.users ?? 0),
    valuation: solution.valuation ?? '',
    url: solution.url ?? '',
    last_update: solution.last_update ?? '',
  });
  const [milestones, setMilestones] = useState<Milestone[]>(Array.isArray(solution.milestones) ? solution.milestones : []);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('solutions')
      .update({
        name: form.name,
        tagline: form.tagline,
        status: form.status,
        progress: Number(form.progress),
        users: Number(form.users),
        valuation: form.valuation,
        url: form.url,
        milestones: milestones,
        last_update: form.last_update || new Date().toISOString().split('T')[0],
      })
      .eq('id', solution.id);
    setSaving(false);
    if (error) { setMsg('Error: ' + error.message); return; }
    setMsg('Saved!');
    setTimeout(() => { onSaved(); onClose(); }, 800);
  };

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
  };
  const modal: React.CSSProperties = {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '520px',
    maxHeight: '90vh', overflowY: 'auto',
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>Edit — {solution.name}</h2>
          <button onClick={onClose} style={{ ...btnGhost, padding: '4px 10px' }}>✕</button>
        </div>

        <Row label="Name">
          <input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </Row>
        <Row label="Tagline">
          <input style={inp} value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />
        </Row>
        <Row label="Status">
          <select style={sel} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Row>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Row label="Progress (%)">
            <input style={inp} type="number" min="0" max="100" value={form.progress} onChange={e => setForm(f => ({ ...f, progress: e.target.value }))} />
          </Row>
          <Row label="Users">
            <input style={inp} type="number" min="0" value={form.users} onChange={e => setForm(f => ({ ...f, users: e.target.value }))} />
          </Row>
          <Row label="Valuation">
            <input style={inp} value={form.valuation} onChange={e => setForm(f => ({ ...f, valuation: e.target.value }))} placeholder="e.g. $0.5M" />
          </Row>
        </div>
        <Row label="Live URL">
          <input style={inp} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://" />
        </Row>
        <Row label="Last Update">
          <input style={inp} type="date" value={form.last_update?.split('T')[0] ?? ''} onChange={e => setForm(f => ({ ...f, last_update: e.target.value }))} />
        </Row>

        <Row label="Milestones">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={m.done}
                  onChange={e => {
                    const newM = [...milestones];
                    newM[i] = { ...newM[i], done: e.target.checked };
                    setMilestones(newM);
                  }}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <input
                  style={{ ...inp, flex: 1, padding: '6px 10px' }}
                  value={m.title || m.label || ''}
                  placeholder="Milestone title..."
                  onChange={e => {
                    const newM = [...milestones];
                    newM[i] = { ...newM[i], label: e.target.value, title: e.target.value };
                    setMilestones(newM);
                  }}
                />
                <button
                  style={{ ...btnDanger, padding: '6px 10px', fontSize: '14px' }}
                  onClick={() => setMilestones(milestones.filter((_, idx) => idx !== i))}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              style={{ ...btnGhost, alignSelf: 'flex-start', marginTop: '4px' }}
              onClick={() => setMilestones([...milestones, { label: '', done: false }])}
            >
              + Add Milestone
            </button>
          </div>
        </Row>

        {msg && (
          <p style={{ fontSize: '13px', color: msg.startsWith('Error') ? '#b93a3a' : '#4a9e6b', marginBottom: '1rem', fontWeight: 600 }}>{msg}</p>
        )}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button style={btnPrimary} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sun Icon ───────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

// ── Moon Icon ──────────────────────────────────────────────────
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

// ── Main Dashboard ─────────────────────────────────────────────
export default function AdminDashboard() {
  const [solutions, setSolutions]     = useState<Solution[]>([]);
  const [blogs, setBlogs]             = useState<Blog[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState<'overview' | 'solutions' | 'blogs' | 'subscribers'>('overview');
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [deleteMsg, setDeleteMsg]     = useState('');
  const [dark, setDark]               = useState(false);

  // Restore saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setDark(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const loadAll = async () => {
    setLoading(true);
    const [{ data: sols }, { data: bl }, { data: subs }] = await Promise.all([
      supabase.from('solutions').select('*').order('created_at', { ascending: true }),
      supabase.from('blogs').select('id,title,slug,published,created_at,author').order('created_at', { ascending: false }),
      supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
    ]);
    setSolutions(sols || []);
    setBlogs(bl || []);
    setSubscribers(subs || []);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  // Stats
  const totalUsers = solutions.reduce((a, s) => a + (s.users || 0), 0);
  const liveSols   = solutions.filter(s => s.status === 'live' || s.status === 'on-track').length;

  // Delete solution
  const deleteSolution = async (id: number, name: string) => {
    if (!confirm(`"${name}" delete karna hai? Yeh undo nahi hoga.`)) return;
    const { error } = await supabase.from('solutions').delete().eq('id', id);
    if (error) { setDeleteMsg('Error: ' + error.message); return; }
    setDeleteMsg(`"${name}" deleted.`);
    loadAll();
    setTimeout(() => setDeleteMsg(''), 3000);
  };


  // Toggle blog publish
  const toggleBlogPublish = async (id: number, current: boolean) => {
    await supabase.from('blogs').update({ published: !current, published_at: !current ? new Date().toISOString() : null }).eq('id', id);
    loadAll();
  };

  // Delete blog
  const deleteBlog = async (id: number, title: string) => {
    if (!confirm(`"${title}" delete karna hai?`)) return;
    await supabase.from('blogs').delete().eq('id', id);
    loadAll();
  };

  // ── Tab styles ─────────────────────────────────────────────
  const tabBtn = (tab: typeof activeTab): React.CSSProperties => ({
    padding: '12px 18px',
    borderRadius: '0',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
    background: 'transparent',
    color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
    whiteSpace: 'nowrap' as const,
  });

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'var(--font-body)' }}>Loading dashboard…</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      {/* Edit Modal */}
      {editingSolution && (
        <EditModal
          solution={editingSolution}
          onClose={() => setEditingSolution(null)}
          onSaved={loadAll}
        />
      )}

      {/* Top bar */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>$ admin_panel</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>TheSolvers Dashboard</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Dark / Light toggle */}
            <button
              onClick={toggleTheme}
              title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                width: '34px', height: '34px',
                background: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                borderRadius: '9px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--border)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
              }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            <a href="/" style={{ ...btnGhost, textDecoration: 'none', display: 'inline-block' }}>← Back to Site</a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', gap: '0', overflowX: 'auto' }}>
          {(['overview', 'solutions', 'blogs', 'subscribers'] as const).map(tab => (
            <button key={tab} style={tabBtn(tab)} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'overview' && (
                <span style={{ marginLeft: '6px', fontSize: '10px', background: 'var(--border)', borderRadius: '100px', padding: '1px 6px', color: 'var(--text-muted)' }}>
                  {tab === 'solutions' ? solutions.length : tab === 'blogs' ? blogs.length : subscribers.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* ── OVERVIEW TAB ─────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
              {[
                { label: 'Total Solutions', value: solutions.length, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
                { label: 'Live Products',   value: liveSols,         icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a9e6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
                { label: 'Total Users',     value: fmt(totalUsers),  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
                { label: 'Coming Soon',     value: solutions.filter(s => s.status === 'coming-soon').length, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                { label: 'Blog Posts',      value: blogs.length,     icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
                { label: 'Subscribers',     value: subscribers.length,icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
              ].map((s, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ marginBottom: '12px' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ ...cardStyle, marginBottom: '2rem' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Quick Actions</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: '+ Add Solution',    href: '/createbuilt',      primary: true  },
                  { label: '+ Write Blog',      href: '/createadminblogs', primary: true  },
                  { label: '→ View Site',       href: '/',                 primary: false },
                  { label: '→ View Blog',       href: '/blog',             primary: false },
                ].map((l, i) => (
                  <a key={i} href={l.href} style={{ ...(l.primary ? btnPrimary : btnGhost), textDecoration: 'none', display: 'inline-block' }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Recent Solutions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {solutions.slice(-5).reverse().map(s => {
                  const st = statusColor[s.status] || statusColor['planned'];
                  return (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg)', borderRadius: '9px', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{s.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>{s.tagline}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '100px', background: st.bg, color: st.color, textTransform: 'capitalize' }}>{s.status}</span>
                        <button style={btnGhost} onClick={() => { setActiveTab('solutions'); setEditingSolution(s); }}>Edit</button>
                      </div>
                    </div>
                  );
                })}
                {solutions.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Koi solution nahi hai.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── SOLUTIONS TAB ────────────────────────────────── */}
        {activeTab === 'solutions' && (
          <div>
            {deleteMsg && (
              <div style={{ marginBottom: '1rem', padding: '10px 16px', background: 'rgba(74,158,107,0.12)', border: '1px solid rgba(74,158,107,0.25)', borderRadius: '9px', fontSize: '13px', color: '#4a9e6b', fontWeight: 600 }}>
                {deleteMsg}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>All Solutions ({solutions.length})</h2>
              <a href="/createbuilt" style={{ ...btnPrimary, textDecoration: 'none' }}>+ Add New</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {solutions.map(s => {
                const st = statusColor[s.status] || statusColor['planned'];
                const milestones: Milestone[] = Array.isArray(s.milestones) ? s.milestones : [];
                const doneMilestones = milestones.filter(m => m.done).length;
                return (
                  <div key={s.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '100px', background: st.bg, color: st.color, textTransform: 'capitalize' }}>{s.status}</span>
                          {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: 'var(--accent)', textDecoration: 'none' }}>↗ Live</a>}
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.tagline}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                        <button style={btnGhost} onClick={() => setEditingSolution(s)}>✏ Edit</button>
                        <button style={btnDanger} onClick={() => deleteSolution(s.id, s.name)}>🗑 Delete</button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                      {[
                        { label: 'Progress',    value: `${s.progress ?? 0}%` },
                        { label: 'Users',       value: fmt(s.users ?? 0) },
                        { label: 'Valuation',   value: s.valuation || '—' },
                        { label: 'Milestones',  value: `${doneMilestones}/${milestones.length}` },
                        { label: 'Last Update', value: s.last_update ? formatDate(s.last_update) : '—' },
                      ].map((item, i) => (
                        <div key={i} style={{ background: 'var(--bg)', borderRadius: '8px', padding: '8px 10px' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{item.label}</div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ height: '5px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.progress ?? 0}%`, background: 'linear-gradient(90deg, var(--accent), #f07040)', borderRadius: '100px' }} />
                    </div>
                  </div>
                );
              })}
              {solutions.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Koi solution nahi hai abhi. <a href="/createbuilt" style={{ color: 'var(--accent)' }}>Pehla add karo →</a></p>
              )}
            </div>
          </div>
        )}


        {/* ── BLOGS TAB ─────────────────────────────────────── */}
        {activeTab === 'blogs' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>Blog Posts ({blogs.length})</h2>
              <a href="/createadminblogs" style={{ ...btnPrimary, textDecoration: 'none' }}>+ Write New</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {blogs.map(b => (
                <div key={b.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>{b.title}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: b.published ? 'rgba(74,158,107,0.15)' : 'rgba(184,120,42,0.15)', color: b.published ? '#4a9e6b' : '#b8782a' }}>
                        {b.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>by {b.author} · {formatDate(b.created_at)} · /blog/{b.slug}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button style={{ ...btnGhost, fontSize: '12px' }} onClick={() => toggleBlogPublish(b.id, b.published)}>
                      {b.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <a href={`/blog/${b.slug}`} target="_blank" rel="noopener noreferrer" style={{ ...btnGhost, textDecoration: 'none', fontSize: '12px', display: 'inline-block' }}>View</a>
                    <button style={{ ...btnDanger, fontSize: '12px' }} onClick={() => deleteBlog(b.id, b.title)}>Delete</button>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Koi blog post nahi hai. <a href="/createadminblogs" style={{ color: 'var(--accent)' }}>Pehla likho →</a></p>
              )}
            </div>
          </div>
        )}

        {/* ── SUBSCRIBERS TAB ───────────────────────────────── */}
        {activeTab === 'subscribers' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>Subscribers ({subscribers.length})</h2>
              <button style={btnGhost} onClick={() => {
                const csv = 'Email,Date\n' + subscribers.map(s => `${s.email},${formatDate(s.created_at)}`).join('\n');
                const a = document.createElement('a');
                a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
                a.download = 'subscribers.csv';
                a.click();
              }}>⬇ Export CSV</button>
            </div>

            <div style={cardStyle}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['#', 'Email', 'Subscribed On'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.email}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{formatDate(s.created_at)}</td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr><td colSpan={3} style={{ padding: '20px 12px', color: 'var(--text-muted)', textAlign: 'center' }}>Koi subscriber nahi hai abhi.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
