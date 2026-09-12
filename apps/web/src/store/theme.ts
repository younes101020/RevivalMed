import { Store } from "@tanstack/react-store";

export interface ThemePalette {
	name: string;
	primary: string;
	secondary: string;
	primaryForeground: string;
	secondaryForeground: string;
}

export const themes: ThemePalette[] = [
	{
		name: "Détente (par défaut)",
		primary: "#78c9a5",
		secondary: "#ecf8f3",
		primaryForeground: "#062b25",
		secondaryForeground: "#466d5b",
	},
	{
		name: "Aube citronnée",
		primary: "#f2c14e",
		secondary: "#fff8dd",
		primaryForeground: "#49380a",
		secondaryForeground: "#856725",
	},
	{
		name: "Forêt tranquille",
		primary: "#4f8f72",
		secondary: "#e7f2ea",
		primaryForeground: "#062b1d",
		secondaryForeground: "#385d4c",
	},
	{
		name: "Océan profond",
		primary: "#4f86c6",
		secondary: "#dcebf9",
		primaryForeground: "#071e38",
		secondaryForeground: "#3f607e",
	},
	{
		name: "Corail joyeux",
		primary: "#e98272",
		secondary: "#ffecea",
		primaryForeground: "#4c1410",
		secondaryForeground: "#95544f",
	},
	{
		name: "Lavande solaire",
		primary: "#9b8acb",
		secondary: "#f3eefc",
		primaryForeground: "#281b54",
		secondaryForeground: "#655986",
	},
	{
		name: "Sable doux",
		primary: "#c99b6b",
		secondary: "#fff4ea",
		primaryForeground: "#513513",
		secondaryForeground: "#8b6b53",
	},
];

const STORAGE_KEY = "revivalmed:customization-theme";

export interface ThemeStoreState {
	name: string;
	primary: string;
	secondary: string;
	primaryForeground: string;
	secondaryForeground: string;
}

export const DEFAULT_THEME = themes[0];

function readStoredThemeName() {
	if (typeof window === "undefined") return DEFAULT_THEME.name;

	return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME.name;
}

function getThemeByName(name: string) {
	return themes.find((theme) => theme.name === name) ?? DEFAULT_THEME;
}

export const themeStore = new Store<ThemeStoreState>({
	name: readStoredThemeName(),
	primary: getThemeByName(readStoredThemeName()).primary,
	secondary: getThemeByName(readStoredThemeName()).secondary,
	primaryForeground: getThemeByName(readStoredThemeName()).primaryForeground,
	secondaryForeground: getThemeByName(readStoredThemeName()).secondaryForeground,
});

export function applyTheme(themeName: string) {
	const nextTheme = getThemeByName(themeName);
	const root = typeof document !== "undefined" ? document.documentElement : null;

	themeStore.setState(() => ({
		name: nextTheme.name,
		primary: nextTheme.primary,
		secondary: nextTheme.secondary,
		primaryForeground: nextTheme.primaryForeground,
		secondaryForeground: nextTheme.secondaryForeground,
	}));

	if (typeof window !== "undefined") {
		window.localStorage.setItem(STORAGE_KEY, nextTheme.name);
	}

	if (root) {
		root.style.setProperty("--background", nextTheme.secondary);
		root.style.setProperty("--card", nextTheme.secondary);
		root.style.setProperty("--popover", nextTheme.secondary);
		root.style.setProperty("--sidebar", nextTheme.secondary);
		root.style.setProperty("--primary", nextTheme.primary);
		root.style.setProperty("--secondary", nextTheme.secondary);
		root.style.setProperty("--primary-foreground", nextTheme.primaryForeground);
		root.style.setProperty("--secondary-foreground", nextTheme.secondaryForeground);
		root.style.setProperty("--ring", nextTheme.primary);
		root.style.setProperty("--sidebar-primary", nextTheme.primary);
		root.style.setProperty("--sidebar-primary-foreground", nextTheme.primaryForeground);
		root.style.setProperty("--accent", nextTheme.secondary);
		root.style.setProperty("--accent-foreground", nextTheme.secondaryForeground);
		root.style.setProperty("--sidebar-accent", nextTheme.secondary);
		root.style.setProperty("--sidebar-accent-foreground", nextTheme.secondaryForeground);
	}
}

export function hydrateThemeFromStorage() {
	applyTheme(readStoredThemeName());
}
