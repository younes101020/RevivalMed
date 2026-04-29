import { createFileRoute } from "@tanstack/react-router";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";

export const Route = createFileRoute("/api/profile/avatar/delete/server")({
	server: {
		handlers: {
			DELETE: async ({ request }) => {
				const session = await auth.api.getSession({ headers: request.headers });
				if (!session) {
					return new Response(JSON.stringify({ error: "Unauthorized" }), {
						status: 401,
						headers: { "Content-Type": "application/json" },
					})
				}

				try {
					const currentUser = await db
						.select()
						.from(user)
						.where(eq(user.id, session.user.id))
						.then((users) => users[0]);

					if (!currentUser?.image) {
						return new Response(
							JSON.stringify({ error: "No profile picture to delete" }),
							{ status: 400, headers: { "Content-Type": "application/json" } },
						)
					}

					// Extract filename from URL (e.g., "/images/avatars/user123.jpg" -> "user123.jpg")
					const imagePath = currentUser.image;
					const fileName = imagePath.split("/").pop();

					if (!fileName) {
						return new Response(
							JSON.stringify({ error: "Invalid image path" }),
							{ status: 400, headers: { "Content-Type": "application/json" } },
						)
					}

					// Delete file from filesystem
					const avatarsDir = join(process.cwd(), "public", "images", "avatars");
					const filePath = join(avatarsDir, fileName);

					try {
						await unlink(filePath);
					} catch (error) {
						// File might already be deleted, continue anyway
						console.warn("Failed to delete avatar file:", error);
					}

					// Clear image field in database
					await db
						.update(user)
						.set({ image: null, updatedAt: new Date() })
						.where(eq(user.id, session.user.id));

					return new Response(JSON.stringify({ success: true }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					})
				} catch (error) {
					console.error("Avatar deletion error:", error);
					return new Response(
						JSON.stringify({ error: "Failed to delete avatar" }),
						{ status: 500, headers: { "Content-Type": "application/json" } },
					)
				}
			},
		},
	},
});
