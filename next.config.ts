import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["postgres"],
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
};

export default withSentryConfig(nextConfig, {
  telemetry: false,
  widenClientFileUpload: true,
});
