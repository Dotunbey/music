CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'reviewing', 'contacted', 'scheduled', 'enrolled', 'closed', 'spam');--> statement-breakpoint
CREATE TYPE "public"."inquiry_type" AS ENUM('session', 'service', 'general');--> statement-breakpoint
DROP INDEX "inquiries_status_idx";--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "type" SET DATA TYPE "public"."inquiry_type" USING "type"::"public"."inquiry_type";--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "type" SET DEFAULT 'session'::"public"."inquiry_type";--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "status" SET DATA TYPE "public"."inquiry_status" USING "status"::"public"."inquiry_status";--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "status" SET DEFAULT 'new'::"public"."inquiry_status";--> statement-breakpoint
CREATE INDEX "inquiries_status_created_at_idx" ON "inquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "inquiries_ip_hash_created_at_idx" ON "inquiries" USING btree ("ip_hash","created_at");
