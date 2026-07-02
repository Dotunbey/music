"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  constantTimeEqual,
  createSessionToken,
  sha256Hex,
} from "@/lib/admin-token";
import { logger } from "@/lib/logger";
import { checkRateLimit, cleanupStore } from "@/lib/rate-limiter";

export type AdminLoginState = {
  status: "idle" | "error";
  message: string;
};

function extractClientIp(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return headersList.get("x-real-ip") ?? "unknown";
}

export async function loginAction(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    logger.error({
      message: "Admin login attempted without ADMIN_PASSWORD/ADMIN_SESSION_SECRET configured",
      context: "admin-auth",
    });
    return {
      status: "error",
      message: "Admin access is not configured on this deployment.",
    };
  }

  const headersList = await headers();
  const clientIp = extractClientIp(headersList);
  cleanupStore();
  const rateLimit = checkRateLimit(`admin-login:${clientIp}`, 5, 60_000);
  if (!rateLimit.allowed) {
    logger.warn({
      message: "Admin login rate limit exceeded",
      context: "admin-auth",
    });
    return {
      status: "error",
      message: "Too many attempts. Wait a minute and try again.",
    };
  }

  // Compare fixed-length digests so neither timing nor length leaks.
  const matches = constantTimeEqual(
    await sha256Hex(password),
    await sha256Hex(adminPassword),
  );

  if (!matches) {
    logger.warn({
      message: "Admin login failed",
      context: "admin-auth",
    });
    return { status: "error", message: "Incorrect password." };
  }

  const token = await createSessionToken(sessionSecret);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  logger.info({ message: "Admin logged in", context: "admin-auth" });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
