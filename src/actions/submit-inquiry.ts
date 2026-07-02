"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { and, count, eq, gt } from "drizzle-orm";
import { Resend } from "resend";
import { z, ZodError } from "zod";

import { contact } from "@/lib/content";
import { getDbClient } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";
import { escapeHtml } from "@/lib/html-escape";
import { isValidTrack, normalizeTrackLabel, resolveInquiryType } from "@/lib/inquiry-utils";
import { logger } from "@/lib/logger";
import { checkRateLimit, cleanupStore } from "@/lib/rate-limiter";

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const DELIVERY_OPTIONS = ["email", "whatsapp"] as const;
const INQUIRY_STATUSES = [
  "new",
  "reviewing",
  "contacted",
  "scheduled",
  "enrolled",
  "closed",
  "spam",
] as const;

// The in-memory limiter resets on every serverless cold start, so the
// inquiries table itself is the durable limit: max rows per hashed IP per window.
const DB_RATE_LIMIT_MAX = 5;
const DB_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Enter your full name.").max(120),
  email: z.string().email("Enter a valid email address."),
  track: z.string().trim().min(1, "Select a course or service."),
  experience: z.enum(EXPERIENCE_LEVELS, {
    errorMap: () => ({ message: "Select a valid experience level." }),
  }),
  preferredTime: z
    .string()
    .trim()
    .min(1, "Tell us your preferred day and time.")
    .max(160),
  message: z
    .string()
    .trim()
    .min(5, "Share your goals in a short paragraph.")
    .max(2500),
  delivery: z.enum(DELIVERY_OPTIONS).default("email"),
  website: z.string().max(0, "Submission blocked."),
  sourcePath: z.string().trim().max(256).optional(),
  sourceMetadata: z.string().trim().max(2000).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  consentTimestamp: z
    .string()
    .trim()
    .datetime({ offset: true })
    .optional(),
  phone: z.string().trim().max(32).optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export type InquirySubmitState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: Record<string, string>;
  inquiryId?: string;
  emailSent?: boolean;
  whatsappLink?: string;
  emailLink?: string;
  whatsappPreferred?: boolean;
};

export const initialInquiryState: InquirySubmitState = {
  status: "idle",
  message: "",
  errors: {},
};

function safeDate(value?: string) {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid consent timestamp.");
  }
  return parsed;
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function extractClientIp(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return headersList.get("x-real-ip") ?? "unknown";
}

function buildIpHash(headersList: Headers) {
  const ip = extractClientIp(headersList);
  return ip !== "unknown" ? hashValue(ip) : null;
}

function buildUserAgentHash(headersList: Headers) {
  const userAgent = headersList.get("user-agent");
  return userAgent ? hashValue(userAgent) : null;
}

function readErrorMessages(error: ZodError) {
  return Object.entries(error.flatten().fieldErrors).reduce(
    (acc, [field, messages]) => {
      if (messages?.[0]) {
        acc[field] = messages[0];
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}

function buildContactEmailHtml(params: {
  inquiryId: string;
  name: string;
  email: string;
  trackLabel: string;
  track: string;
  type: "session" | "service" | "general";
  experience: string;
  preferredTime: string;
  message: string;
  phone?: string;
  sourcePath: string;
}) {
  const adminUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/admin/inquiries/${params.inquiryId}`
    : "Admin URL not configured yet.";

  const safeMessage = escapeHtml(params.message).replace(/\n/g, "<br/>");
  return [
    "<h2>New inquiry received</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(params.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(params.email)}</p>`,
    `<p><strong>Track:</strong> ${escapeHtml(params.trackLabel)} (${escapeHtml(params.track)})</p>`,
    `<p><strong>Inquiry Type:</strong> ${escapeHtml(params.type)}</p>`,
    `<p><strong>Experience level:</strong> ${escapeHtml(params.experience)}</p>`,
    `<p><strong>Preferred day/time:</strong> ${escapeHtml(params.preferredTime)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(params.phone ?? "Not provided")}</p>`,
    `<p><strong>Source:</strong> ${escapeHtml(params.sourcePath)}</p>`,
    `<p><strong>Admin record:</strong> ${escapeHtml(adminUrl)}</p>`,
    "<p><strong>Message:</strong></p>",
    `<p>${safeMessage}</p>`,
  ].join("");
}

function buildWhatsAppBody(params: {
  name: string;
  trackLabel: string;
  experience: string;
  preferredTime: string;
  message: string;
  email: string;
}) {
  return [
    "Hello Tami Bedford team,",
    "",
    `I submitted an inquiry for ${params.trackLabel}.`,
    `Name: ${params.name}`,
    `Email: ${params.email}`,
    `Experience level: ${params.experience}`,
    `Preferred day/time: ${params.preferredTime}`,
    "",
    "Message:",
    params.message,
  ].join("\n");
}

async function sendTeamNotification(
  payload: {
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
  },
) {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }

  if (payload.from !== fromEmail) {
    throw new Error("Unexpected sender configured in payload.");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(payload);
  if (error) {
    throw new Error(error.message || "Email send failed.");
  }
}

function buildEmailPayload(values: InquiryFormValues, trackLabel: string, inquiryId: string) {
  const body = buildContactEmailHtml({
    inquiryId,
    name: values.name,
    email: values.email,
    trackLabel,
    track: values.track,
    type: resolveInquiryType(values.track),
    experience: values.experience,
    preferredTime: values.preferredTime,
    message: values.message,
    phone: values.phone,
    sourcePath: values.sourcePath ?? "/apply",
  });

  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.ADMIN_NOTIFICATION_EMAIL ?? contact.email;

  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }

  return {
    from: fromEmail,
    to: toEmail,
    subject: `New ${trackLabel} inquiry`,
    html: body,
    text: `${values.name} (${values.email}): ${values.track} - ${values.message}`,
  };
}

export async function submitInquiryAction(
  _prevState: InquirySubmitState,
  formData: FormData,
): Promise<InquirySubmitState> {
  let values: InquiryFormValues;

  try {
    const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
    values = inquirySchema.parse(raw);
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        status: "error",
        message: "Please check the form and fix the errors.",
        errors: readErrorMessages(error),
      };
    }

    return {
      status: "error",
      message: "Invalid submission payload.",
      errors: {},
    };
  }

  if (values.website) {
    logger.info({
      message: "Honeypot triggered, submission blocked",
      context: "submit-inquiry",
      track: values.track,
    });
    return {
      status: "error",
      message: "This submission was blocked as suspected spam.",
      errors: {},
    };
  }

  if (!isValidTrack(values.track)) {
    logger.warn({
      message: "Invalid track value submitted",
      context: "submit-inquiry",
      track: values.track,
    });
    return {
      status: "error",
      message: "Please select a valid course or service from the list.",
      errors: { track: "Invalid selection." },
    };
  }

  const headersList = await headers();
  const clientIp = extractClientIp(headersList);

  cleanupStore();
  const rateLimitResult = checkRateLimit(`inquiry:${clientIp}`, 5, 60_000);
  if (!rateLimitResult.allowed) {
    logger.warn({
      message: "Rate limit exceeded",
      context: "submit-inquiry",
      clientIp: hashValue(clientIp),
    });
    return {
      status: "error",
      message: "Too many submissions. Please wait before trying again.",
      errors: {},
    };
  }

  const type = resolveInquiryType(values.track);
  const trackLabel = normalizeTrackLabel(values.track);
  const consentAt = safeDate(values.consentTimestamp);
  const sourcePath = values.sourcePath ?? "/apply";
  const userAgentHash = buildUserAgentHash(headersList);
  const ipHash = buildIpHash(headersList);
  const startTime = Date.now();

  let inquiryId = "";
  try {
    const db = await getDbClient();

    if (ipHash) {
      const windowStart = new Date(Date.now() - DB_RATE_LIMIT_WINDOW_MS);
      const [recent] = await db
        .select({ value: count() })
        .from(inquiries)
        .where(
          and(eq(inquiries.ipHash, ipHash), gt(inquiries.createdAt, windowStart)),
        );

      if ((recent?.value ?? 0) >= DB_RATE_LIMIT_MAX) {
        logger.warn({
          message: "Durable rate limit exceeded",
          context: "submit-inquiry",
          clientIp: ipHash,
        });
        return {
          status: "error",
          message: "Too many submissions from this connection. Please try again later.",
          errors: {},
        };
      }
    }

    const inserted = await db
      .insert(inquiries)
      .values({
        type,
        track: values.track,
        name: values.name,
        email: values.email,
        phone: values.phone,
        experienceLevel: values.experience,
        preferredTime: values.preferredTime,
        message: values.message,
        status: INQUIRY_STATUSES[0],
        sourcePath,
        utmSource: values.utmSource,
        utmMedium: values.utmMedium,
        utmCampaign: values.utmCampaign,
        sourceMetadata: values.sourceMetadata,
        userAgentHash,
        ipHash,
        consentAt,
      })
      .returning({ inquiryId: inquiries.id });

    inquiryId = inserted[0]?.inquiryId ?? "";
    if (!inquiryId) {
      throw new Error("Could not persist inquiry.");
    }

    logger.info({
      message: "Inquiry saved",
      context: "submit-inquiry",
      inquiryId,
      type,
      track: values.track,
      elapsedMs: Date.now() - startTime,
    });
  } catch (error) {
    logger.error({
      message: "Failed to save inquiry",
      context: "submit-inquiry",
      error,
      elapsedMs: Date.now() - startTime,
    });
    return {
      status: "error",
      message:
        "We could not save this inquiry right now. Please try again or send an email using the contact link.",
      errors: { form: error instanceof Error ? error.message : "Database insert failed." },
    };
  }

  let emailSent = true;
  let emailMessage =
    "Inquiry submitted and logged. The team has been notified by email.";
  try {
    const emailPayload = buildEmailPayload(values, trackLabel, inquiryId);
    await sendTeamNotification({
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      html: emailPayload.html,
      text: emailPayload.text,
    });
    logger.info({
      message: "Team notified by email",
      context: "submit-inquiry",
      inquiryId,
    });
  } catch (error) {
    emailSent = false;
    emailMessage =
      error instanceof Error
        ? `Inquiry submitted and logged. Email notification failed: ${error.message}`
        : "Inquiry submitted and logged. Email notification is temporarily unavailable.";
    logger.error({
      message: "Failed to send team notification",
      context: "submit-inquiry",
      inquiryId,
      error,
    });
  }

  const followUpText = buildWhatsAppBody({
    name: values.name,
    trackLabel,
    experience: values.experience,
    preferredTime: values.preferredTime,
    message: values.message,
    email: values.email,
  });
  const encoded = encodeURIComponent(followUpText);
  const whatsappLink = `https://wa.me/${contact.whatsapp}?text=${encoded}`;
  const emailSubject = `Application inquiry: ${trackLabel}`;
  const emailLink = `mailto:${contact.email}?subject=${encodeURIComponent(
    emailSubject,
  )}&body=${encodeURIComponent(followUpText)}`;

  return {
    status: "success",
    message: emailMessage,
    errors: {},
    inquiryId,
    emailSent,
    whatsappLink,
    emailLink,
    whatsappPreferred: values.delivery === "whatsapp",
  };
}
