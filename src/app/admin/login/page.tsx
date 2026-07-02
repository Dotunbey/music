import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdminSessionValid } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminSessionValid()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-md border border-cream/20 bg-cream/8 font-display text-2xl font-black text-cream">
            tb
          </span>
          <h1 className="mt-5 font-display text-4xl font-black text-cream">
            Team sign in
          </h1>
          <p className="mt-3 leading-7 text-cream/70">
            Enter the admin password to manage inquiries.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
