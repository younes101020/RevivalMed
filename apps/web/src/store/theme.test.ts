import { beforeEach, describe, expect, it } from "vitest";
import { applyTheme, themes } from "./theme";

describe("applyTheme", () => {
	beforeEach(() => {
		window.localStorage.clear();
		document.documentElement.removeAttribute("style");
	});

	it("updates the background CSS variables from the selected theme secondary color", () => {
		const nextTheme = themes[1];

		applyTheme(nextTheme.name);

		expect(document.documentElement.style.getPropertyValue("--background")).toBe(nextTheme.secondary);
		expect(document.documentElement.style.getPropertyValue("--card")).toBe(nextTheme.secondary);
	});
});
