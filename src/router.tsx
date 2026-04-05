import { createRouter } from "@tanstack/react-router";
import type { SessionUser } from "./lib/auth";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

export interface RouterContext {
	user: SessionUser | null;
}

// Create a new router instance
export const getRouter = () => {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: {
			user: null,
		} satisfies RouterContext,
	});
};
