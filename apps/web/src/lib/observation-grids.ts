import { createServerFn } from "@tanstack/react-start";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/db";
import {
	observationGridItems,
	observationGrids,
	therapistPatients,
} from "@/db/schema";
import type { ExerciseKey } from "@/store/level";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ObservationGridItemInput = {
	cognitiveFunction: ExerciseKey;
	score: number;
	comment?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VALID_FUNCTIONS: ExerciseKey[] = [
	"memory",
	"attention",
	"planning",
	"language",
	"visuoSpatial",
	"processingSpeed",
	"informationProcessing",
	"mentalFlexibility",
	"workingMemory",
];

async function verifyTherapistOwnsPatient(
	therapistId: string,
	patientId: string,
) {
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

// ─── Server functions ────────────────────────────────────────────────────────

export const createObservationGrid = createServerFn({ method: "POST" })
	.inputValidator(
		(input: {
			therapistId: string;
			patientId: string;
			globalComment?: string;
			items: ObservationGridItemInput[];
		}) => input,
	)
	.handler(async ({ data }) => {
		const { therapistId, patientId, globalComment, items } = data;

		await verifyTherapistOwnsPatient(therapistId, patientId);

		// Validate: exactly 9 cognitive functions, each with score 1-5
		if (items.length !== 9) {
			throw new Error("La grille doit contenir exactement 9 fonctions cognitives");
		}

		const providedFunctions = new Set(items.map((i) => i.cognitiveFunction));
		for (const fn of VALID_FUNCTIONS) {
			if (!providedFunctions.has(fn)) {
				throw new Error(`Fonction cognitive manquante : ${fn}`);
			}
		}

		for (const item of items) {
			if (item.score < 1 || item.score > 5 || !Number.isInteger(item.score)) {
				throw new Error("Les scores doivent être des entiers entre 1 et 5");
			}
		}

		const gridId = crypto.randomUUID();
		const now = new Date();

		await db.insert(observationGrids).values({
			id: gridId,
			therapistId,
			patientId,
			globalComment: globalComment?.trim() || null,
			createdAt: now,
		});

		await db.insert(observationGridItems).values(
			items.map((item) => ({
				id: crypto.randomUUID(),
				gridId,
				cognitiveFunction: item.cognitiveFunction,
				score: item.score,
				comment: item.comment?.trim() || null,
			})),
		);

		return { id: gridId };
	});

export const getObservationGrids = createServerFn({ method: "GET" })
	.inputValidator(
		(input: { therapistId: string; patientId: string }) => input,
	)
	.handler(async ({ data: { therapistId, patientId } }) => {
		await verifyTherapistOwnsPatient(therapistId, patientId);

		const grids = await db
			.select({
				id: observationGrids.id,
				globalComment: observationGrids.globalComment,
				createdAt: observationGrids.createdAt,
			})
			.from(observationGrids)
			.where(
				and(
					eq(observationGrids.therapistId, therapistId),
					eq(observationGrids.patientId, patientId),
				),
			)
			.orderBy(desc(observationGrids.createdAt));

		return grids;
	});

export const getObservationGrid = createServerFn({ method: "GET" })
	.inputValidator(
		(input: { therapistId: string; gridId: string }) => input,
	)
	.handler(async ({ data: { therapistId, gridId } }) => {
		const [grid] = await db
			.select()
			.from(observationGrids)
			.where(
				and(
					eq(observationGrids.id, gridId),
					eq(observationGrids.therapistId, therapistId),
				),
			)
			.limit(1);

		if (!grid) throw new Error("Grille introuvable ou accès refusé");

		const items = await db
			.select()
			.from(observationGridItems)
			.where(eq(observationGridItems.gridId, gridId));

		return { ...grid, items };
	});

export const deleteObservationGrid = createServerFn({ method: "POST" })
	.inputValidator(
		(input: { therapistId: string; gridId: string }) => input,
	)
	.handler(async ({ data: { therapistId, gridId } }) => {
		// Verify therapist owns this grid
		const [grid] = await db
			.select({ id: observationGrids.id })
			.from(observationGrids)
			.where(
				and(
					eq(observationGrids.id, gridId),
					eq(observationGrids.therapistId, therapistId),
				),
			)
			.limit(1);

		if (!grid) throw new Error("Grille introuvable ou accès refusé");

		await db
			.delete(observationGrids)
			.where(eq(observationGrids.id, gridId));

		return { success: true };
	});
