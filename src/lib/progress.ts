import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { exerciseAssignments, exerciseProgress } from "@/db/schema";
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
		const rows = await db
			.select()
			.from(exerciseAssignments)
			.where(eq(exerciseAssignments.patientId, patientId));
		return rows;
	});
