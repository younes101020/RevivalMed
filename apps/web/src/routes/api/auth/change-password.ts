import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { auth } from "@/lib/auth";

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string().min(8, "Password must be at least 8 characters"),
	confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
});

export const Route = createFileRoute("/api/auth/change-password")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const session = await auth.api.getSession({ headers: request.headers });
				if (!session) {
					return new Response(JSON.stringify({ error: "Unauthorized" }), {
						status: 401,
						headers: { "Content-Type": "application/json" },
					});
				}

				let body: unknown;
				try {
					body = await request.json();
				} catch {
					return new Response(JSON.stringify({ error: "Invalid request" }), {
						status: 400,
						headers: { "Content-Type": "application/json" },
					});
				}

				const validation = changePasswordSchema.safeParse(body);
				if (!validation.success) {
					const firstError = validation.error.issues[0];
					return new Response(
						JSON.stringify({ error: firstError?.message ?? "Validation error" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				const { currentPassword, newPassword } = validation.data;

				try {
					// Forward the password change request to better-auth's change-password endpoint
					const result = await auth.handler(
						new Request(
							new URL("/api/auth/change-password", request.url),
							{
								method: "POST",
								headers: request.headers,
								body: JSON.stringify({
									currentPassword,
									newPassword,
								}),
							},
						),
					);

					if (result instanceof Response && result.status === 200) {
						return new Response(JSON.stringify({ success: true }), {
							status: 200,
							headers: { "Content-Type": "application/json" },
						});
					}

					return result || new Response(
						JSON.stringify({ error: "Failed to change password" }),
						{ status: 500, headers: { "Content-Type": "application/json" } },
					);
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : "Failed to change password";
					console.error("Password change error:", error);

					// Check for specific error messages from better-auth
					if (errorMessage.includes("password") || errorMessage.includes("Password")) {
						return new Response(
							JSON.stringify({ error: errorMessage || "Current password is incorrect" }),
							{ status: 400, headers: { "Content-Type": "application/json" } },
						);
					}

					return new Response(
						JSON.stringify({ error: "Failed to change password" }),
						{ status: 500, headers: { "Content-Type": "application/json" } },
					);
				}
			},
		},
	},
});
