import { createServerFn } from "@tanstack/react-start";
import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
	account,
	exerciseProgress,
	programs,
	therapistPatients,
	user,
} from "@/db/schema";

export const getPatients = createServerFn({ method: "GET" })
	.inputValidator((therapistId: string) => therapistId)
	.handler(async ({ data: therapistId }) => {
		const rows = await db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
			})
			.from(user)
			.innerJoin(therapistPatients, eq(therapistPatients.patientId, user.id))
			.where(eq(therapistPatients.therapistId, therapistId));
		return rows;
	});

export const createPatient = createServerFn({ method: "POST" })
	.inputValidator(
		(input: {
			therapistId: string;
			name: string;
			email: string;
			password: string;
		}) => input,
	)
	.handler(async ({ data }) => {
		const { therapistId, name, email, password } = data;

		const passwordHash = await hashPassword(password);
		const userId = crypto.randomUUID();
		const now = new Date();

		await db.insert(user).values({
			id: userId,
			name,
			email,
			emailVerified: true,
			role: "patient",
			createdAt: now,
			updatedAt: now,
		});

		await db.insert(account).values({
			id: crypto.randomUUID(),
			accountId: userId,
			providerId: "credential",
			userId,
			password: passwordHash,
			createdAt: now,
			updatedAt: now,
		});

		await db.insert(therapistPatients).values({
			id: crypto.randomUUID(),
			therapistId,
			patientId: userId,
			createdAt: now,
		});

		return { id: userId, name, email };
	});

export const getPatientDetail = createServerFn({ method: "GET" })
	.inputValidator((input: { therapistId: string; patientId: string }) => input)
	.handler(async ({ data: { therapistId, patientId } }) => {
		// Verify ownership
		const link = await db
			.select()
			.from(therapistPatients)
			.where(
				and(
					eq(therapistPatients.therapistId, therapistId),
					eq(therapistPatients.patientId, patientId),
				),
			)
			.limit(1);

		if (link.length === 0) {
			throw new Error("Patient not found or access denied");
		}

		const [patientUser] = await db
			.select()
			.from(user)
			.where(eq(user.id, patientId))
			.limit(1);

		const progress = await db
			.select()
			.from(exerciseProgress)
			.where(eq(exerciseProgress.userId, patientId));

		const patientPrograms = await db
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

		return { patient: patientUser, progress, programs: patientPrograms };
	});
