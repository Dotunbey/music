import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Inbox, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/admin-auth";
import { requireAdmin } from "@/lib/admin-session";
import { interactiveStateClasses } from "@/lib/ui";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Tami Bedford Admin",
  },
  robots: { index: false, follow: false },
};

// Admin pages read cookies and query live data — never prerender them.
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
] as const;

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdmin();

  return (
    <div className="flex min-h-svh flex-col bg-ink text-cream">
      <header className="border-b border-cream/10 bg-charcoal/60 px-5 md:px-8">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className={`flex items-center gap-3 rounded-md ${interactiveStateClasses}`}
            >
              <span className="grid h-9 w-9 place-items-center rounded-md border border-cream/20 bg-cream/8 font-display text-lg font-black">
                tb
              </span>
              <span className="text-sm font-bold uppercase text-cream/82">
                Admin
              </span>
            </Link>
            <nav className="flex items-center gap-1" aria-label="Admin">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold uppercase text-cream/70 hover:bg-cream/10 hover:text-cream ${interactiveStateClasses}`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className={`inline-flex items-center gap-2 rounded-md border border-cream/18 px-3 py-2 text-sm font-bold uppercase text-cream/70 hover:border-red-500 hover:text-white ${interactiveStateClasses}`}
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 md:px-8">
        {children}
      </main>
    </div>
  );
}
