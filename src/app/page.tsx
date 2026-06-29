import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SolutionsGrid from "@/components/SolutionsGrid";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "TheSolvers — Building 100 Products That Solve Real Problems",
  description:
    "TheSolvers is a 100-week build-in-public challenge: find 100 real-world problems and build 100 products that solve them. No hype, no fluff — just honest problem-solving.",
  alternates: {
    canonical: "https://thesolvers.online",
  },
  openGraph: {
    url: "https://thesolvers.online",
    title: "TheSolvers — Building 100 Products That Solve Real Problems",
    description:
      "100 real problems. 100 real products. 100 weeks. Follow our build-in-public journey.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://thesolvers.online/#website",
      url: "https://thesolvers.online",
      name: "TheSolvers",
      description:
        "Building 100 products that solve 100 real-world problems. A build-in-public journey.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://thesolvers.online/blog?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://thesolvers.online/#organization",
      name: "TheSolvers",
      url: "https://thesolvers.online",
      logo: {
        "@type": "ImageObject",
        url: "https://thesolvers.online/icon.png",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "solvers.real@gmail.com",
        contactType: "customer service",
      },
      sameAs: ["https://github.com/the-solvers"],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <SolutionsGrid />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
