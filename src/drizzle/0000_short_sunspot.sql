CREATE SCHEMA "app";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "app"."oAuthTypeEnum" AS ENUM('google', 'apple');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"account_completed" boolean DEFAULT false NOT NULL,
	"oauth" boolean DEFAULT false NOT NULL,
	"google_oauth_id" varchar,
	"verify_code" varchar,
	"verify_code_generated_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
