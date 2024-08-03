ALTER TABLE "app"."contacts" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."contacts" ADD COLUMN "contact_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."contacts" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "app"."contacts" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "app"."contacts" DROP COLUMN IF EXISTS "last_name";