# Deployment Plan

## Current State

The site is a Next.js App Router project pushed to GitHub:

- Repository: `https://github.com/Dotunbey/music`
- Branch: `main`
- Framework: Next.js
- Package manager: npm
- Build command: `npm run build`
- Start command for Node hosting: `npm run start`
- Static assets: stored in `public/`, including active images in `public/images/`

## Deployment Goals

- Deploy the current marketing site quickly.
- Keep every push to `main` production-ready.
- Use preview deployments for review before production changes.
- Add backend infrastructure in a way that does not break static pages.
- Keep secrets out of GitHub and local commits.

## Recommended Hosting

Use Vercel first.

Reasons:

- Native Next.js support.
- GitHub import is straightforward.
- Preview deployments for branches and pull requests.
- Built-in image optimization for `next/image`.
- Easy connection to Neon Postgres, Upstash Redis, Resend, and Blob storage.

Portable alternatives:

- Netlify for frontend hosting with serverless functions.
- Render for Node hosting.
- Railway for app plus Postgres.
- Fly.io for containerized hosting.

Vercel remains the simplest fit for this project.

## Vercel Deployment Steps

### 1. Import Project

1. Open Vercel dashboard.
2. Choose Add New Project.
3. Import `Dotunbey/music` from GitHub.
4. Keep root directory as project root.
5. Confirm framework preset is Next.js.
6. Use the default install command or set it explicitly to `npm install`.
7. Set build command to `npm run build`.
8. Deploy.

### 2. Configure Domains

Initial:

- Use the generated Vercel preview and production URLs.

Production:

- Add the final domain in Vercel Project Settings.
- Update DNS records at the domain registrar.
- Set the canonical production domain.
- Add redirects for `www` or non-`www`, depending on the preferred domain.

Recommended canonical pattern:

- `tamibedford.com`
- redirect `www.tamibedford.com` to `tamibedford.com`

### 3. Configure Environment Variables

Current static site requires no private environment variables.

When backend Phase 1 starts, add:

```bash
DATABASE_URL=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_NOTIFICATION_EMAIL=support@tamibedford.com
NEXT_PUBLIC_SITE_URL=https://tamibedford.com
```

Add variables in all relevant Vercel environments:

- Production
- Preview
- Development, if using `vercel env pull`

Never commit `.env`, `.env.local`, or copied secrets.

### 4. Configure Storage

Phase 1:

- Add Neon Postgres from the Vercel Marketplace.
- Connect it to the Vercel project.
- Confirm `DATABASE_URL` is available in Preview and Production.

Later:

- Add Upstash Redis for rate limiting.
- Add Vercel Blob for admin-uploaded images and learning materials.
- Add Edge Config only for feature flags or emergency toggles.

### 5. Configure Email

Use Resend for transactional emails.

Steps:

1. Create a Resend account.
2. Verify the sender domain.
3. Add DNS records required by Resend.
4. Add `RESEND_API_KEY` to Vercel.
5. Add `RESEND_FROM_EMAIL` to Vercel.
6. Send a test inquiry from the Vercel preview URL.

Do not send production mail from an unverified or generic sender long-term.

## Git Workflow

Recommended branch model:

- `main`: production branch.
- `codex/*` or feature branches: implementation work.
- Pull requests: review and preview deployments.

Workflow:

1. Create a feature branch.
2. Make changes.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Push branch.
6. Review Vercel preview URL.
7. Merge to `main`.
8. Vercel deploys production from `main`.

## Build And Release Checks

Before merging to `main`:

```bash
npm run lint
npm run build
```

Manual checks:

- Home page loads.
- Sessions page loads.
- Session detail pages load: Piano, Organ, Production.
- Services page loads.
- Work page loads.
- About page loads.
- Apply page loads.
- Mobile navigation opens and closes.
- Apply form submits or prepares inquiry as expected.
- No broken images.
- No horizontal scrolling on mobile.
- No console errors on key pages.

## Backend Migration Deployment

When database migrations are added, use a controlled sequence.

Preview sequence:

1. Create preview database branch if using Neon branching.
2. Run migrations against preview database.
3. Deploy preview.
4. Test form submission and admin flows.

Production sequence:

1. Back up or snapshot production database.
2. Run backward-compatible migrations first.
3. Deploy app changes.
4. Verify logs and form submissions.
5. Remove old columns or old behavior only in a later deploy.

Avoid deployments where new code requires a migration that has not run yet.

## CI/CD Options

### Simple Vercel Git Integration

Use this first.

Behavior:

- Every push to `main` creates a production deployment.
- Every pull request creates a preview deployment.
- Vercel runs install and build automatically.

### GitHub Actions With Vercel CLI

Add only if the team needs custom gates before deploy.

Use cases:

- Run tests before deploying.
- Run database migrations in a controlled step.
- Promote a tested preview to production.
- Add automated browser checks.

Required GitHub secrets:

```bash
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
```

Recommended production deploy flow:

```bash
vercel pull --yes --environment=production --token=$VERCEL_TOKEN
vercel build --prod --token=$VERCEL_TOKEN
vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
```

## Rollback Plan

Frontend-only rollback:

1. Open Vercel project deployments.
2. Select the last known good production deployment.
3. Promote or rollback to that deployment.

Backend rollback:

- Prefer forward fixes for database schema issues.
- Keep migrations backward-compatible.
- Do not drop columns in the same release that removes app usage.
- Keep database snapshots before major schema changes.

## Monitoring And Operations

Minimum setup:

- Vercel deployment status notifications.
- Vercel runtime logs.
- Email delivery logs in Resend.
- Database dashboard monitoring in Neon.

Recommended later:

- Vercel Web Analytics.
- Vercel Speed Insights.
- Error tracking with Sentry or similar.
- Uptime monitor for the production domain.
- Weekly database backup review.

## Security Checklist

- Keep all secrets in Vercel environment variables.
- Do not expose service keys to `NEXT_PUBLIC_*`.
- Validate form submissions on the server.
- Rate-limit public mutations.
- Protect admin routes with real authentication.
- Re-check admin permissions in Server Components and Server Actions.
- Avoid storing raw IP addresses unless there is a clear privacy reason.
- Rotate credentials if a secret is ever exposed.

## Deployment Milestones

### Milestone 1: Static Production Launch

Deliverables:

- Import GitHub repo into Vercel.
- Deploy production URL.
- Connect domain.
- Verify all public pages.

### Milestone 2: Backend-Ready Preview

Deliverables:

- Add Neon Postgres.
- Add Resend.
- Add environment variables.
- Deploy preview with server-backed Apply form.

### Milestone 3: Operational Backend

Deliverables:

- Persist inquiries.
- Send notifications.
- Add admin review dashboard.
- Add status tracking and notes.

### Milestone 4: Growth Features

Deliverables:

- Work content management.
- Student enrollment records.
- Booking workflow.
- Payment tracking or payment provider integration.

## Recommended Next Step

Deploy the current static site to Vercel first. After the production URL is stable, implement backend Phase 1 on a feature branch and test it through Vercel preview deployments before merging to `main`.
