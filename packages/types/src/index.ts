// ─── Exercise domain ──────────────────────────────────────────────────────────

export type ExerciseKey =
	| "memory"
	| "attention"
	| "planning"
	| "language"
	| "visuoSpatial"
	| "processingSpeed"
	| "informationProcessing"
	| "mentalFlexibility"
	| "workingMemory";

export interface ExerciseRating {
	/** 0–100, starts at 30 */
	rating: number;
	sessions: number;
}

export interface LevelState {
	userId: string | null;
	exercises: Record<ExerciseKey, ExerciseRating>;
}

// ─── User domain ──────────────────────────────────────────────────────────────

export type UserRole = "therapist" | "patient";

export type SharedConfig = {
	showConfetti?: boolean;
}