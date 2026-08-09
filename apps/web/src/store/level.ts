import type {
	ExerciseKey,
	ExerciseRating,
	LevelState,
} from "@revivalmed/types";
import { Store } from "@tanstack/react-store";
import { awardExerciseXp, getPatientXp, upsertProgress } from "@/lib/progress";
import { isSuccessfulExercise, XP_PER_SUCCESS } from "@/lib/patient-level";

export type { ExerciseKey, ExerciseRating, LevelState };

const DEFAULT_RATING: ExerciseRating = { rating: 30, sessions: 0 };

const defaultState: LevelState = {
	userId: null,
	totalXp: 0,
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
	totalXp = 0,
): void {
	const exercises = { ...defaultState.exercises };
	for (const row of rows) {
		const key = row.exerciseKey as ExerciseKey;
		if (key in exercises) {
			exercises[key] = { rating: row.rating, sessions: row.sessions };
		}
	}
	levelStore.setState(() => ({ userId, exercises, totalXp }));
}

export function setTotalXp(totalXp: number): void {
	levelStore.setState((state) => ({ ...state, totalXp }));
}

export function updateRating(
	exercise: ExerciseKey,
	scorePercent: number,
) {
	const normalizedScore = Math.max(0, Math.min(100, scorePercent));
	let isNewHighscore = false;

	levelStore.setState((state) => {
		const current = state.exercises[exercise];
		const delta = (normalizedScore - 50) * 0.4; // -20 to +20 per session
		const newRating = Math.min(100, Math.max(0, current.rating + delta));

		isNewHighscore = newRating > current.rating;

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
		const shouldAwardXp = isSuccessfulExercise(normalizedScore);
		if (shouldAwardXp) setTotalXp(levelStore.state.totalXp + XP_PER_SUCCESS);
		const attemptId = crypto.randomUUID();
		awardExerciseXp({
			data: { userId, exerciseKey: exercise, attemptId, scorePercent: normalizedScore },
		}).then(({ totalXp }) => {
			setTotalXp(totalXp);
		}).catch(() => {
			getPatientXp({ data: userId }).then(setTotalXp).catch(() => {});
		});
	}

	return { isNewHighscore };
}
