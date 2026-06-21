import { init } from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;
const environment = process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV;

if (dsn) {
  init({
    dsn,
    environment,
    tracesSampleRate: 0.1,
    integrations: [],
  });
}
