import Link from "next/link";
import { Camera, Mail, Phone, Play } from "lucide-react";
import { contact, navItems } from "@/lib/content";
import { ActionLink } from "./action-link";
import { interactiveStateClasses } from "@/lib/ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-cream/10 bg-charcoal text-cream">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
        <div>
          <p className="font-display text-3xl font-black">Tami Bedford</p>
          <p className="mt-4 max-w-md leading-8 text-cream/82">
            Premium music sessions and creative production support for musicians
            who want structure, clarity, and standards that carry into real work.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ActionLink href="/apply">Apply for Sessions</ActionLink>
            <ActionLink href="/services" variant="ghost">
              View Services
            </ActionLink>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase text-red-500">Navigation</p>
          <nav className="mt-5 grid gap-3" aria-label="Footer">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md text-cream/82 hover:text-cream ${interactiveStateClasses}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-sm font-bold uppercase text-red-500">Contact</p>
          <div className="mt-5 grid gap-4 text-cream/82">
            <a
              className={`flex items-center gap-3 rounded-md hover:text-cream ${interactiveStateClasses}`}
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
            >
              <Phone aria-hidden="true" className="h-4 w-4 text-brass" />
              {contact.phone}
            </a>
            <a
              className={`flex items-center gap-3 rounded-md hover:text-cream ${interactiveStateClasses}`}
              href={`mailto:${contact.email}`}
            >
              <Mail aria-hidden="true" className="h-4 w-4 text-brass" />
              {contact.email}
            </a>
            <a
              className={`flex items-center gap-3 rounded-md hover:text-cream ${interactiveStateClasses}`}
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Camera aria-hidden="true" className="h-4 w-4 text-brass" />
              Instagram
            </a>
            <a
              className={`flex items-center gap-3 rounded-md hover:text-cream ${interactiveStateClasses}`}
              href={contact.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Play aria-hidden="true" className="h-4 w-4 text-brass" />
              YouTube
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 px-5 py-5 text-center text-sm text-cream/70">
        &copy; 2026 Tami Bedford. Built for Sessions, services, and creative work.
      </div>
    </footer>
  );
}
