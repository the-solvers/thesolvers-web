import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog — TheSolvers Weekly Dispatch",
  description:
    "Follow the TheSolvers build-in-public journey. Every week: what problem we tackled, how we built it, what failed, and what's next. Real stories, no marketing spin.",
  alternates: {
    canonical: "https://thesolvers.online/blog",
  },
  openGraph: {
    url: "https://thesolvers.online/blog",
    title: "TheSolvers Blog — Weekly Dispatch",
    description:
      "Real problems. Real products. Real failures. Follow our 100-week build-in-public journey week by week.",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
