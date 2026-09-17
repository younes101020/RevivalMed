import { ScriptOnce } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { hydrateThemeFromStorage } from "@/store/theme";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
	undefined,
);

function getThemeScript(storageKey: string, defaultTheme: Theme) {
	const key = JSON.stringify(storageKey);
	const fallback = JSON.stringify(defaultTheme);

	return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`;
}

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	const resolvedTheme =
		theme === "system"
			? window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light"
			: theme;

	root.classList.remove("light", "dark");
	root.classList.add(resolvedTheme);
	root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({
	children,
	defaultTheme = "dark",
	storageKey = "revivalmed:color-mode",
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(defaultTheme);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const storedTheme = window.localStorage.getItem(storageKey);
		setThemeState(
			storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
				? storedTheme
				: defaultTheme,
		);
		setMounted(true);
	}, [defaultTheme, storageKey]);

	useEffect(() => {
		if (!mounted) return;
		applyTheme(theme);
		hydrateThemeFromStorage();
	}, [mounted, theme]);

	useEffect(() => {
		if (!mounted || theme !== "system") return;

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => applyTheme("system");
		media.addEventListener("change", handleChange);
		return () => media.removeEventListener("change", handleChange);
	}, [mounted, theme]);

	const setTheme = (nextTheme: Theme) => {
		window.localStorage.setItem(storageKey, nextTheme);
		setThemeState(nextTheme);
	};

	return (
		<ThemeProviderContext.Provider value={{ theme, setTheme }}>
			<ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeProviderContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}