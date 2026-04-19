CREATE TABLE "observation_grid_items" (
	"id" text PRIMARY KEY NOT NULL,
	"grid_id" text NOT NULL,
	"cognitive_function" text NOT NULL,
	"score" integer NOT NULL,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "observation_grids" (
	"id" text PRIMARY KEY NOT NULL,
	"therapist_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"global_comment" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "observation_grid_items" ADD CONSTRAINT "observation_grid_items_grid_id_observation_grids_id_fk" FOREIGN KEY ("grid_id") REFERENCES "public"."observation_grids"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "observation_grids" ADD CONSTRAINT "observation_grids_therapist_id_user_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "observation_grids" ADD CONSTRAINT "observation_grids_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;