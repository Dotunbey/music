# Tami Bedford Website

Premium music academy and creative studio website for Tami Bedford Sessions.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React icons

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Check

```bash
npm run lint
npm run build
npm run start
```

## Environment Variables

Create a `.env.local` file for local development (never commit secrets) with:

```bash
DATABASE_URL=                # Supabase Postgres connection URL
SUPABASE_DATABASE_URL=       # Optional alternate name
RESEND_API_KEY=              # Resend API key
RESEND_FROM_EMAIL=           # Verified sender in Resend
ADMIN_NOTIFICATION_EMAIL=     # Team inbox for inquiry alerts
NEXT_PUBLIC_SITE_URL=        # Optional public site URL for admin link in emails
ADMIN_PASSWORD=              # Shared team password for the /admin panel
ADMIN_SESSION_SECRET=        # Long random string signing admin session cookies (openssl rand -hex 32)
```

## Admin Panel

`/admin` is a password-protected dashboard for managing inquiries: a stats
overview, a filterable queue, and per-inquiry detail pages with a status
pipeline (new → reviewing → contacted → scheduled → enrolled → closed / spam)
and internal notes. Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`, then sign
in at `/admin/login`. Sessions last 7 days; `/admin` is excluded from
robots.txt.

## Database Migration

```bash
npm run db:generate
npm run db:push
```

## Routes

- `/`
- `/sessions`
- `/sessions/piano`
- `/sessions/organ`
- `/sessions/production`
- `/services`
- `/work`
- `/about`
- `/apply`
