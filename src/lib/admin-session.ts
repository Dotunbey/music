import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-token";

export async function isAdminSessionValid(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return false;
  }

  return verifySessionToken(token, secret);
}

export async function requireAdmin(): Promise<void> {
  const valid = await isAdminSessionValid();
  if (!valid) {
    redirect("/admin/login");
  }
}
