ALTER TYPE "public"."portfolio_content_type" ADD VALUE 'audio';--> statement-breakpoint
ALTER TYPE "public"."portfolio_provider" ADD VALUE 'external';--> statement-breakpoint
ALTER TYPE "public"."portfolio_provider" ADD VALUE 'upload';--> statement-breakpoint
ALTER TABLE "portfolio_items" ALTER COLUMN "source_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "portfolio_items" ADD COLUMN "storage_path" text;--> statement-breakpoint
ALTER TABLE "portfolio_items" ADD COLUMN "artwork_path" text;--> statement-breakpoint
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_source_check" CHECK (source_url IS NOT NULL OR storage_path IS NOT NULL);