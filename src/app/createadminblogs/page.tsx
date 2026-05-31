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
      setMessage('Title, Short Summary, and Content are all required.');
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
      setMessage('Something went wrong: ' + error.message);
      setMessageType('error');
    } else if (publish) {
      setMessage('✓ Blog published successfully! Check it at /blog.');
      setMessageType('success');
      setTitle(''); setSlug(''); setTags(''); setExcerpt(''); setContent(''); setReadTime('');
    } else {
      setMessage('✓ Draft saved successfully.');
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
            ← Back to Site
          </a>
          <span style={{ color: 'var(--border)', fontSize: '18px' }}>|</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            New Blog Post
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
            {status === 'saving' ? 'Saving…' : 'Save Draft'}
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
            {status === 'publishing' ? 'Publishing…' : 'Publish →'}
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
          Fill in the form below. <strong>Title, Short Summary, and Content</strong> are required. The rest are optional.
          Write → click &quot;Publish&quot; → it goes live at /blog.
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
            'Blog Title *',
            'This is the main title displayed at the top of the blog post.',
            <input
              type="text" value={title} onChange={e => onTitleChange(e.target.value)}
              placeholder='e.g. "What We Built in Week 1 — and What Broke"'
              style={inputStyle} onFocus={focus} onBlur={blur}
            />
          )}

          {field(
            'URL Slug (auto-generated)',
            `Blog link will be: thesolvers.com/blog/${slug || 'your-title-here'}`,
            <input
              type="text" value={slug} onChange={e => setSlug(e.target.value)}
              placeholder="your-slug-here"
              style={{ ...inputStyle, fontSize: '13px', color: 'var(--text-secondary)' }}
              onFocus={focus} onBlur={blur}
            />
          )}

          {field(
            'Short Summary *',
            'This 1-2 line summary appears below the title in the blog list, telling readers what the post is about.',
            <textarea
              value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3}
              placeholder="e.g. This week we built an expense tracker. What worked, what didn't — all here."
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
                'Author Name',
                'Who wrote this?',
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
                  style={inputStyle} onFocus={focus} onBlur={blur}
                />
              )}
            </div>
            <div>
              {field(
                'Reading Time',
                'e.g. 4 min read',
                <input type="text" value={readTime} onChange={e => setReadTime(e.target.value)}
                  placeholder="5 min read"
                  style={inputStyle} onFocus={focus} onBlur={blur}
                />
              )}
            </div>
            <div>
              {field(
                'Tags',
                'Separate with commas',
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
            'Write Your Full Blog Here',
            'This is the main body — write everything you want to share. As long as you like.',
            <textarea
              value={content} onChange={e => setContent(e.target.value)} rows={22}
              placeholder={`Write your blog here…\n\nFor example:\nThis week we found a problem — many people struggle to track their daily expenses...\n\nWe decided to build a simple app that...\n\nWhat worked:\n- Feature 1\n- Feature 2\n\nWhat didn't work:\n- ...\n\nWhat we're doing next week:\n...`}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.8, fontSize: '15px', minHeight: '400px' }}
              onFocus={focus} onBlur={blur}
            />
          )}
        </div>

      </div>
    </div>
  );
}
