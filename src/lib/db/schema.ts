import { index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const inquiryTypeEnum = pgEnum("inquiry_type", [
  "session",
  "service",
  "general",
]);

export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "new",
  "reviewing",
  "contacted",
  "scheduled",
  "enrolled",
  "closed",
  "spam",
]);

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: inquiryTypeEnum("type").notNull().default("session"),
    track: text("track").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    experienceLevel: text("experience_level").notNull(),
    preferredTime: text("preferred_time").notNull(),
    message: text("message").notNull(),
    status: inquiryStatusEnum("status").notNull().default("new"),
    sourcePath: text("source_path"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    sourceMetadata: text("source_metadata"),
    userAgentHash: text("user_agent_hash"),
    ipHash: text("ip_hash"),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  ({ createdAt, status, track, email, ipHash }) => ({
    createdAtIndex: index("inquiries_created_at_idx").on(createdAt),
    statusCreatedAtIndex: index("inquiries_status_created_at_idx").on(
      status,
      createdAt,
    ),
    trackIndex: index("inquiries_track_idx").on(track),
    emailIndex: index("inquiries_email_idx").on(email),
    ipHashCreatedAtIndex: index("inquiries_ip_hash_created_at_idx").on(
      ipHash,
      createdAt,
    ),
  }),
);

export type Inquiry = typeof inquiries.$inferSelect;
export type InquiryInsert = typeof inquiries.$inferInsert;
export type InquiryStatus = (typeof inquiryStatusEnum.enumValues)[number];
export type InquiryType = (typeof inquiryTypeEnum.enumValues)[number];
