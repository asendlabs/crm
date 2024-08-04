ALTER TABLE "app"."contact" DROP CONSTRAINT "contact_lead_id_lead_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."contact" DROP CONSTRAINT "contact_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."contact" DROP COLUMN IF EXISTS "lead_id";--> statement-breakpoint
ALTER TABLE "app"."contact" DROP COLUMN IF EXISTS "user_id";