import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["postgres"],
  turbopack: {
    root: process.cwd(),
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [{
            protocol: "https" as const,
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
          }]
        : []),
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'none'", "form-action 'self'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com`,
      "style-src 'self' 'unsafe-inline'", "font-src 'self' data:",
      "img-src 'self' data: blob: https:", "media-src 'self' blob: https://*.supabase.co",
      "frame-src https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com https://open.spotify.com https://audiomack.com https://www.instagram.com",
      "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io",
      ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
    ].join("; ");
    return [{ source: "/(.*)", headers: [
      { key: "Content-Security-Policy", value: csp }, { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    ] }];
  },
};

export default async function configureNext() {
  if (process.env.NODE_ENV !== "production") return nextConfig;
  const { withSentryConfig } = await import("@sentry/nextjs");
  return withSentryConfig(nextConfig, {
  telemetry: false,
  widenClientFileUpload: true,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  silent: !process.env.CI,
  });
}
