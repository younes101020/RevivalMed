import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { Nav } from "@/components/layout/nav";

export const Route = createFileRoute("/_auth")({
	beforeLoad: ({ context }) => {
		if (!context.user) {
			throw redirect({ to: "/login" });
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<div className="h-full flex flex-col">
			<Nav />
			<main className="flex-1 overflow-auto">
				<Outlet />
			</main>
		</div>
	);
}
