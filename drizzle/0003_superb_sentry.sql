CREATE TYPE "public"."gallery_category" AS ENUM('music', 'books', 'poetry', 'short_films');--> statement-breakpoint
CREATE TYPE "public"."gallery_item_status" AS ENUM('draft', 'approved', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."gallery_media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "gallery_category" NOT NULL,
	"media_type" "gallery_media_type" NOT NULL,
	"title" text NOT NULL,
	"caption" text,
	"storage_path" text,
	"poster_path" text,
	"source_url" text,
	"status" "gallery_item_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"rejection_reason" text,
	"published_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_items_source_check" CHECK (storage_path IS NOT NULL OR source_url IS NOT NULL)
);
--> statement-breakpoint
CREATE INDEX "gallery_items_category_order_idx" ON "gallery_items" USING btree ("category","sort_order","created_at");--> statement-breakpoint
CREATE INDEX "gallery_items_status_order_idx" ON "gallery_items" USING btree ("status","sort_order","created_at");