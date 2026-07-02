import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getDbClient } from "@/lib/db/client";
import {
  inquiries,
  inquiryStatusEnum,
  type InquiryStatus,
} from "@/lib/db/schema";
import {
  formatDateTime,
  statusLabels,
  statusPillClasses,
} from "@/lib/admin-ui";
import { normalizeTrackLabel } from "@/lib/inquiry-utils";
import { services, sessions } from "@/lib/content";
import { formFieldClasses, interactiveStateClasses } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Inquiries",
};

const PAGE_SIZE = 25;

const trackOptions = [
  ...sessions.map((session) => ({ value: session.slug, label: session.title })),
  ...services.map((service) => ({ value: service.title, label: service.title })),
];

type InquiriesPageProps = {
  searchParams: Promise<{
    status?: string;
    track?: string;
    q?: string;
    page?: string;
  }>;
};

function buildQueryString(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query.set(key, value);
    }
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

export default async function AdminInquiriesPage({
  searchParams,
}: InquiriesPageProps) {
  const params = await searchParams;

  const status = (inquiryStatusEnum.enumValues as readonly string[]).includes(
    params.status ?? "",
  )
    ? (params.status as InquiryStatus)
    : undefined;
  const track = trackOptions.some((option) => option.value === params.track)
    ? params.track
    : undefined;
  const q = params.q?.trim().slice(0, 120) || undefined;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const conditions: SQL[] = [];
  if (status) {
    conditions.push(eq(inquiries.status, status));
  }
  if (track) {
    conditions.push(eq(inquiries.track, track));
  }
  if (q) {
    const pattern = `%${q.replace(/[%_]/g, "\\$&")}%`;
    const search = or(
      ilike(inquiries.name, pattern),
      ilike(inquiries.email, pattern),
    );
    if (search) {
      conditions.push(search);
    }
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const db = await getDbClient();
  const [rows, totalRows] = await Promise.all([
    db
      .select({
        id: inquiries.id,
        name: inquiries.name,
        email: inquiries.email,
        track: inquiries.track,
        status: inquiries.status,
        createdAt: inquiries.createdAt,
      })
      .from(inquiries)
      .where(where)
      .orderBy(desc(inquiries.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ value: count() }).from(inquiries).where(where),
  ]);

  const total = totalRows[0]?.value ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const baseParams = { status, track, q };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-black">Inquiries</h1>
          <p className="mt-2 leading-7 text-cream/70">
            {total} {total === 1 ? "inquiry" : "inquiries"}
            {status ? ` · ${statusLabels[status]}` : ""}
            {q ? ` · matching “${q}”` : ""}
          </p>
        </div>
        <form className="flex gap-2" action="/admin/inquiries" method="get">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <select
            name="track"
            defaultValue={track ?? ""}
            className={`${formFieldClasses} min-w-40`}
            aria-label="Filter by track"
          >
            <option value="">All tracks</option>
            {trackOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name or email"
            className={`${formFieldClasses} w-full md:w-64`}
            aria-label="Search inquiries"
          />
          <button
            type="submit"
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-cream/18 px-4 text-sm font-bold uppercase hover:border-brass hover:text-brass ${interactiveStateClasses}`}
          >
            <Search aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`/admin/inquiries${buildQueryString({ track, q })}`}
          className={`rounded-full border px-4 py-2 text-xs font-bold uppercase ${interactiveStateClasses} ${
            !status
              ? "border-cream bg-cream text-ink"
              : "border-cream/20 text-cream/70 hover:border-cream/50 hover:text-cream"
          }`}
        >
          All
        </Link>
        {inquiryStatusEnum.enumValues.map((value) => (
          <Link
            key={value}
            href={`/admin/inquiries${buildQueryString({ status: value, track, q })}`}
            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase ${interactiveStateClasses} ${
              status === value
                ? "border-cream bg-cream text-ink"
                : "border-cream/20 text-cream/70 hover:border-cream/50 hover:text-cream"
            }`}
          >
            {statusLabels[value]}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-lg border border-cream/12 bg-cream/[0.04] p-10 text-center">
          <h2 className="font-display text-2xl font-black">
            Nothing here yet.
          </h2>
          <p className="mx-auto mt-3 max-w-md leading-7 text-cream/70">
            No inquiries match this view. New applications from the site land
            in the “New” tab automatically.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-cream/12">
          <div className="grid gap-px bg-cream/8">
            {rows.map((row) => (
              <Link
                key={row.id}
                href={`/admin/inquiries/${row.id}`}
                className={`grid grid-cols-1 gap-2 bg-ink p-4 hover:bg-charcoal sm:grid-cols-[1.4fr_1fr_auto_auto] sm:items-center sm:gap-4 ${interactiveStateClasses}`}
              >
                <div>
                  <p className="font-bold text-cream">{row.name}</p>
                  <p className="text-sm text-cream/60">{row.email}</p>
                </div>
                <p className="text-sm text-cream/70">
                  {normalizeTrackLabel(row.track)}
                </p>
                <p className="text-sm text-cream/60">
                  {formatDateTime(row.createdAt)}
                </p>
                <span
                  className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusPillClasses[row.status]}`}
                >
                  {statusLabels[row.status]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-between">
          {page > 1 ? (
            <Link
              href={`/admin/inquiries${buildQueryString({ ...baseParams, page: String(page - 1) })}`}
              className={`inline-flex items-center gap-2 rounded-md border border-cream/18 px-4 py-2 text-sm font-bold uppercase hover:border-brass hover:text-brass ${interactiveStateClasses}`}
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              Newer
            </Link>
          ) : (
            <span />
          )}
          <p className="text-sm text-cream/60">
            Page {page} of {totalPages}
          </p>
          {page < totalPages ? (
            <Link
              href={`/admin/inquiries${buildQueryString({ ...baseParams, page: String(page + 1) })}`}
              className={`inline-flex items-center gap-2 rounded-md border border-cream/18 px-4 py-2 text-sm font-bold uppercase hover:border-brass hover:text-brass ${interactiveStateClasses}`}
            >
              Older
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      ) : null}
    </>
  );
}
