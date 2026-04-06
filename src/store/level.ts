import { Store } from "@tanstack/react-store";
import { upsertProgress } from "@/lib/progress";

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
	rating: number; // 0–100, starts at 30
	sessions: number;
}

export interface LevelState {
	userId: string | null;
	exercises: Record<ExerciseKey, ExerciseRating>;
}

const DEFAULT_RATING: ExerciseRating = { rating: 30, sessions: 0 };

const defaultState: LevelState = {
	userId: null,
	exercises: {
		memory: { ...DEFAULT_RATING },
		attention: { ...DEFAULT_RATING },
		planning: { ...DEFAULT_RATING },
		language: { ...DEFAULT_RATING },
		visuoSpatial: { ...DEFAULT_RATING },
		processingSpeed: { ...DEFAULT_RATING },
		informationProcessing: { ...DEFAULT_RATING },
		mentalFlexibility: { ...DEFAULT_RATING },
		workingMemory: { ...DEFAULT_RATING },
	},
};

export const levelStore = new Store<LevelState>(defaultState);

/** Called from the patient route loader after fetching progress from the DB. */
export function initLevelStore(
	userId: string,
	rows: { exerciseKey: string; rating: number; sessions: number }[],
): void {
	const exercises = { ...defaultState.exercises };
	for (const row of rows) {
		const key = row.exerciseKey as ExerciseKey;
		if (key in exercises) {
			exercises[key] = { rating: row.rating, sessions: row.sessions };
		}
	}
	levelStore.setState(() => ({ userId, exercises }));
}

export function updateRating(
	exercise: ExerciseKey,
	scorePercent: number,
): void {
	levelStore.setState((state) => {
		const current = state.exercises[exercise];
		const delta = (scorePercent - 50) * 0.4; // -20 to +20 per session
		const newRating = Math.min(100, Math.max(0, current.rating + delta));
		return {
			...state,
			exercises: {
				...state.exercises,
				[exercise]: { rating: newRating, sessions: current.sessions + 1 },
			},
		};
	});

	// Persist to DB (fire-and-forget)
	const { userId, exercises } = levelStore.state;
	if (userId) {
		upsertProgress({
			data: {
				userId,
				exerciseKey: exercise,
				rating: exercises[exercise].rating,
				sessions: exercises[exercise].sessions,
			},
		});
	}
}
