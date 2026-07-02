import Link from "next/link";
import { count, desc, gte, sql } from "drizzle-orm";
import { ArrowRight } from "lucide-react";
import { getDbClient } from "@/lib/db/client";
import { inquiries, type InquiryStatus } from "@/lib/db/schema";
import {
  formatDateTime,
  statusLabels,
  statusPillClasses,
} from "@/lib/admin-ui";
import { normalizeTrackLabel } from "@/lib/inquiry-utils";
import { interactiveStateClasses } from "@/lib/ui";

export default async function AdminOverviewPage() {
  const db = await getDbClient();

  const [totalRows, weekRows, byStatus, byTrack, recent] = await Promise.all([
    db.select({ value: count() }).from(inquiries),
    db
      .select({ value: count() })
      .from(inquiries)
      .where(gte(inquiries.createdAt, sql`now() - interval '7 days'`)),
    db
      .select({ status: inquiries.status, value: count() })
      .from(inquiries)
      .groupBy(inquiries.status),
    db
      .select({ track: inquiries.track, value: count() })
      .from(inquiries)
      .groupBy(inquiries.track)
      .orderBy(desc(count()))
      .limit(6),
    db
      .select({
        id: inquiries.id,
        name: inquiries.name,
        track: inquiries.track,
        status: inquiries.status,
        createdAt: inquiries.createdAt,
      })
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(5),
  ]);

  const total = totalRows[0]?.value ?? 0;
  const thisWeek = weekRows[0]?.value ?? 0;
  const statusCount = (status: InquiryStatus) =>
    byStatus.find((row) => row.status === status)?.value ?? 0;
  const maxTrack = Math.max(1, ...byTrack.map((row) => row.value));

  const statCards = [
    { label: "New inquiries", value: statusCount("new") },
    { label: "This week", value: thisWeek },
    { label: "Enrolled", value: statusCount("enrolled") },
    { label: "All time", value: total },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-black">Overview</h1>
          <p className="mt-2 leading-7 text-cream/70">
            Where the inquiry pipeline stands right now.
          </p>
        </div>
        <Link
          href="/admin/inquiries?status=new"
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}
        >
          Work the queue
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-cream/12 bg-cream/[0.04] p-5"
          >
            <p className="font-display text-4xl font-black text-cream">
              {card.value}
            </p>
            <p className="mt-1 text-sm font-bold uppercase text-cream/60">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <div className="mt-10 rounded-lg border border-cream/12 bg-cream/[0.04] p-10 text-center">
          <h2 className="font-display text-2xl font-black">No inquiries yet.</h2>
          <p className="mx-auto mt-3 max-w-md leading-7 text-cream/70">
            When someone applies through the site, their inquiry shows up here
            and the team gets an email.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6">
            <h2 className="text-sm font-bold uppercase text-cream/60">
              Pipeline by status
            </h2>
            <div className="mt-5 grid gap-3">
              {(Object.keys(statusLabels) as InquiryStatus[]).map((status) => {
                const value = statusCount(status);
                const width = total > 0 ? Math.max(2, (value / total) * 100) : 2;
                return (
                  <Link
                    key={status}
                    href={`/admin/inquiries?status=${status}`}
                    className={`group grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 rounded-md p-1 hover:bg-cream/[0.05] ${interactiveStateClasses}`}
                  >
                    <span className="text-sm font-bold uppercase text-cream/70 group-hover:text-cream">
                      {statusLabels[status]}
                    </span>
                    <span className="h-2 overflow-hidden rounded-full bg-cream/8">
                      <span
                        className="block h-full rounded-full bg-brass"
                        style={{ width: `${width}%` }}
                      />
                    </span>
                    <span className="text-right text-sm text-cream/70">
                      {value}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6">
            <h2 className="text-sm font-bold uppercase text-cream/60">
              Demand by track
            </h2>
            <div className="mt-5 grid gap-3">
              {byTrack.map((row) => (
                <div
                  key={row.track}
                  className="grid grid-cols-[1fr_2.5rem] items-center gap-3"
                >
                  <div>
                    <p className="text-sm font-bold text-cream/82">
                      {normalizeTrackLabel(row.track)}
                    </p>
                    <span className="mt-1 block h-2 overflow-hidden rounded-full bg-cream/8">
                      <span
                        className="block h-full rounded-full bg-red-600"
                        style={{ width: `${Math.max(2, (row.value / maxTrack) * 100)}%` }}
                      />
                    </span>
                  </div>
                  <span className="text-right text-sm text-cream/70">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-bold uppercase text-cream/60">
                Latest inquiries
              </h2>
              <Link
                href="/admin/inquiries"
                className={`text-sm font-bold uppercase text-brass hover:text-cream ${interactiveStateClasses}`}
              >
                View all
              </Link>
            </div>
            <div className="mt-4 grid gap-2">
              {recent.map((row) => (
                <Link
                  key={row.id}
                  href={`/admin/inquiries/${row.id}`}
                  className={`flex flex-col gap-2 rounded-md border border-cream/10 bg-ink/40 p-4 hover:border-brass/50 sm:flex-row sm:items-center sm:justify-between ${interactiveStateClasses}`}
                >
                  <div>
                    <p className="font-bold text-cream">{row.name}</p>
                    <p className="text-sm text-cream/60">
                      {normalizeTrackLabel(row.track)} ·{" "}
                      {formatDateTime(row.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusPillClasses[row.status]}`}
                  >
                    {statusLabels[row.status]}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
