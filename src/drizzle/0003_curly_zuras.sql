ALTER TABLE "app"."contact" ADD COLUMN "lead_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."contact" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."contact" ADD CONSTRAINT "contact_lead_id_lead_id_fk" FOREIGN KEY ("lead_id") REFERENCES "app"."lead"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."contact" ADD CONSTRAINT "contact_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
