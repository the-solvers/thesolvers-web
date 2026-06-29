'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  author: string;
  published_at: string;
  read_time: string;
};

export default function BlogPostClient({ params }: { params: Promise<{ slug: string }> }) {
  const routeParams = useParams();
  const slug = routeParams?.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (!data) setNotFound(true);
      else setPost(data);
      setLoading(false);
    };
    if (slug) fetchPost();
  }, [slug]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (loading) return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Loading…</p>
      </main>
    </>
  );

  if (notFound || !post) return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text-primary)' }}>Post not found</h1>
        <Link href="/blog" style={{ fontSize: '14px', color: 'var(--accent)', textDecoration: 'none' }}>← Back to Blog</Link>
      </main>
    </>
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://thesolvers.online",
    },
    publisher: {
      "@type": "Organization",
      name: "TheSolvers",
      url: "https://thesolvers.online",
      logo: {
        "@type": "ImageObject",
        url: "https://thesolvers.online/icon.png",
      },
    },
    datePublished: post.published_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://thesolvers.online/blog/${post.slug}`,
    },
    keywords: (post.tags || []).join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '64px' }}>

        {/* Header */}
        <section style={{ padding: '64px 4rem 40px', maxWidth: '780px', margin: '0 auto' }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Blog</Link>
            <span aria-hidden="true">›</span>
            <span style={{ color: 'var(--text-secondary)' }}>{post.title}</span>
          </nav>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {(post.tags || []).map(tag => (
              <span key={tag} style={{
                fontSize: '11px', fontWeight: 500,
                padding: '3px 10px', borderRadius: '100px',
                background: 'var(--bg-hover)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)', letterSpacing: '0.02em',
              }}>{tag}</span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 52px)',
            fontWeight: 600, lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px',
                background: 'var(--accent)',
                borderRadius: '7px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
                color: 'white',
                flexShrink: 0,
              }}>S</div>
              <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{post.author}</span>
            </div>
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {post.read_time}
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border)' }} />
        </section>

        {/* Content */}
        <article style={{
          padding: '2.5rem 4rem 100px',
          maxWidth: '780px',
          margin: '0 auto',
          fontSize: '17px',
          lineHeight: 1.85,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          whiteSpace: 'pre-wrap',
        }}>
          {post.content}
        </article>

        {/* Back link */}
        <div style={{ padding: '0 4rem 80px', maxWidth: '780px', margin: '0 auto' }}>
          <Link href="/blog" style={{
            fontSize: '14px', color: 'var(--accent)',
            textDecoration: 'none', fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}>
            ← Back to Blog
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
