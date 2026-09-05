import { index, integer, pgEnum, pgTable, text, timestamp, uuid, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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

export const galleryCategoryEnum = pgEnum("gallery_category", [
  "music",
  "books",
  "poetry",
  "short_films",
]);

export const galleryMediaTypeEnum = pgEnum("gallery_media_type", [
  "image",
  "video",
]);

export const galleryItemStatusEnum = pgEnum("gallery_item_status", [
  "draft",
  "approved",
  "rejected",
  "archived",
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

export const inquiryEvents = pgTable(
  "inquiry_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    inquiryId: uuid("inquiry_id")
      .notNull()
      .references(() => inquiries.id, { onDelete: "cascade" }),
    fromStatus: inquiryStatusEnum("from_status"),
    toStatus: inquiryStatusEnum("to_status"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  ({ inquiryId, createdAt }) => ({
    inquiryCreatedAtIndex: index("inquiry_events_inquiry_id_created_at_idx").on(
      inquiryId,
      createdAt,
    ),
  }),
);

export const galleryItems = pgTable(
  "gallery_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    category: galleryCategoryEnum("category").notNull(),
    mediaType: galleryMediaTypeEnum("media_type").notNull(),
    title: text("title").notNull(),
    caption: text("caption"),
    storagePath: text("storage_path"),
    posterPath: text("poster_path"),
    sourceUrl: text("source_url"),
    status: galleryItemStatusEnum("status").notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    rejectionReason: text("rejection_reason"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  ({ category, status, sortOrder, createdAt }) => ({
    categoryOrderIndex: index("gallery_items_category_order_idx").on(
      category,
      sortOrder,
      createdAt,
    ),
    statusOrderIndex: index("gallery_items_status_order_idx").on(
      status,
      sortOrder,
      createdAt,
    ),
    sourceCheck: check(
      "gallery_items_source_check",
      sql`storage_path IS NOT NULL OR source_url IS NOT NULL`,
    ),
  }),
);

export type Inquiry = typeof inquiries.$inferSelect;
export type InquiryInsert = typeof inquiries.$inferInsert;
export type InquiryEvent = typeof inquiryEvents.$inferSelect;
export type InquiryStatus = (typeof inquiryStatusEnum.enumValues)[number];
export type InquiryType = (typeof inquiryTypeEnum.enumValues)[number];
export type GalleryCategory = (typeof galleryCategoryEnum.enumValues)[number];
export type GalleryMediaType = (typeof galleryMediaTypeEnum.enumValues)[number];
export type GalleryItemStatus = (typeof galleryItemStatusEnum.enumValues)[number];
export type GalleryItem = typeof galleryItems.$inferSelect;
export type GalleryItemInsert = typeof galleryItems.$inferInsert;
