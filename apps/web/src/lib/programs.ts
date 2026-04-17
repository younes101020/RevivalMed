import { createServerFn } from "@tanstack/react-start";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
	exerciseProgress,
	programWeekCompletions,
	programWeekExercises,
	programWeeks,
	programs,
	therapistPatients,
} from "@/db/schema";
import type { ExerciseKey } from "@/store/level";

// ─── Types ───────────────────────────────────────────────────────────────────

export type WeekInput = {
	exercises: { exerciseKey: ExerciseKey; difficultyOverride: number | null }[];
	missionTitle: string;
	missionDescription: string;
	missionCognitiveFunctions: ExerciseKey[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function verifyTherapistOwnsPatient(therapistId: string, patientId: string) {
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
	if (link.length === 0) throw new Error("Access denied");
}

function getWeekDateRange(startDate: string, weekNumber: number) {
	const start = new Date(startDate);
	start.setDate(start.getDate() + (weekNumber - 1) * 7);
	const end = new Date(start);
	end.setDate(end.getDate() + 6);
	return { weekStart: start, weekEnd: end };
}

// ─── Therapist functions ─────────────────────────────────────────────────────

export const createProgram = createServerFn({ method: "POST" })
	.inputValidator(
		(input: {
			therapistId: string;
			patientId: string;
			startDate: string; // ISO date string YYYY-MM-DD
			weeks: WeekInput[];
		}) => input,
	)
	.handler(async ({ data }) => {
		const { therapistId, patientId, startDate, weeks } = data;

		await verifyTherapistOwnsPatient(therapistId, patientId);

		// Validate start date is in the future
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const start = new Date(startDate);
		if (start <= today) {
			throw new Error("La date de début doit être supérieure à la date actuelle");
		}

		if (weeks.length !== 16) {
			throw new Error("Un programme doit contenir exactement 16 semaines");
		}

		for (let i = 0; i < weeks.length; i++) {
			if (weeks[i].exercises.length === 0) {
				throw new Error(`La semaine ${i + 1} doit avoir au moins un exercice`);
			}
			if (!weeks[i].missionTitle.trim()) {
				throw new Error(`La semaine ${i + 1} doit avoir une mission`);
			}
		}

		const programId = crypto.randomUUID();
		const now = new Date();

		await db.insert(programs).values({
			id: programId,
			therapistId,
			patientId,
			startDate,
			createdAt: now,
		});

		for (let i = 0; i < weeks.length; i++) {
			const week = weeks[i];
			const weekId = crypto.randomUUID();

			await db.insert(programWeeks).values({
				id: weekId,
				programId,
				weekNumber: i + 1,
				missionTitle: week.missionTitle,
				missionDescription: week.missionDescription,
				missionCognitiveFunctions: week.missionCognitiveFunctions,
			});

			for (const ex of week.exercises) {
				await db.insert(programWeekExercises).values({
					id: crypto.randomUUID(),
					programWeekId: weekId,
					exerciseKey: ex.exerciseKey,
					difficultyOverride: ex.difficultyOverride,
				});
			}
		}

		return { id: programId };
	});

export const getProgramsForPatient = createServerFn({ method: "GET" })
	.inputValidator(
		(input: { therapistId: string; patientId: string }) => input,
	)
	.handler(async ({ data: { therapistId, patientId } }) => {
		await verifyTherapistOwnsPatient(therapistId, patientId);

		const rows = await db
			.select({
				id: programs.id,
				startDate: programs.startDate,
				createdAt: programs.createdAt,
			})
			.from(programs)
			.where(
				and(
					eq(programs.therapistId, therapistId),
					eq(programs.patientId, patientId),
				),
			)
			.orderBy(programs.createdAt);

		return rows;
	});

export const getProgram = createServerFn({ method: "GET" })
	.inputValidator(
		(input: { therapistId: string; programId: string }) => input,
	)
	.handler(async ({ data: { therapistId, programId } }) => {
		const [program] = await db
			.select()
			.from(programs)
			.where(
				and(
					eq(programs.id, programId),
					eq(programs.therapistId, therapistId),
				),
			)
			.limit(1);

		if (!program) throw new Error("Programme introuvable");

		const weeks = await db
			.select()
			.from(programWeeks)
			.where(eq(programWeeks.programId, programId))
			.orderBy(programWeeks.weekNumber);

		const weekIds = weeks.map((w) => w.id);

		const exercises =
			weekIds.length > 0
				? await db
						.select()
						.from(programWeekExercises)
						.where(
							sql`${programWeekExercises.programWeekId} = ANY(${weekIds})`,
						)
				: [];

		const completions =
			weekIds.length > 0
				? await db
						.select()
						.from(programWeekCompletions)
						.where(
							sql`${programWeekCompletions.programWeekId} = ANY(${weekIds})`,
						)
				: [];

		const exercisesByWeek = new Map<string, typeof exercises>();
		for (const ex of exercises) {
			const arr = exercisesByWeek.get(ex.programWeekId) ?? [];
			arr.push(ex);
			exercisesByWeek.set(ex.programWeekId, arr);
		}

		const completionsByWeek = new Map<string, (typeof completions)[0]>();
		for (const c of completions) {
			completionsByWeek.set(c.programWeekId, c);
		}

		return {
			...program,
			weeks: weeks.map((w) => ({
				...w,
				exercises: exercisesByWeek.get(w.id) ?? [],
				completion: completionsByWeek.get(w.id) ?? null,
			})),
		};
	});

export const updateProgramWeek = createServerFn({ method: "POST" })
	.inputValidator(
		(input: {
			therapistId: string;
			programWeekId: string;
			exercises: { exerciseKey: ExerciseKey; difficultyOverride: number | null }[];
			missionTitle: string;
			missionDescription: string;
			missionCognitiveFunctions: ExerciseKey[];
		}) => input,
	)
	.handler(async ({ data }) => {
		const {
			therapistId,
			programWeekId,
			exercises,
			missionTitle,
			missionDescription,
			missionCognitiveFunctions,
		} = data;

		// Verify ownership: week → program → therapist
		const [week] = await db
			.select({ id: programWeeks.id, programId: programWeeks.programId })
			.from(programWeeks)
			.where(eq(programWeeks.id, programWeekId))
			.limit(1);

		if (!week) throw new Error("Semaine introuvable");

		const [program] = await db
			.select({ therapistId: programs.therapistId })
			.from(programs)
			.where(
				and(
					eq(programs.id, week.programId),
					eq(programs.therapistId, therapistId),
				),
			)
			.limit(1);

		if (!program) throw new Error("Access denied");

		if (exercises.length === 0) {
			throw new Error("Au moins un exercice est requis");
		}
		if (!missionTitle.trim()) {
			throw new Error("Le titre de la mission est requis");
		}

		// Update mission fields
		await db
			.update(programWeeks)
			.set({ missionTitle, missionDescription, missionCognitiveFunctions })
			.where(eq(programWeeks.id, programWeekId));

		// Replace exercises
		await db
			.delete(programWeekExercises)
			.where(eq(programWeekExercises.programWeekId, programWeekId));

		for (const ex of exercises) {
			await db.insert(programWeekExercises).values({
				id: crypto.randomUUID(),
				programWeekId,
				exerciseKey: ex.exerciseKey,
				difficultyOverride: ex.difficultyOverride,
			});
		}
	});

export const deleteProgram = createServerFn({ method: "POST" })
	.inputValidator(
		(input: { therapistId: string; programId: string }) => input,
	)
	.handler(async ({ data: { therapistId, programId } }) => {
		const [program] = await db
			.select({ id: programs.id })
			.from(programs)
			.where(
				and(
					eq(programs.id, programId),
					eq(programs.therapistId, therapistId),
				),
			)
			.limit(1);

		if (!program) throw new Error("Programme introuvable ou accès refusé");

		await db.delete(programs).where(eq(programs.id, programId));
	});

// ─── Patient functions ───────────────────────────────────────────────────────

export const getActiveWeekForPatient = createServerFn({ method: "GET" })
	.inputValidator((patientId: string) => patientId)
	.handler(async ({ data: patientId }) => {
		// Find a program where today falls within the 16-week window
		const today = new Date();
		const todayStr = today.toISOString().slice(0, 10);

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
			return { active: false as const };
		}

		// Get the current week
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

		if (!week) {
			return { active: false as const };
		}

		// Get exercises for this week
		const weekExercises = await db
			.select()
			.from(programWeekExercises)
			.where(eq(programWeekExercises.programWeekId, week.id));

		// Check if mission is completed
		const [completion] = await db
			.select()
			.from(programWeekCompletions)
			.where(
				and(
					eq(programWeekCompletions.programWeekId, week.id),
					eq(programWeekCompletions.patientId, patientId),
				),
			)
			.limit(1);

		// Check if all exercises are ≥ 75% to unlock mission
		const exerciseKeys = weekExercises.map((e) => e.exerciseKey);

		const progressRows =
			exerciseKeys.length > 0
				? await db
						.select({
							exerciseKey: exerciseProgress.exerciseKey,
							rating: exerciseProgress.rating,
						})
						.from(exerciseProgress)
						.where(eq(exerciseProgress.userId, patientId))
				: [];

		const progressMap = Object.fromEntries(
			progressRows.map((p) => [p.exerciseKey, p.rating]),
		);

		const missionUnlocked = exerciseKeys.every(
			(key) => (progressMap[key] ?? 0) >= 75,
		);

		return {
			active: true as const,
			programId: activeProgram.id,
			weekNumber: currentWeekNumber,
			totalWeeks: 16,
			week: {
				id: week.id,
				missionTitle: week.missionTitle,
				missionDescription: week.missionDescription,
				missionCognitiveFunctions: week.missionCognitiveFunctions,
			},
			exercises: weekExercises,
			missionUnlocked,
			missionCompleted: !!completion,
		};
	});

export const completeWeekMission = createServerFn({ method: "POST" })
	.inputValidator(
		(input: { programWeekId: string; patientId: string }) => input,
	)
	.handler(async ({ data: { programWeekId, patientId } }) => {
		// Verify the week belongs to a program for this patient
		const [week] = await db
			.select({ id: programWeeks.id, programId: programWeeks.programId })
			.from(programWeeks)
			.where(eq(programWeeks.id, programWeekId))
			.limit(1);

		if (!week) throw new Error("Semaine introuvable");

		const [program] = await db
			.select({ patientId: programs.patientId })
			.from(programs)
			.where(eq(programs.id, week.programId))
			.limit(1);

		if (!program || program.patientId !== patientId) {
			throw new Error("Accès refusé");
		}

		// Idempotent
		const existing = await db
			.select({ id: programWeekCompletions.id })
			.from(programWeekCompletions)
			.where(
				and(
					eq(programWeekCompletions.programWeekId, programWeekId),
					eq(programWeekCompletions.patientId, patientId),
				),
			)
			.limit(1);

		if (existing.length > 0) return;

		await db.insert(programWeekCompletions).values({
			id: crypto.randomUUID(),
			programWeekId,
			patientId,
			completedAt: new Date(),
		});
	});
