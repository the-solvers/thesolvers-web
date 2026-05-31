'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type ComingSoonItem = {
  id: number;
  name: string;
  created_at: string;
};

export default function CreateComingSoonPage() {
  const [name, setName] = useState('');
  const [items, setItems] = useState<ComingSoonItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  const fetchItems = async () => {
    const { data } = await supabase
      .from('coming_soon')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) {
      setMessage('Brand name is required.');
      setMsgType('error');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('coming_soon').insert([{ name: name.trim() }]);
    setSaving(false);
    if (error) {
      setMessage('Error: ' + error.message);
      setMsgType('error');
    } else {
      setMessage('✓ Added successfully!');
      setMsgType('success');
      setName('');
      fetchItems();
    }
  };

  const handleDelete = async (id: number) => {
    await supabase.from('coming_soon').delete().eq('id', id);
    fetchItems();
  };

  const handleEdit = async (id: number, oldName: string) => {
    const newName = window.prompt(`Edit name for "${oldName}":`, oldName);
    if (!newName || newName.trim() === '' || newName === oldName) return;
    await supabase.from('coming_soon').update({ name: newName.trim() }).eq('id', id);
    fetchItems();
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
    borderRadius: '8px', color: 'var(--text-primary)', fontSize: '15px',
    fontFamily: 'var(--font-body)', outline: 'none', transition: 'border 0.2s',
  };

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
          <a href="/" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Back
          </a>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Coming Soon Manager
          </span>
        </div>
        {message && (
          <span style={{ fontSize: '13px', fontWeight: 500, color: msgType === 'success' ? 'var(--green)' : 'var(--red)' }}>
            {message}
          </span>
        )}
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 2rem' }}>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, marginBottom: '0.4rem' }}>
          Add Coming Soon
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Enter a brand name — it will be displayed as a "Coming Soon" card on the homepage.
        </p>

        {/* Input + Button */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '3rem' }}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Brand name... (e.g. BillSplit, SkillBridge)"
            style={{ ...inp, flex: 1 }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            style={{
              padding: '12px 24px', fontSize: '14px', fontWeight: 600,
              background: saving ? 'var(--border)' : 'var(--accent)',
              border: 'none', borderRadius: '8px',
              color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
            }}
          >
            {saving ? 'Adding…' : 'Add →'}
          </button>
        </div>

        {/* Preview */}
        {name.trim() && (
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Preview
            </p>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px dashed var(--border-light)',
              borderRadius: '16px', padding: '1.5rem',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              minHeight: '120px', gap: '12px', opacity: 0.8,
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {name}
              </h3>
              <span style={{
                fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--accent)', background: 'var(--accent-dim)',
                padding: '4px 12px', borderRadius: '100px',
              }}>
                Coming Soon
              </span>
            </div>
          </div>
        )}

        {/* Existing Items */}
        {items.length > 0 && (
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Current Coming Soon ({items.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '12px 16px',
                }}>
                  <div>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.name}
                    </span>
                    <span style={{
                      marginLeft: '10px', fontSize: '11px', fontWeight: 600,
                      color: 'var(--accent)', background: 'var(--accent-dim)',
                      padding: '2px 8px', borderRadius: '100px',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      Coming Soon
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(item.id, item.name)}
                      style={{
                        background: 'none', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 600, padding: '4px 8px',
                        transition: 'color 0.2s', fontFamily: 'var(--font-body)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: 'none', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 600, padding: '4px 8px',
                        transition: 'color 0.2s', fontFamily: 'var(--font-body)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
