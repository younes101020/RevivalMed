import { describe, expect, it } from "vitest";
import {
	getPatientLevel,
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
});
