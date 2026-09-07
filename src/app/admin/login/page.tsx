import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
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
          <Image src="/images/tami-bedford-logo.png" alt="Tami Bedford" width={88} height={88} priority className="mx-auto h-22 w-22 object-contain" />
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
