'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  author: string;
  published_at: string;
  read_time: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('id, slug, title, excerpt, tags, author, published_at, read_time')
        .eq('published', true)
        .order('published_at', { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '64px' }}>

        {/* Header */}
        <section style={{ padding: '72px 4rem 60px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem',
          }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>Blog</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 6vw, 72px)',
            fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05,
            color: 'var(--text-primary)', marginBottom: '1.25rem',
          }}>
            Blog
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '480px',
          }}>
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Insights</span>, lessons, and{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>updates</span> from building
            100 real solutions in 100 weeks.
          </p>
        </section>

        {/* Divider */}
        <div style={{ padding: '0 4rem' }}>
          <div style={{ height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Posts */}
        <section style={{ padding: '1rem 4rem 100px' }}>
          {loading ? (
            <div style={{ padding: '4rem 0', color: 'var(--text-muted)', fontSize: '15px' }}>
              Loading posts…
            </div>
          ) : posts.length === 0 ? (
            <div style={{ padding: '4rem 0', color: 'var(--text-muted)', fontSize: '15px' }}>
              No posts published yet. Check back soon!
            </div>
          ) : (
            posts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <article
                  style={{
                    padding: '2rem 1.5rem',
                    borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex', alignItems: 'flex-start',
                    justifyContent: 'space-between', gap: '2rem',
                    transition: 'background 0.2s', borderRadius: '10px',
                    cursor: 'pointer', marginBottom: '4px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {(post.tags || []).map(tag => (
                        <span key={tag} style={{
                          fontSize: '11px', fontWeight: 500,
                          padding: '3px 10px', borderRadius: '100px',
                          background: 'var(--bg-hover)', color: 'var(--text-secondary)',
                          letterSpacing: '0.02em', border: '1px solid var(--border)',
                        }}>{tag}</span>
                      ))}
                    </div>
                    <h2 style={{
                      fontFamily: 'var(--font-display)', fontSize: '20px',
                      fontWeight: 600, color: 'var(--text-primary)',
                      marginBottom: '0.5rem', lineHeight: 1.3, letterSpacing: '-0.01em',
                    }}>{post.title}</h2>
                    <p style={{
                      fontSize: '14px', color: 'var(--text-secondary)',
                      lineHeight: 1.65, marginBottom: '1rem', maxWidth: '580px',
                    }}>{post.excerpt}</p>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      fontSize: '13px', color: 'var(--text-muted)',
                    }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{post.author}</span>
                      <span>{formatDate(post.published_at)}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {post.read_time}
                      </span>
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '4px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </article>
              </Link>
            ))
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
