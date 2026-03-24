import { Store } from "@tanstack/react-store";

export type ExerciseKey =
	| "memory"
	| "attention"
	| "planning"
	| "language"
	| "visuoSpatial"
	| "processingSpeed"
	| "informationProcessing";

export interface ExerciseRating {
	rating: number; // 0–100, starts at 30
	sessions: number;
}

export interface LevelState {
	exercises: Record<ExerciseKey, ExerciseRating>;
}

const DEFAULT_RATING: ExerciseRating = { rating: 30, sessions: 0 };

const defaultState: LevelState = {
	exercises: {
		memory: { ...DEFAULT_RATING },
		attention: { ...DEFAULT_RATING },
		planning: { ...DEFAULT_RATING },
		language: { ...DEFAULT_RATING },
		visuoSpatial: { ...DEFAULT_RATING },
		processingSpeed: { ...DEFAULT_RATING },
		informationProcessing: { ...DEFAULT_RATING },
	},
};

const STORAGE_KEY = "revivalmed_levels";

function loadInitialState(): LevelState {
	if (typeof window === "undefined") return defaultState;
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) return defaultState;
		return JSON.parse(saved) as LevelState;
	} catch {
		return defaultState;
	}
}

export const levelStore = new Store<LevelState>(loadInitialState());

levelStore.subscribe(() => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(levelStore.state));
});

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
}
