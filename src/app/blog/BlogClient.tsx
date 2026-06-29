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

export default function BlogClient() {
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

        {/* ── Header ── */}
        <section className="blog-header-section" style={{ padding: '60px 2rem 56px', borderBottom: '1px solid var(--border)', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem' }}>
            <div>
              <p style={{
                fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem',
              }}>
                The Solvers — Weekly Dispatch
              </p>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(52px, 7vw, 88px)',
                fontWeight: 600, letterSpacing: '-0.03em',
                lineHeight: 0.95, color: 'var(--text-primary)',
              }}>
                Blog
              </h1>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div className="blog-s-icon" style={{
                width: '96px', height: '96px',
                background: 'var(--accent)',
                borderRadius: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '48px', color: 'white',
                boxShadow: '0 8px 32px rgba(232,99,58,0.2)',
                marginBottom: '12px',
              }}>S</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Real problems.<br />Real solutions.<br />Built in public.
              </p>
            </div>
          </div>
        </section>

        {/* ── Posts ── */}
        <section className="blog-posts-section" style={{ padding: '0 2rem 100px', maxWidth: '1100px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ padding: '5rem 0', color: 'var(--text-muted)', fontSize: '15px' }}>Loading posts…</div>
          ) : posts.length === 0 ? (
            <div style={{ padding: '5rem 0', color: 'var(--text-muted)', fontSize: '15px' }}>No posts published yet. Check back soon.</div>
          ) : (
            posts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <article
                  style={{
                    padding: '2.5rem 0',
                    borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '2rem',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderRadius: '10px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.padding = '2.5rem 1.5rem';
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.margin = '0 -1.5rem';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.padding = '2.5rem 0';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.margin = '0';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                      {(post.tags || []).map(tag => (
                        <span key={tag} style={{
                          fontSize: '10px', fontWeight: 600,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          padding: '3px 10px', borderRadius: '100px',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border)',
                        }}>{tag}</span>
                      ))}
                    </div>

                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(20px, 2.5vw, 28px)',
                      fontWeight: 600, letterSpacing: '-0.015em',
                      lineHeight: 1.2, color: 'var(--text-primary)',
                      marginBottom: '0.6rem',
                    }}>{post.title}</h2>

                    <p style={{
                      fontSize: '14px', color: 'var(--text-secondary)',
                      lineHeight: 1.7, marginBottom: '1.25rem',
                      maxWidth: '640px',
                    }}>{post.excerpt}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <div style={{
                        width: '22px', height: '22px', background: 'var(--accent)',
                        borderRadius: '5px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '11px',
                        fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)',
                        flexShrink: 0,
                      }}>S</div>
                      <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{post.author}</span>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <span>{formatDate(post.published_at)}</span>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {post.read_time}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    width: '40px', height: '40px',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', flexShrink: 0,
                    transition: 'all 0.2s',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
