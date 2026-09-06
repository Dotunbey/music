ALTER TABLE "gallery_items" ADD COLUMN "price" text;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD COLUMN "purchase_url" text;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD COLUMN "excerpt" text;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD COLUMN "sample_paths" text[] DEFAULT ARRAY[]::text[] NOT NULL;