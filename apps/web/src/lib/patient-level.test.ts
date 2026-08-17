import { describe, expect, it } from "vitest";
import {
	getPatientLevel,
	getPatientTier,
	getXpTowardNextLevel,
	isSuccessfulExercise,
} from "./patient-level";

describe("patient level", () => {
	it.each([
		[0, 1],
		[90, 1],
		[100, 2],
		[250, 3],
	])("maps %i XP to level %i", (xp, level) => {
		expect(getPatientLevel(xp)).toBe(level);
	});

	it("tracks progress and only accepts scores of at least 50%", () => {
		expect(getXpTowardNextLevel(250)).toBe(50);
		expect(isSuccessfulExercise(49)).toBe(false);
		expect(isSuccessfulExercise(50)).toBe(true);
	});

	it.each([
		[1, "Graine"],
		[10, "Graine"],
		[11, "Pousse"],
		[25, "Pousse"],
		[26, "Bourgeon"],
		[40, "Bourgeon"],
		[41, "Fleur"],
		[55, "Fleur"],
		[56, "Arbre"],
		[75, "Arbre"],
		[76, "Forêt"],
		[150, "Forêt"],
	])("assigns level %i to %s", (level, tierName) => {
		expect(getPatientTier(level).name).toBe(tierName);
	});
});
