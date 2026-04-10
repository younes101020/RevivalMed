import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
	exerciseAssignments,
	exerciseProgress,
	missionCompletions,
	missions,
	therapistPatients,
} from "@/db/schema";
import type { ExerciseKey } from "@/store/level";

// ─── Therapist functions ─────────────────────────────────────────────────────

export const getMissionsForTherapistPatient = createServerFn({ method: "GET" })
	.inputValidator((input: { therapistId: string; patientId: string }) => input)
	.handler(async ({ data: { therapistId, patientId } }) => {
		const link = await db
			.select({ id: therapistPatients.id })
			.from(therapistPatients)
			.where(
				and(
					eq(therapistPatients.therapistId, therapistId),
					eq(therapistPatients.patientId, patientId),
				),
			)
			.limit(1);

		if (link.length === 0) {
			throw new Error("Access denied");
		}

		const rows = await db
			.select({
				id: missions.id,
				title: missions.title,
				description: missions.description,
				cognitiveFunctions: missions.cognitiveFunctions,
				createdAt: missions.createdAt,
				completedAt: missionCompletions.completedAt,
			})
			.from(missions)
			.leftJoin(
				missionCompletions,
				and(
					eq(missionCompletions.missionId, missions.id),
					eq(missionCompletions.patientId, patientId),
				),
			)
			.where(
				and(
					eq(missions.therapistId, therapistId),
					eq(missions.patientId, patientId),
				),
			)
			.orderBy(missions.createdAt);

		return rows;
	});

export const createMission = createServerFn({ method: "POST" })
	.inputValidator(
		(input: {
			therapistId: string;
			patientId: string;
			title: string;
			description: string;
			cognitiveFunctions: ExerciseKey[];
		}) => input,
	)
	.handler(async ({ data }) => {
		const { therapistId, patientId, title, description, cognitiveFunctions } = data;

		const link = await db
			.select({ id: therapistPatients.id })
			.from(therapistPatients)
			.where(
				and(
					eq(therapistPatients.therapistId, therapistId),
					eq(therapistPatients.patientId, patientId),
				),
			)
			.limit(1);

		if (link.length === 0) {
			throw new Error("Access denied");
		}

		const id = crypto.randomUUID();
		await db.insert(missions).values({
			id,
			therapistId,
			patientId,
			title,
			description,
			cognitiveFunctions,
			createdAt: new Date(),
		});
		return { id };
	});

export const updateMission = createServerFn({ method: "POST" })
	.inputValidator(
		(input: {
			missionId: string;
			therapistId: string;
			title: string;
			description: string;
			cognitiveFunctions: ExerciseKey[];
		}) => input,
	)
	.handler(async ({ data }) => {
		const { missionId, therapistId, title, description, cognitiveFunctions } = data;

		const existing = await db
			.select({ id: missions.id })
			.from(missions)
			.where(
				and(
					eq(missions.id, missionId),
					eq(missions.therapistId, therapistId),
				),
			)
			.limit(1);

		if (existing.length === 0) {
			throw new Error("Mission not found or access denied");
		}

		await db
			.update(missions)
			.set({ title, description, cognitiveFunctions })
			.where(eq(missions.id, missionId));
	});

export const deleteMission = createServerFn({ method: "POST" })
	.inputValidator(
		(input: { missionId: string; therapistId: string }) => input,
	)
	.handler(async ({ data: { missionId, therapistId } }) => {
		const existing = await db
			.select({ id: missions.id })
			.from(missions)
			.where(
				and(
					eq(missions.id, missionId),
					eq(missions.therapistId, therapistId),
				),
			)
			.limit(1);

		if (existing.length === 0) {
			throw new Error("Mission not found or access denied");
		}

		await db.delete(missions).where(eq(missions.id, missionId));
	});

// ─── Patient functions ───────────────────────────────────────────────────────

export const getMissionsForPatient = createServerFn({ method: "GET" })
	.inputValidator((patientId: string) => patientId)
	.handler(async ({ data: patientId }) => {
		// Fetch all assigned exercises and their progress for this patient
		const assignments = await db
			.select({ exerciseKey: exerciseAssignments.exerciseKey })
			.from(exerciseAssignments)
			.where(eq(exerciseAssignments.patientId, patientId));

		if (assignments.length === 0) {
			return { unlocked: false as const, missions: [] };
		}

		const progressRows = await db
			.select({ exerciseKey: exerciseProgress.exerciseKey, rating: exerciseProgress.rating })
			.from(exerciseProgress)
			.where(eq(exerciseProgress.userId, patientId));

		const progressMap = Object.fromEntries(progressRows.map((p) => [p.exerciseKey, p.rating]));

		// All assigned exercises must have rating >= 75 (level 4/4)
		const allAtMax = assignments.every(
			(a) => (progressMap[a.exerciseKey] ?? 0) >= 75,
		);

		if (!allAtMax) {
			return { unlocked: false as const, missions: [] };
		}

		const rows = await db
			.select({
				id: missions.id,
				title: missions.title,
				description: missions.description,
				cognitiveFunctions: missions.cognitiveFunctions,
				createdAt: missions.createdAt,
				completedAt: missionCompletions.completedAt,
			})
			.from(missions)
			.leftJoin(
				missionCompletions,
				and(
					eq(missionCompletions.missionId, missions.id),
					eq(missionCompletions.patientId, patientId),
				),
			)
			.where(eq(missions.patientId, patientId))
			.orderBy(missions.createdAt);

		return { unlocked: true as const, missions: rows };
	});

export const completeMission = createServerFn({ method: "POST" })
	.inputValidator((input: { missionId: string; patientId: string }) => input)
	.handler(async ({ data: { missionId, patientId } }) => {
		const mission = await db
			.select({ id: missions.id, patientId: missions.patientId })
			.from(missions)
			.where(eq(missions.id, missionId))
			.limit(1);

		if (mission.length === 0 || mission[0].patientId !== patientId) {
			throw new Error("Mission not found or access denied");
		}

		const existing = await db
			.select({ id: missionCompletions.id })
			.from(missionCompletions)
			.where(
				and(
					eq(missionCompletions.missionId, missionId),
					eq(missionCompletions.patientId, patientId),
				),
			)
			.limit(1);

		if (existing.length > 0) {
			return; // Already completed — idempotent
		}

		await db.insert(missionCompletions).values({
			id: crypto.randomUUID(),
			missionId,
			patientId,
			completedAt: new Date(),
		});
	});
