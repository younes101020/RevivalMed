import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

export const COUNTDOWN_OPTIONS = [0, 3, 5, 10] as const;

export interface GamePreferences {
	soundEnabled: boolean;
	countdownSeconds: (typeof COUNTDOWN_OPTIONS)[number];
	exerciseTimerEnabled: boolean;
}

export const DEFAULT_GAME_PREFERENCES: GamePreferences = {
	soundEnabled: true,
	countdownSeconds: 3,
	exerciseTimerEnabled: true,
};

const STORAGE_PREFIX = "revivalmed:game-preferences:";

function getStorageKey(userId: string) {
	return `${STORAGE_PREFIX}${userId}`;
}

function normalizePreferences(value: unknown): GamePreferences {
	if (!value || typeof value !== "object") return DEFAULT_GAME_PREFERENCES;

	const candidate = value as Partial<GamePreferences>;
	const countdownSeconds = COUNTDOWN_OPTIONS.includes(
		candidate.countdownSeconds as (typeof COUNTDOWN_OPTIONS)[number],
	)
		? (candidate.countdownSeconds as (typeof COUNTDOWN_OPTIONS)[number])
		: DEFAULT_GAME_PREFERENCES.countdownSeconds;

	return {
		soundEnabled:
		typeof candidate.soundEnabled === "boolean"
			? candidate.soundEnabled
			: DEFAULT_GAME_PREFERENCES.soundEnabled,
		countdownSeconds,
		exerciseTimerEnabled:
			typeof candidate.exerciseTimerEnabled === "boolean"
				? candidate.exerciseTimerEnabled
				: DEFAULT_GAME_PREFERENCES.exerciseTimerEnabled,
	};
}

export function readGamePreferences(userId: string): GamePreferences {
	if (typeof window === "undefined") return DEFAULT_GAME_PREFERENCES;

	try {
		const stored = window.localStorage.getItem(getStorageKey(userId));
		return stored ? normalizePreferences(JSON.parse(stored)) : DEFAULT_GAME_PREFERENCES;
	} catch {
		return DEFAULT_GAME_PREFERENCES;
	}
}

export function writeGamePreferences(
	userId: string,
	preferences: GamePreferences,
) {
	if (typeof window === "undefined") return;

	try {
		window.localStorage.setItem(
			getStorageKey(userId),
			JSON.stringify(normalizePreferences(preferences)),
		);
	} catch {
		// Local storage can be unavailable in private browsing or restricted contexts.
	}
}

interface GamePreferencesContextValue {
	preferences: GamePreferences;
	setPreferences: (preferences: GamePreferences) => void;
}

const GamePreferencesContext = createContext<GamePreferencesContextValue | null>(
	null,
);

export function GamePreferencesProvider({
	userId,
	children,
}: {
	userId: string;
	children: ReactNode;
}) {
	const [preferences, setPreferences] = useState(DEFAULT_GAME_PREFERENCES);

	useEffect(() => {
		setPreferences(readGamePreferences(userId));
	}, [userId]);

	const updatePreferences = (next: GamePreferences) => {
		const normalized = normalizePreferences(next);
		setPreferences(normalized);
		writeGamePreferences(userId, normalized);
	};

	const value = useMemo(
		() => ({ preferences, setPreferences: updatePreferences }),
		[preferences, userId],
	);

	return (
		<GamePreferencesContext.Provider value={value}>
			{children}
		</GamePreferencesContext.Provider>
	);
}

export function useGamePreferences() {
	return (
		useContext(GamePreferencesContext) ?? {
			preferences: DEFAULT_GAME_PREFERENCES,
			setPreferences: () => undefined,
		}
	);
}

export function useUserGamePreferences(userId: string) {
	const [preferences, setPreferences] = useState(DEFAULT_GAME_PREFERENCES);

	useEffect(() => {
		setPreferences(readGamePreferences(userId));
	}, [userId]);

	const updatePreferences = (next: GamePreferences) => {
		const normalized = normalizePreferences(next);
		setPreferences(normalized);
		writeGamePreferences(userId, normalized);
	};

	return { preferences, setPreferences: updatePreferences };
}
