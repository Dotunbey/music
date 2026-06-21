# Backend And Database Plan

## Purpose

The current Tami Bedford website is a polished marketing and conversion site. Forms prepare email or WhatsApp messages on the client, and all sessions, services, team, and work content live in `src/lib/content.ts`.

The backend should turn the site into an operational platform for capturing applications, handling service inquiries, tracking follow-up, and later managing content, bookings, students, and payments.

## Product Goals

- Capture every Apply and service inquiry directly in a database.
- Notify the team by email when a new inquiry arrives.
- Give the team a simple admin workflow for reviewing, filtering, and updating inquiry status.
- Keep public pages fast, mostly static, and low-maintenance.
- Add backend features in phases without blocking the current site deployment.

## Recommended Stack

- App backend: Next.js App Router Server Actions for form submissions and admin mutations.
- Public APIs: Next.js Route Handlers only where external systems need webhooks or API access.
- Database: Neon Postgres through the Vercel Marketplace.
- ORM: Drizzle ORM for type-safe schema, queries, and migrations.
- Validation: Zod for server-side form validation.
- Email: Resend for inquiry confirmations and team notifications.
- Rate limiting: Upstash Redis for anti-spam throttling once public forms write to the database.
- File storage: Vercel Blob for future media uploads, work assets, and downloadable learning materials.
- Admin auth: Clerk, Auth.js, or Supabase Auth. Pick one before building the admin area.

## Architecture Principles

- Keep public marketing pages as static as possible.
- Move all form trust boundaries to the server.
- Never initialize database, email, or Redis clients at module scope. Use lazy getter functions so `next build` does not fail when runtime env vars are absent.
- Keep personally identifiable data out of client logs and analytics payloads.
- Store inquiry history and state changes so the team can see what happened after submission.
- Build the admin area as a protected route group, not as public API endpoints with weak checks.

## Initial Backend Features

### 1. Application And Inquiry Submission

Replace the client-only mailto/WhatsApp behavior with a server-backed submission flow.

Flow:

1. User submits the Apply form.
2. Server validates required fields.
3. Server rate-limits by IP and email.
4. Server stores the inquiry in Postgres.
5. Server sends notification email to `support@tamibedford.com`.
6. Server optionally sends confirmation email to the applicant.
7. UI shows a success state with WhatsApp as an optional follow-up link.

Required form fields:

- full name
- email
- selected course or service
- experience level
- preferred session day/time
- message
- source page or track query

Recommended hidden/system fields:

- submission source
- user agent hash
- IP hash or rate-limit key
- consent timestamp
- spam honeypot field

### 2. Admin Inquiry Dashboard

Create a protected dashboard for Tami Bedford staff.

Core views:

- All inquiries
- New applications
- Service inquiries
- Follow-up needed
- Closed or archived

Core actions:

- Update status
- Add internal notes
- Assign inquiry owner
- Mark contacted
- Export CSV
- Open email or WhatsApp reply link

Suggested statuses:

- `new`
- `reviewing`
- `contacted`
- `scheduled`
- `enrolled`
- `closed`
- `spam`

### 3. Content Management Lite

Keep public content in code for now unless Tami needs frequent edits. Add database-managed content only when there is a clear editor workflow.

Good first database-managed content:

- testimonials
- work items
- featured releases
- FAQ entries
- pricing overrides

Keep in code initially:

- core navigation
- session definitions
- service definitions
- team bios

### 4. Notifications

Email notifications should include:

- applicant name
- selected course or service
- experience level
- preferred time
- message
- admin link to the inquiry
- direct reply links for email and WhatsApp

Use Resend from server code only. Keep the sender domain verified before production launch.

## Proposed Database Model

### `inquiries`

Stores every Apply form and service request.

Fields:

- `id` uuid primary key
- `type` text, one of `session`, `service`, `general`
- `track` text, such as `piano`, `organ`, `production`, or service title
- `name` text
- `email` text
- `phone` text nullable
- `experience_level` text
- `preferred_time` text
- `message` text
- `status` text default `new`
- `source_path` text nullable
- `utm_source` text nullable
- `utm_medium` text nullable
- `utm_campaign` text nullable
- `created_at` timestamp
- `updated_at` timestamp

Indexes:

- `created_at`
- `status`
- `track`
- `email`

### `inquiry_notes`

Stores staff notes and status history.

Fields:

- `id` uuid primary key
- `inquiry_id` uuid foreign key to `inquiries.id`
- `author_id` uuid nullable
- `note` text
- `old_status` text nullable
- `new_status` text nullable
- `created_at` timestamp

Indexes:

- `inquiry_id`
- `created_at`

### `admin_users`

Stores admin identity metadata if the auth provider does not already own it.

Fields:

- `id` uuid primary key
- `auth_provider_id` text unique
- `email` text unique
- `name` text nullable
- `role` text default `staff`
- `created_at` timestamp
- `updated_at` timestamp

Roles:

- `owner`
- `admin`
- `staff`

### `students`

Add only when enrollment tracking is needed.

Fields:

- `id` uuid primary key
- `inquiry_id` uuid nullable
- `name` text
- `email` text
- `phone` text nullable
- `active_track` text
- `status` text default `active`
- `created_at` timestamp
- `updated_at` timestamp

### `bookings`

Add only when scheduling is moved into the product.

Fields:

- `id` uuid primary key
- `student_id` uuid foreign key to `students.id`
- `track` text
- `starts_at` timestamp
- `ends_at` timestamp
- `meeting_url` text nullable
- `status` text default `scheduled`
- `created_at` timestamp
- `updated_at` timestamp

### `work_items`

Add when the Work hub needs real content instead of preview cards.

Fields:

- `id` uuid primary key
- `category` text, one of `music`, `poetry`, `short_film`
- `title` text
- `slug` text unique
- `summary` text
- `body` text nullable
- `cover_image_url` text nullable
- `external_url` text nullable
- `published` boolean default false
- `published_at` timestamp nullable
- `created_at` timestamp
- `updated_at` timestamp

## Future Modules

### Booking And Scheduling

Options:

- Lightweight: store preferred times, staff manually confirms by email or WhatsApp.
- Medium: add booking slots and admin-managed availability.
- Advanced: integrate Calendly, Google Calendar, or Cal.com.

Recommended path: start lightweight, then add scheduling once inquiry volume proves the need.

### Payments

Do not add payment handling until the enrollment process is clear.

Likely options:

- Paystack for Nigerian cards, bank transfer, and local payment methods.
- Stripe for international cards if the business entity supports it.
- Manual bank transfer confirmation as the first operational step.

Payment model later:

- `invoices`
- `payments`
- `subscriptions` or `enrollments`

### Learning Materials

If students need downloadable resources:

- Store files in Vercel Blob.
- Store file metadata and access rules in Postgres.
- Gate private files behind authenticated student access.

## Implementation Phases

### Phase 0: Decisions

Decide:

- Database provider: Neon Postgres recommended.
- Auth provider: Clerk, Auth.js, or Supabase Auth.
- Email provider: Resend recommended.
- Whether admin dashboard is needed immediately or after submissions are stored.
- Whether phone number should be added as a required form field.

### Phase 1: Persist Inquiries

Deliverables:

- Install Drizzle, Neon driver, Zod, and Resend.
- Add lazy database and email client getters.
- Add database schema and migrations for `inquiries`.
- Convert Apply form to server-backed submission.
- Send team notification email on submission.
- Show success and failure states in the UI.

Validation:

- `npm run lint`
- `npm run build`
- Submit test inquiry locally.
- Confirm database row is created.
- Confirm email notification is sent in preview or production environment.

### Phase 2: Admin Review

Deliverables:

- Add admin auth.
- Add `/admin` route group.
- Add inquiry list, filters, detail view, notes, and status updates.
- Add CSV export.

Validation:

- Unauthenticated users cannot access admin routes.
- Staff can update status and add notes.
- Status changes are auditable.

### Phase 3: Content And Work Hub

Deliverables:

- Add `work_items` table.
- Add admin CRUD for Work entries.
- Render published work items on `/work`.
- Add cover image upload through Vercel Blob if needed.

Validation:

- Draft work items do not appear publicly.
- Published work items render correctly on mobile and desktop.
- Uploaded images are optimized and have alt text.

### Phase 4: Enrollment, Booking, And Payments

Deliverables:

- Promote inquiries into students.
- Add booking or scheduling flow.
- Add invoice/payment tracking.
- Add payment provider integration only after the manual business process is stable.

## Environment Variables

Expected variables by phase:

```bash
DATABASE_URL=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_NOTIFICATION_EMAIL=support@tamibedford.com
NEXT_PUBLIC_SITE_URL=
```

Later:

```bash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
BLOB_READ_WRITE_TOKEN=
AUTH_SECRET=
PAYSTACK_SECRET_KEY=
PAYSTACK_WEBHOOK_SECRET=
```

## Risks And Mitigations

- Spam submissions: add honeypot, rate limiting, and optional CAPTCHA.
- Missed inquiries: store before sending email, then retry failed notifications.
- Bad admin access control: re-check authorization in Server Components and Server Actions, not only in route protection.
- Build-time env failures: lazy-initialize all server clients.
- Scope creep: keep payments, calendar automation, and CMS editing out of the first backend phase.

## Recommended Next Step

Build Phase 1 first: Neon Postgres, Drizzle schema, server-backed Apply submission, and Resend notification email. This gives the business immediate operational value without forcing a full admin or payment system yet.
