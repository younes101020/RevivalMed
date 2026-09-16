import { TourProvider, useTour } from "@reactour/tour";
import { useRouteContext, useRouterState } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
	getTourSteps,
	TOUR_STORAGE_KEYS,
	type TourRole,
} from "@/lib/tours";

type AppTourContextValue = {
	restartTour: () => void;
};

const AppTourContext = createContext<AppTourContextValue | null>(null);

export function useAppTour() {
	const context = useContext(AppTourContext);
	if (!context) throw new Error("useAppTour must be used within AppTourProvider");
	return context;
}

function TourController({ role, restartToken }: { role: TourRole; restartToken: number }) {
	const { setIsOpen, setSteps } = useTour();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const consumedRestartToken = useRef(0);
	const steps = useMemo(() => getTourSteps(role, pathname), [role, pathname]);

	useEffect(() => {
		setSteps?.(steps);
	}, [setSteps, steps]);

	useEffect(() => {
		if (typeof window === "undefined" || steps.length === 0) return;
		const storageKey = TOUR_STORAGE_KEYS[role];
		const shouldOpen = window.localStorage.getItem(storageKey) !== "true";
		if (!shouldOpen) return;

		const frame = window.requestAnimationFrame(() => setIsOpen(true));
		return () => window.cancelAnimationFrame(frame);
	}, [role, setIsOpen, steps.length]);

	useEffect(() => {
		if (restartToken === 0 || restartToken === consumedRestartToken.current || steps.length === 0) return;
		consumedRestartToken.current = restartToken;
		setIsOpen(true);
	}, [restartToken, setIsOpen, steps.length]);

	return null;
}

export function AppTourProvider({ children }: { children: ReactNode }) {
	const { user } = useRouteContext({ from: "/_auth" });
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const role = user?.role === "therapist" ? "therapist" : "patient";
	const [restartToken, setRestartToken] = useState(0);

	return (
		<AppTourContext.Provider
			value={{ restartTour: () => setRestartToken((token) => token + 1) }}
		>
			<TourProvider
				steps={getTourSteps(role, pathname)}
				showCloseButton
				showBadge
				showDots
				showNavigation
				onClickMask={() => {}}
				scrollSmooth
				beforeClose={() => {
					window.localStorage.setItem(TOUR_STORAGE_KEYS[role], "true");
				}}
				styles={{
					badge: (base) => ({
						...base,
						backgroundColor: "var(--primary)",
						color: "var(--primary-foreground)",
					}),
					popover: (base) => ({
						...base,
						backgroundColor: "var(--popover)",
						color: "var(--popover-foreground)",
						borderRadius: "var(--radius)",
					}),
					maskArea: (base) => ({ ...base, rx: 8 }),
				}}
			>
				<TourController role={role} restartToken={restartToken} />
				{children}
			</TourProvider>
		</AppTourContext.Provider>
	);
}