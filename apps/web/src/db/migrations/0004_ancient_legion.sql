ALTER TABLE "programs" ADD COLUMN "name" text NOT NULL DEFAULT 'Programme sans nom';
--> statement-breakpoint
ALTER TABLE "programs" ALTER COLUMN "name" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "programs" ALTER COLUMN "patient_id" DROP NOT NULL;
