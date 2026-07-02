import type { InquiryStatus } from "@/lib/db/schema";

export const statusLabels: Record<InquiryStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  contacted: "Contacted",
  scheduled: "Scheduled",
  enrolled: "Enrolled",
  closed: "Closed",
  spam: "Spam",
};

export const statusPillClasses: Record<InquiryStatus, string> = {
  new: "border-red-500/50 bg-red-600/15 text-red-400",
  reviewing: "border-brass/50 bg-brass/15 text-brass",
  contacted: "border-cream/30 bg-cream/10 text-cream",
  scheduled: "border-brass/60 bg-brass/25 text-brass",
  enrolled: "border-sage/60 bg-sage/20 text-sage",
  closed: "border-cream/20 bg-cream/[0.06] text-cream/60",
  spam: "border-cream/15 bg-cream/[0.04] text-cream/40",
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date);
}
