import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		if (!context.user) throw redirect({ to: "/login" });
		const r=context.user.role;
		if (r==="therapist") throw redirect({ to: "/therapist" });
		throw redirect({ to: "/patient" });
	},
	component: () => null,
});
