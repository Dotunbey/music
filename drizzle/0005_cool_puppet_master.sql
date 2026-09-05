CREATE TYPE "public"."portfolio_content_type" AS ENUM('album', 'track', 'video', 'song');--> statement-breakpoint
CREATE TYPE "public"."portfolio_provider" AS ENUM('spotify', 'youtube', 'audiomack');--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"provider" "portfolio_provider" NOT NULL,
	"content_type" "portfolio_content_type" NOT NULL,
	"source_url" text NOT NULL,
	"artwork_url" text,
	"credits" text[] NOT NULL,
	"status" "gallery_item_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"rejection_reason" text,
	"published_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"metadata_fetched_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_items_source_url_unique" UNIQUE("source_url")
);
--> statement-breakpoint
CREATE INDEX "portfolio_items_provider_order_idx" ON "portfolio_items" USING btree ("provider","sort_order","created_at");--> statement-breakpoint
CREATE INDEX "portfolio_items_status_order_idx" ON "portfolio_items" USING btree ("status","sort_order","created_at");--> statement-breakpoint
INSERT INTO "portfolio_items" ("title", "provider", "content_type", "source_url", "artwork_url", "credits", "status", "sort_order", "published_at", "reviewed_at", "metadata_fetched_at") VALUES
('AWARE', 'spotify', 'album', 'https://open.spotify.com/album/1ayYGdpzp8jnSi95iU5LGR', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f57dd7cb398381ffb12c4370', ARRAY['Vocal Arrangement', 'Vocal Production'], 'approved', 0, now(), now(), now()),
('Mike Umoh - Song of Certainty', 'youtube', 'video', 'https://youtu.be/XWFoB0Y5Umg', 'https://i.ytimg.com/vi/XWFoB0Y5Umg/hqdefault.jpg', ARRAY['Vocal Arrangement', 'Vocal Production'], 'approved', 0, now(), now(), now()),
('The Blood', 'audiomack', 'song', 'https://audiomack.com/soundsofbethlehem/song/the-blood-bright-sob', 'https://i.audiomack.com/soundsofbethlehem/4ad385c6f3.webp?width=1200', ARRAY['Music Production', 'Vocal Arrangement', 'Vocal Production'], 'approved', 0, now(), now(), now()),
('The Old Rugged Cross', 'audiomack', 'song', 'https://audiomack.com/soundsofbethlehem/song/old-rugged-cross', 'https://i.audiomack.com/soundsofbethlehem/4ad385c6f3.webp?width=1200', ARRAY['Music Production', 'Vocal Arrangement', 'Vocal Production'], 'approved', 1, now(), now(), now()),
('We Are Nigeria', 'spotify', 'track', 'https://open.spotify.com/track/06eEXEHkZRrYWvCJ2SKzeU', 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02335b5924eba4bed453e016c4', ARRAY['Vocal Arrangement', 'Vocal Production'], 'approved', 1, now(), now(), now());
