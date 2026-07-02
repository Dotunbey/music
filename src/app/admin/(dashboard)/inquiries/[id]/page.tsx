import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { updateInquiryStatusAction } from "@/actions/admin-inquiries";
import { AdminNoteForm } from "@/components/admin-note-form";
import { getDbClient } from "@/lib/db/client";
import {
  inquiries,
  inquiryEvents,
  inquiryStatusEnum,
} from "@/lib/db/schema";
import {
  formatDateTime,
  statusLabels,
  statusPillClasses,
} from "@/lib/admin-ui";
import { normalizeTrackLabel } from "@/lib/inquiry-utils";
import { interactiveStateClasses } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Inquiry",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type InquiryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminInquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    notFound();
  }

  const db = await getDbClient();
  const [inquiry] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, id));

  if (!inquiry) {
    notFound();
  }

  const events = await db
    .select()
    .from(inquiryEvents)
    .where(eq(inquiryEvents.inquiryId, id))
    .orderBy(desc(inquiryEvents.createdAt));

  const detailRows = [
    { label: "Track", value: normalizeTrackLabel(inquiry.track) },
    { label: "Inquiry type", value: inquiry.type },
    { label: "Experience level", value: inquiry.experienceLevel },
    { label: "Preferred time", value: inquiry.preferredTime },
    { label: "Source page", value: inquiry.sourcePath ?? "—" },
    {
      label: "UTM",
      value:
        [inquiry.utmSource, inquiry.utmMedium, inquiry.utmCampaign]
          .filter(Boolean)
          .join(" / ") || "—",
    },
    { label: "Consented", value: formatDateTime(inquiry.consentAt) },
    { label: "Received", value: formatDateTime(inquiry.createdAt) },
    { label: "Last updated", value: formatDateTime(inquiry.updatedAt) },
  ];

  return (
    <>
      <Link
        href="/admin/inquiries"
        className={`inline-flex items-center gap-2 rounded-md text-sm font-bold uppercase text-cream/60 hover:text-cream ${interactiveStateClasses}`}
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        All inquiries
      </Link>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-black">{inquiry.name}</h1>
          <p className="mt-2 text-cream/70">{inquiry.email}</p>
        </div>
        <span
          className={`inline-flex w-fit items-center rounded-full border px-4 py-1.5 text-sm font-bold uppercase ${statusPillClasses[inquiry.status]}`}
        >
          {statusLabels[inquiry.status]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
            `Your ${normalizeTrackLabel(inquiry.track)} inquiry`,
          )}`}
          className={`inline-flex min-h-11 items-center gap-2 rounded-md bg-red-600 px-4 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}
        >
          <Mail aria-hidden="true" className="h-4 w-4" />
          Email {inquiry.name.split(" ")[0]}
        </a>
        {inquiry.phone ? (
          <>
            <a
              href={`https://wa.me/${inquiry.phone.replace(/[^\d]/g, "")}`}
              className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-cream/18 px-4 text-sm font-bold uppercase hover:border-brass hover:text-brass ${interactiveStateClasses}`}
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={`tel:${inquiry.phone}`}
              className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-cream/18 px-4 text-sm font-bold uppercase hover:border-brass hover:text-brass ${interactiveStateClasses}`}
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              {inquiry.phone}
            </a>
          </>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="grid gap-6">
          <section className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6">
            <h2 className="text-sm font-bold uppercase text-cream/60">
              Message
            </h2>
            <p className="mt-3 whitespace-pre-line leading-8 text-cream/90">
              {inquiry.message}
            </p>
          </section>

          <section className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6">
            <h2 className="text-sm font-bold uppercase text-cream/60">
              Details
            </h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {detailRows.map((row) => (
                <div key={row.label} className="border-t border-cream/10 pt-3">
                  <dt className="text-xs font-bold uppercase text-cream/50">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-cream/82">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="grid gap-6">
          <section className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6">
            <h2 className="text-sm font-bold uppercase text-cream/60">
              Move in pipeline
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {inquiryStatusEnum.enumValues.map((status) => (
                <form key={status} action={updateInquiryStatusAction}>
                  <input type="hidden" name="inquiryId" value={inquiry.id} />
                  <input type="hidden" name="toStatus" value={status} />
                  <button
                    type="submit"
                    disabled={inquiry.status === status}
                    aria-pressed={inquiry.status === status}
                    className={`rounded-full border px-4 py-2 text-xs font-bold uppercase ${interactiveStateClasses} ${
                      inquiry.status === status
                        ? "border-cream bg-cream text-ink"
                        : "border-cream/20 text-cream/70 hover:border-cream/50 hover:text-cream"
                    }`}
                  >
                    {statusLabels[status]}
                  </button>
                </form>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6">
            <AdminNoteForm inquiryId={inquiry.id} />
            <h2 className="mt-8 text-sm font-bold uppercase text-cream/60">
              History
            </h2>
            {events.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-cream/60">
                No notes or status changes yet.
              </p>
            ) : (
              <ol className="mt-4 grid gap-4">
                {events.map((event) => (
                  <li
                    key={event.id}
                    className="border-l-2 border-cream/15 pl-4"
                  >
                    {event.toStatus ? (
                      <p className="text-sm font-bold text-cream/82">
                        {event.fromStatus
                          ? `${statusLabels[event.fromStatus]} → ${statusLabels[event.toStatus]}`
                          : `Set to ${statusLabels[event.toStatus]}`}
                      </p>
                    ) : null}
                    {event.note ? (
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-cream/70">
                        {event.note}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-cream/45">
                      {formatDateTime(event.createdAt)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
