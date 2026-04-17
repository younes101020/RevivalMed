CREATE TABLE "program_week_completions" (
	"id" text PRIMARY KEY NOT NULL,
	"program_week_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"completed_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_week_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"program_week_id" text NOT NULL,
	"exercise_key" text NOT NULL,
	"difficulty_override" integer
);
--> statement-breakpoint
CREATE TABLE "program_weeks" (
	"id" text PRIMARY KEY NOT NULL,
	"program_id" text NOT NULL,
	"week_number" integer NOT NULL,
	"mission_title" text NOT NULL,
	"mission_description" text DEFAULT '' NOT NULL,
	"mission_cognitive_functions" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" text PRIMARY KEY NOT NULL,
	"therapist_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"start_date" date NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "exercise_assignments" CASCADE;--> statement-breakpoint
DROP TABLE "mission_completions" CASCADE;--> statement-breakpoint
DROP TABLE "missions" CASCADE;--> statement-breakpoint
ALTER TABLE "program_week_completions" ADD CONSTRAINT "program_week_completions_program_week_id_program_weeks_id_fk" FOREIGN KEY ("program_week_id") REFERENCES "public"."program_weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_week_completions" ADD CONSTRAINT "program_week_completions_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_week_exercises" ADD CONSTRAINT "program_week_exercises_program_week_id_program_weeks_id_fk" FOREIGN KEY ("program_week_id") REFERENCES "public"."program_weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_weeks" ADD CONSTRAINT "program_weeks_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_therapist_id_user_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;