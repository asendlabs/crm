ALTER TABLE "app"."user" ALTER COLUMN "workspace_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."user" ADD COLUMN "account_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."user" ADD COLUMN "oauth" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."user" ADD COLUMN "google_oauth_id" text;--> statement-breakpoint
ALTER TABLE "app"."user" ADD COLUMN "verify_code" text;--> statement-breakpoint
ALTER TABLE "app"."user" ADD COLUMN "verify_code_generated_at" timestamp;--> statement-breakpoint
ALTER TABLE "app"."user" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;