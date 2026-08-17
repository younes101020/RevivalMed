export const XP_PER_SUCCESS = 10;
export const XP_PER_LEVEL = 100;
export const SUCCESS_SCORE_PERCENT = 50;

export type PatientTier = {
	name: "Graine" | "Pousse" | "Bourgeon" | "Fleur" | "Arbre" | "Forêt";
	minLevel: number;
	maxLevel: number | null;
	iconSrc: string;
};

export const PATIENT_TIERS: readonly PatientTier[] = [
	{
		name: "Graine",
		minLevel: 1,
		maxLevel: 10,
		iconSrc: "/images/levels/graine.png",
	},
	{
		name: "Pousse",
		minLevel: 11,
		maxLevel: 25,
		iconSrc: "/images/levels/pousse.png",
	},
	{
		name: "Bourgeon",
		minLevel: 26,
		maxLevel: 40,
		iconSrc: "/images/levels/bourgeon.png",
	},
	{
		name: "Fleur",
		minLevel: 41,
		maxLevel: 55,
		iconSrc: "/images/levels/fleur.png",
	},
	{
		name: "Arbre",
		minLevel: 56,
		maxLevel: 75,
		iconSrc: "/images/levels/arbre.png",
	},
	{
		name: "Forêt",
		minLevel: 76,
		maxLevel: null,
		iconSrc: "/images/levels/foret.png",
	},
];

export function getPatientLevel(totalXp: number): number {
	return Math.floor(Math.max(0, totalXp) / XP_PER_LEVEL) + 1;
}

export function getPatientTier(level: number): PatientTier {
	const safeLevel = Math.max(1, level);
	return (
		PATIENT_TIERS.find(
			(tier) =>
				safeLevel >= tier.minLevel &&
				(tier.maxLevel === null || safeLevel <= tier.maxLevel),
		) ?? PATIENT_TIERS[0]
	);
}

export function getXpTowardNextLevel(totalXp: number): number {
	return Math.max(0, totalXp) % XP_PER_LEVEL;
}

export function isSuccessfulExercise(scorePercent: number): boolean {
	return scorePercent >= SUCCESS_SCORE_PERCENT;
}
