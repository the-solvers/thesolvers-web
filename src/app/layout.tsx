import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thesolvers.online"),
  title: {
    default: "TheSolvers — Building 100 Products That Solve Real Problems",
    template: "%s | TheSolvers",
  },
  description:
    "TheSolvers is a 100-week challenge to find 100 real-world problems and build 100 products that solve them. Follow our build-in-public journey — no hype, no fluff.",
  keywords: [
    "build in public",
    "indie hacker",
    "micro saas",
    "real world problems",
    "100 products",
    "side projects",
    "startup journey",
    "product building",
    "indie developer",
    "thesolvers",
  ],
  authors: [{ name: "TheSolvers", url: "https://thesolvers.online" }],
  creator: "TheSolvers",
  publisher: "TheSolvers",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://thesolvers.online",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thesolvers.online",
    siteName: "TheSolvers",
    title: "TheSolvers — Building 100 Products That Solve Real Problems",
    description:
      "100 real problems. 100 real products. 100 weeks. Follow our build-in-public journey of solving everyday frustrations — documented honestly, no marketing spin.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TheSolvers — 100 Real Problems. 100 Real Solutions.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TheSolvers — Building 100 Products That Solve Real Problems",
    description:
      "100 real problems. 100 real products. 100 weeks. Follow our build-in-public journey.",
    images: ["/og-image.png"],
    creator: "@thesolvers",
    site: "@thesolvers",
  },
  verification: {
    google: "", // Google Search Console verification code yahan daalo
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="canonical" href="https://thesolvers.online" />
      </head>
      <body
        suppressHydrationWarning
        style={{ overflowX: "hidden", maxWidth: "100vw" }}
      >
        {children}
      </body>
    </html>
  );
}
