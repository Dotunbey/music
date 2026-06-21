import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type").notNull().default("session"),
    track: text("track").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    experienceLevel: text("experience_level").notNull(),
    preferredTime: text("preferred_time").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
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
      .defaultNow(),
  },
  ({ createdAt, status, track, email }) => ({
    createdAtIndex: index("inquiries_created_at_idx").on(createdAt),
    statusIndex: index("inquiries_status_idx").on(status),
    trackIndex: index("inquiries_track_idx").on(track),
    emailIndex: index("inquiries_email_idx").on(email),
  }),
);

export type Inquiry = typeof inquiries.$inferSelect;
export type InquiryInsert = typeof inquiries.$inferInsert;
