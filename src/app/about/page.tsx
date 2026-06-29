import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About — TheSolvers",
  description:
    "TheSolvers is a 100-week challenge to build 100 products solving real everyday problems. No VC funding, no hype — just honest build-in-public product development.",
  alternates: {
    canonical: "https://thesolvers.online/about",
  },
  openGraph: {
    url: "https://thesolvers.online/about",
    title: "About TheSolvers — Building 100 Real Solutions",
    description:
      "We build what people need, not what trends. 100 problems. 100 products. 100 weeks. Documented in public.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
