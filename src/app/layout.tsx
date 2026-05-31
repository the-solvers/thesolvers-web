import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TheSolvers — 100 Real Problems. 100 Real Solutions.",
  description: "We find real-world problems and build products that solve them. Follow our journey of building 100 solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}