import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — TheSolvers",
  description:
    "Have a real problem worth solving? Want to collaborate or follow the journey? Get in touch with TheSolvers.",
  alternates: {
    canonical: "https://thesolvers.online/contact",
  },
  openGraph: {
    url: "https://thesolvers.online/contact",
    title: "Contact TheSolvers",
    description:
      "Have a problem worth solving? A collaboration idea? Reach out — we reply within 24 hours.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
