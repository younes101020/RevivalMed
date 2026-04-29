import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";

const updateProfileSchema = z.object({
	name: z.string().min(1, "Name is required").optional(),
	email: z.string().email("Invalid email address").optional(),
}).refine((data) => data.name || data.email, {
	message: "At least one field must be updated",
});

export const Route = createFileRoute("/api/profile/update")({
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

				const validation = updateProfileSchema.safeParse(body);
				if (!validation.success) {
					const firstError = validation.error.issues[0];
					return new Response(
						JSON.stringify({ error: firstError?.message ?? "Validation error" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				const { name, email } = validation.data;

				// Check if email is already in use by another user
				if (email && email !== session.user.email) {
					const existingUser = await db
						.select()
						.from(user)
						.where(eq(user.email, email))
						.then((users) => users[0]);

					if (existingUser) {
						return new Response(
							JSON.stringify({ error: "Email is already in use" }),
							{ status: 400, headers: { "Content-Type": "application/json" } },
						);
					}
				}

				try {
					const updateData: Record<string, unknown> = { updatedAt: new Date() };

					if (name !== undefined) {
						updateData.name = name;
					}

					if (email !== undefined && email !== session.user.email) {
						updateData.email = email;
						// Mark email as not verified when it changes
						updateData.emailVerified = false;
						// TODO: Send verification email via better-auth email provider
						// For now, we'll just update the email - implement verification email sending
					}

					await db.update(user).set(updateData).where(eq(user.id, session.user.id));

					const updatedUser = await db
						.select()
						.from(user)
						.where(eq(user.id, session.user.id))
						.then((users) => users[0]);

					return new Response(JSON.stringify({ success: true, user: updatedUser }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Profile update error:", error);
					return new Response(
						JSON.stringify({ error: "Failed to update profile" }),
						{ status: 500, headers: { "Content-Type": "application/json" } },
					);
				}
			},
		},
	},
});
