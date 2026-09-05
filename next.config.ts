import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["postgres"],
  turbopack: {
    root: process.cwd(),
  },
  images: {
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
};

export default withSentryConfig(nextConfig, {
  telemetry: false,
  widenClientFileUpload: true,
});
