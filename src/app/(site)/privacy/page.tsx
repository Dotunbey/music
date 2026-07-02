import type { Metadata } from "next";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Tami Bedford collects, uses, and protects the information you share when you apply for sessions or services.",
};

const sections = [
  {
    title: "What we collect",
    body: [
      "When you submit an inquiry through this site, we collect the details you type into the form: your name, email address, phone number (if you choose to share it), the session or service you are interested in, your experience level, your preferred schedule, and your message.",
      "We also record the page you applied from and, if you arrived through a promotion, basic campaign tags (UTM parameters). To protect the form from spam, we store a one-way cryptographic hash of your IP address and browser identifier — the actual IP address and browser details are never stored and cannot be recovered from the hash.",
    ],
  },
  {
    title: "Why we collect it",
    body: [
      "We use your information for one purpose: to respond to your inquiry and, if you decide to continue, to arrange your sessions or project. That includes replying by email or WhatsApp, agreeing on scheduling, and keeping internal notes on the conversation so we serve you properly.",
      "We do not sell your information, share it with advertisers, or use it for any purpose unrelated to your inquiry.",
    ],
  },
  {
    title: "Where it lives",
    body: [
      "Inquiries are stored in a secured PostgreSQL database hosted in the European Union (Frankfurt). Transactional emails — the confirmation you receive and the notification our team receives — are delivered through Resend. Access to inquiry records is limited to the Tami Bedford team through a password-protected admin area.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "The public site does not use tracking or advertising cookies. A single functional cookie exists only for team members signed into the admin area. If the spam-protection check (Cloudflare Turnstile) is active on the application form, Cloudflare may set a functional cookie strictly to verify you are human.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep inquiry records for as long as they are relevant to an active or potential student relationship. You can ask us at any time to show you what we hold about you, correct it, or delete it entirely.",
    ],
  },
  {
    title: "Your rights and contact",
    body: [
      `To access, correct, or delete your information — or to ask anything about this policy — email ${contact.email} or message ${contact.phone} on WhatsApp. We honour deletion requests fully: the record and its history are removed from the database, not just hidden.`,
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <section className="bg-ink px-5 pb-24 pt-36 text-cream md:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase text-red-400">Privacy</p>
        <h1 className="mt-3 font-display text-5xl font-black leading-none text-balance md:text-6xl">
          Your information, handled plainly.
        </h1>
        <p className="mt-6 text-lg leading-8 text-cream/82">
          This page explains what we collect when you apply for sessions or
          services, why we collect it, and the control you keep over it. Last
          updated July 2026.
        </p>

        <div className="mt-12 grid gap-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-2xl font-black md:text-3xl">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4 leading-8 text-cream/82">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
