# Production operations

## Environment

- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS origin. Use `https://music-henna-psi.vercel.app` until the custom domain is live.
- `DATABASE_URL`: Supabase transaction-pooler URL for Vercel runtime traffic.
- `DIRECT_DATABASE_URL`: direct Supabase Postgres URL for Drizzle migrations, backup, and restore only.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_GALLERY_BUCKET`: Storage access. Never expose the service role key.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL`: email delivery.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`: inquiry abuse protection.
- `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`: admin authentication.
- `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`: runtime reporting and production source maps. The auth token is server/build-only.
- `MAINTENANCE_SECRET`: bearer token for `/api/health`.

## Monitoring

Configure Vercel monitoring to request `GET /api/health` with `Authorization: Bearer <MAINTENANCE_SECRET>`. Alert after two consecutive non-200 responses and on sustained latency above four seconds. Create Sentry alerts for Server Action failures, database/storage health failures, and email-delivery errors.

## Storage audit

`/admin/maintenance` reports objects older than 24 hours that are not referenced by Gallery or Portfolio records. Deletion is always an explicit admin action and rechecks the object before removal.

## Backup and restore

Run `npm run db:backup -- -OutputDirectory D:\secure-backups` on an operator machine with PostgreSQL tools and GPG installed. Store encrypted exports outside the repository. Restore only into a verified target with `npm run db:restore -- -BackupFile D:\secure-backups\file.dump.gpg -ConfirmRestore`.

Use Supabase-managed backups when the project tier provides them. Operator exports remain necessary before schema changes and quarterly drills.

## Quarterly restore drill

1. Restore the latest encrypted export into an isolated Supabase project.
2. Verify inquiry, Gallery, Portfolio, and admin records.
3. Verify every referenced Storage path and sample page.
4. Verify admin login, Gallery rendering, Portfolio playback, inquiry submission, Turnstile, and both email directions.
5. Record restore duration, missing assets, errors, and corrective actions outside the repository.

## Domain cutover

Do not set `tamibedford.com` as canonical until it serves the application with valid HTTPS. Then update `NEXT_PUBLIC_SITE_URL`, configure Vercel's permanent host redirect, redeploy, and resubmit `/sitemap.xml` to Google Search Console.
