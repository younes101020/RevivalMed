import { useRouteContext, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function Nav() {
	const { user } = useRouteContext({ from: "/_auth" });
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await authClient.signOut();
		navigate({ to: "/login" });
	};

	return (
		<header className="border-b bg-background px-6 py-3 flex items-center justify-between">
			<div className="flex flex-col gap-0">
				<span className="font-semibold text-lg">RevivalMed</span>
				<span className="text-[0.55rem]">outil de remediation cognitive</span>
			</div>
			<div className="flex items-center gap-3">
				{user && (
					<>
						<span className="text-sm text-muted-foreground">{user.name}</span>
						<Badge
							variant={user.role === "therapist" ? "default" : "secondary"}
							className="text-secondary-foreground"
						>
							{user.role === "therapist" ? "Thérapeute" : "Patient"}
						</Badge>
					</>
				)}
				<Button variant="ghost" size="sm" onClick={handleSignOut}>
					<LogOut className="h-4 w-4 mr-1" />
					Déconnexion
				</Button>
			</div>
		</header>
	);
}
