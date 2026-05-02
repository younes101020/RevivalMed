import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

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
		<SidebarProvider>
			<AppSidebar />
			<main className="flex-1 overflow-auto">
				<SidebarTrigger />
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
