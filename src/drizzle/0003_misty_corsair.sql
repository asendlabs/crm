ALTER TABLE "users" ADD COLUMN "name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "last_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "otp";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "otp_expiry";