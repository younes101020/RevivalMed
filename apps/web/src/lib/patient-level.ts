export const XP_PER_SUCCESS = 10;
export const XP_PER_LEVEL = 100;
export const SUCCESS_SCORE_PERCENT = 50;

export function getPatientLevel(totalXp: number): number {
	return Math.floor(Math.max(0, totalXp) / XP_PER_LEVEL) + 1;
}

export function getXpTowardNextLevel(totalXp: number): number {
	return Math.max(0, totalXp) % XP_PER_LEVEL;
}

export function isSuccessfulExercise(scorePercent: number): boolean {
	return scorePercent >= SUCCESS_SCORE_PERCENT;
}
