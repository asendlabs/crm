DO $$ BEGIN
 CREATE TYPE "app"."leadStatus" AS ENUM('Potential', 'Bad Fit', 'Qualified', 'Customer', 'Interested', 'Not Interested');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "app"."lead" ADD COLUMN "status" "app"."leadStatus" DEFAULT 'Potential' NOT NULL;