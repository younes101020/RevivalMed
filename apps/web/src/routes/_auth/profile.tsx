import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/profile/ProfilePage";

export const Route = createFileRoute("/_auth/profile")({
	component: ProfileRoute,
});

function ProfileRoute() {
	const { user } = Route.useRouteContext();

	return <ProfilePage user={user} />;
}
