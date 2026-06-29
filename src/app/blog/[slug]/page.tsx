import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import BlogPostClient from "./BlogPostClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("blogs")
    .select("title, excerpt, tags, author, published_at")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) {
    return {
      title: "Post Not Found | TheSolvers",
      description: "This blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | TheSolvers`,
    description: post.excerpt,
    keywords: post.tags || [],
    authors: [{ name: post.author }],
    alternates: {
      canonical: `https://thesolvers.online/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `https://thesolvers.online/blog/${slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.published_at,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/og-image.png"],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  return <BlogPostClient params={params} />;
}
