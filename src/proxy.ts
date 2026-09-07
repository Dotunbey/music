import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-token";
import { getSiteUrl } from "@/lib/site-url";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (process.env.VERCEL_ENV === "production") {
    const canonical = new URL(getSiteUrl());
    if (request.nextUrl.host !== canonical.host) {
      const destination = request.nextUrl.clone();
      destination.protocol = canonical.protocol;
      destination.host = canonical.host;
      return NextResponse.redirect(destination, 308);
    }
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const valid = token && secret ? await verifySessionToken(token, secret) : false;

  if (!valid) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
