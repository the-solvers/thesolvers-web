import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://thesolvers.online";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Dynamic blog posts from Supabase
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error("Sitemap: Supabase env vars missing, skipping blog posts");
      return [...staticPages, ...blogPages];
    }
    const { data: posts } = await supabase
      .from("blogs")
      .select("slug, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (posts) {
      blogPages = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.published_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    console.error("Sitemap: failed to fetch blog posts", e);
  }

  return [...staticPages, ...blogPages];
}
