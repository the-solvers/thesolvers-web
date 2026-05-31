'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('TheSolvers Team');
  const [readTime, setReadTime] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'publishing'>('idle');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const autoSlug = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 60);

  const onTitleChange = (val: string) => {
    setTitle(val);
    setSlug(autoSlug(val));
  };

  const submit = async (publish: boolean) => {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setMessage('Title, Short Summary aur Content — teeno required hain.');
      setMessageType('error');
      return;
    }
    setStatus(publish ? 'publishing' : 'saving');
    setMessage('');

    const { error } = await supabase.from('blogs').insert([{
      title: title.trim(),
      slug: slug || autoSlug(title),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      author: author.trim() || 'TheSolvers Team',
      read_time: readTime.trim() || '3 min read',
      published: publish,
      published_at: publish ? new Date().toISOString() : null,
    }]);

    setStatus('idle');
    if (error) {
      setMessage('Kuch galat ho gaya: ' + error.message);
      setMessageType('error');
    } else if (publish) {
      setMessage('✓ Blog publish ho gaya! /blog pe ja ke dekho.');
      setMessageType('success');
      setTitle(''); setSlug(''); setTags(''); setExcerpt(''); setContent(''); setReadTime('');
    } else {
      setMessage('✓ Draft save ho gaya.');
      setMessageType('success');
    }
  };

  const field = (label: string, hint: string, element: React.ReactNode) => (
    <div style={{ marginBottom: '1.75rem' }}>
      <label style={{
        display: 'block', fontSize: '13px', fontWeight: 600,
        color: 'var(--text-primary)', marginBottom: '4px',
      }}>{label}</label>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: 1.5 }}>{hint}</p>
      {element}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
    borderRadius: '8px', color: 'var(--text-primary)',
    fontSize: '15px', fontFamily: 'var(--font-body)', outline: 'none',
    transition: 'border-color 0.2s',
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--accent)');
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--border-light)');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      {/* Top Bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(237,234,227,0.96)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 2.5rem', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Site pe Wapas
          </a>
          <span style={{ color: 'var(--border)', fontSize: '18px' }}>|</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Naya Blog Likho
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {message && (
            <span style={{ fontSize: '13px', color: messageType === 'success' ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>
              {message}
            </span>
          )}
          <button
            onClick={() => submit(false)}
            disabled={status !== 'idle'}
            style={{
              padding: '8px 18px', fontSize: '13px', fontWeight: 500,
              background: 'transparent', border: '1px solid var(--border-light)',
              borderRadius: '7px', cursor: status !== 'idle' ? 'not-allowed' : 'pointer',
              color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
            }}
          >
            {status === 'saving' ? 'Save ho rha…' : 'Draft Save Karo'}
          </button>
          <button
            onClick={() => submit(true)}
            disabled={status !== 'idle'}
            style={{
              padding: '8px 22px', fontSize: '13px', fontWeight: 500,
              background: status !== 'idle' ? 'var(--border-light)' : 'var(--accent)',
              border: 'none', borderRadius: '7px',
              cursor: status !== 'idle' ? 'not-allowed' : 'pointer',
              color: 'white', fontFamily: 'var(--font-body)',
            }}
          >
            {status === 'publishing' ? 'Publish ho rha…' : 'Publish Karo →'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 2rem 8rem' }}>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '0.5rem',
        }}>Blog Editor</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Neeche form bharo. <strong>Title, Short Summary aur Content</strong> zaroori hain. Baaki optional hain.
          Likho → "Publish Karo" dabao → /blog pe live ho jaayega.
        </p>

        {/* ─── Section 1: Basic Info ─── */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '1.75rem', marginBottom: '1.25rem',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
            1 — Basic Info
          </h2>

          {field(
            'Blog ka Title *',
            'Yeh blog ka main naam hai jo sabse upar dikh​ta hai.',
            <input
              type="text" value={title} onChange={e => onTitleChange(e.target.value)}
              placeholder='Jaise: "Week 1 mein kya banaya aur kya toota"'
              style={inputStyle} onFocus={focus} onBlur={blur}
            />
          )}

          {field(
            'URL Slug (auto-fill hota hai)',
            `Blog ka link yeh hoga: thesolvers.com/blog/${slug || 'aapka-title-yahan'}`,
            <input
              type="text" value={slug} onChange={e => setSlug(e.target.value)}
              placeholder="url-mein-yahan-aayega"
              style={{ ...inputStyle, fontSize: '13px', color: 'var(--text-secondary)' }}
              onFocus={focus} onBlur={blur}
            />
          )}

          {field(
            'Short Summary *',
            'Blog list mein title ke neeche yeh 1-2 line dikh​ti hai. Reader ko pata chale blog kiske baare mein hai.',
            <textarea
              value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3}
              placeholder="Jaise: Is week humne ek expense tracker banaya. Kya kaam kiya, kya nahi — sab kuch yahan."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
              onFocus={focus} onBlur={blur}
            />
          )}
        </div>

        {/* ─── Section 2: Details ─── */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '1.75rem', marginBottom: '1.25rem',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
            2 — Details (Optional)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              {field(
                'Author ka Naam',
                'Kisne likha?',
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
                  style={inputStyle} onFocus={focus} onBlur={blur}
                />
              )}
            </div>
            <div>
              {field(
                'Padhne ka Time',
                'Jaise: 4 min read',
                <input type="text" value={readTime} onChange={e => setReadTime(e.target.value)}
                  placeholder="5 min read"
                  style={inputStyle} onFocus={focus} onBlur={blur}
                />
              )}
            </div>
            <div>
              {field(
                'Tags',
                'Comma se alag karo',
                <input type="text" value={tags} onChange={e => setTags(e.target.value)}
                  placeholder="lessons, week 1, startup"
                  style={inputStyle} onFocus={focus} onBlur={blur}
                />
              )}
            </div>
          </div>
        </div>

        {/* ─── Section 3: Content ─── */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '1.75rem',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
            3 — Blog Content *
          </h2>
          {field(
            'Poora Blog Yahan Likho',
            'Yeh main body hai — jo bhi share karna hai, yahan likho. Jitna chaaho utna lamba.',
            <textarea
              value={content} onChange={e => setContent(e.target.value)} rows={22}
              placeholder={`Yahan apna blog likho…\n\nJaise:\nIs week humne ek problem dhundi — kai logon ko apne daily expenses track karna mushkil lagta hai...\n\nHumne decide kiya ke ek simple app banaenge jo...\n\nKya kaam kiya:\n- Feature 1\n- Feature 2\n\nKya nahi kaam kiya:\n- ...\n\nAgle week kya karenge:\n...`}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.8, fontSize: '15px', minHeight: '400px' }}
              onFocus={focus} onBlur={blur}
            />
          )}
        </div>

      </div>
    </div>
  );
}
