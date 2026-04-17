import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
	exerciseProgress,
	programWeekExercises,
	programWeeks,
	programs,
} from "@/db/schema";
import type { ExerciseKey } from "@/store/level";

export const getProgress = createServerFn({ method: "GET" })
	.inputValidator((userId: string) => userId)
	.handler(async ({ data: userId }) => {
		const rows = await db
			.select()
			.from(exerciseProgress)
			.where(eq(exerciseProgress.userId, userId));
		return rows;
	});

export const upsertProgress = createServerFn({ method: "POST" })
	.inputValidator(
		(input: {
			userId: string;
			exerciseKey: ExerciseKey;
			rating: number;
			sessions: number;
		}) => input,
	)
	.handler(async ({ data }) => {
		const { userId, exerciseKey, rating, sessions } = data;
		const existing = await db
			.select({ id: exerciseProgress.id })
			.from(exerciseProgress)
			.where(
				and(
					eq(exerciseProgress.userId, userId),
					eq(exerciseProgress.exerciseKey, exerciseKey),
				),
			)
			.limit(1);

		if (existing.length > 0) {
			await db
				.update(exerciseProgress)
				.set({ rating, sessions, updatedAt: new Date() })
				.where(eq(exerciseProgress.id, existing[0].id));
		} else {
			await db.insert(exerciseProgress).values({
				id: crypto.randomUUID(),
				userId,
				exerciseKey,
				rating,
				sessions,
				updatedAt: new Date(),
			});
		}
	});

export const getAssignmentsForPatient = createServerFn({ method: "GET" })
	.inputValidator((patientId: string) => patientId)
	.handler(async ({ data: patientId }) => {
		// Find the active program for this patient (today falls within 16-week window)
		const today = new Date();

		const allPrograms = await db
			.select()
			.from(programs)
			.where(eq(programs.patientId, patientId))
			.orderBy(programs.startDate);

		let activeProgram: (typeof allPrograms)[0] | null = null;
		let currentWeekNumber = 0;

		for (const p of allPrograms) {
			const start = new Date(p.startDate);
			const end = new Date(p.startDate);
			end.setDate(end.getDate() + 16 * 7 - 1);

			if (today >= start && today <= end) {
				activeProgram = p;
				const diffMs = today.getTime() - start.getTime();
				currentWeekNumber = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
				break;
			}
		}

		if (!activeProgram || currentWeekNumber < 1 || currentWeekNumber > 16) {
			return [];
		}

		const [week] = await db
			.select()
			.from(programWeeks)
			.where(
				and(
					eq(programWeeks.programId, activeProgram.id),
					eq(programWeeks.weekNumber, currentWeekNumber),
				),
			)
			.limit(1);

		if (!week) return [];

		const exercises = await db
			.select()
			.from(programWeekExercises)
			.where(eq(programWeekExercises.programWeekId, week.id));

		return exercises.map((e) => ({
			exerciseKey: e.exerciseKey,
			difficultyOverride: e.difficultyOverride,
		}));
	});
