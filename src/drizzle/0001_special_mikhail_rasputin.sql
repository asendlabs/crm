DO $$ BEGIN
 CREATE TYPE "app"."status" AS ENUM('New', 'Contacted', 'Follow Up', 'In Progress', 'Unqualified', 'Future Contact', 'Closed (Won)', 'Closed (Lost)');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"job_title" text,
	"email" text NOT NULL,
	"phone" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."leads" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"email" text,
	"phone" text,
	"urls" text,
	"adrress" text,
	"website" text,
	"status" "app"."status" DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app"."users" ALTER COLUMN "google_oauth_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app"."users" ALTER COLUMN "verify_code" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."contacts" ADD CONSTRAINT "contacts_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "app"."leads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."leads" ADD CONSTRAINT "leads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
