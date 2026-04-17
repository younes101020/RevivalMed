import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	date,
} from "drizzle-orm/pg-core";

// ─── Better Auth core tables ────────────────────────────────────────────────

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	role: text("role", { enum: ["therapist", "patient"] })
		.notNull()
		.default("patient"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

// ─── App-specific tables ─────────────────────────────────────────────────────

export const therapistPatients = pgTable("therapist_patients", {
	id: text("id").primaryKey(),
	therapistId: text("therapist_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	patientId: text("patient_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull(),
});

export const exerciseProgress = pgTable("exercise_progress", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	exerciseKey: text("exercise_key").notNull(),
	rating: integer("rating").notNull().default(30),
	sessions: integer("sessions").notNull().default(0),
	updatedAt: timestamp("updated_at").notNull(),
});

// ─── Programme tables ─────────────────────────────────────────────────────────

export const programs = pgTable("programs", {
	id: text("id").primaryKey(),
	therapistId: text("therapist_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	patientId: text("patient_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	startDate: date("start_date").notNull(),
	createdAt: timestamp("created_at").notNull(),
});

export const programWeeks = pgTable("program_weeks", {
	id: text("id").primaryKey(),
	programId: text("program_id")
		.notNull()
		.references(() => programs.id, { onDelete: "cascade" }),
	weekNumber: integer("week_number").notNull(),
	missionTitle: text("mission_title").notNull(),
	missionDescription: text("mission_description").notNull().default(""),
	missionCognitiveFunctions: text("mission_cognitive_functions")
		.array()
		.notNull()
		.default([]),
});

export const programWeekExercises = pgTable("program_week_exercises", {
	id: text("id").primaryKey(),
	programWeekId: text("program_week_id")
		.notNull()
		.references(() => programWeeks.id, { onDelete: "cascade" }),
	exerciseKey: text("exercise_key").notNull(),
	difficultyOverride: integer("difficulty_override"),
});

export const programWeekCompletions = pgTable("program_week_completions", {
	id: text("id").primaryKey(),
	programWeekId: text("program_week_id")
		.notNull()
		.references(() => programWeeks.id, { onDelete: "cascade" }),
	patientId: text("patient_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	completedAt: timestamp("completed_at").notNull(),
});

export type UserRole = "therapist" | "patient";
export type ExerciseProgressRow = typeof exerciseProgress.$inferSelect;
export type ProgramRow = typeof programs.$inferSelect;
export type ProgramWeekRow = typeof programWeeks.$inferSelect;
export type ProgramWeekExerciseRow = typeof programWeekExercises.$inferSelect;
export type ProgramWeekCompletionRow = typeof programWeekCompletions.$inferSelect;
