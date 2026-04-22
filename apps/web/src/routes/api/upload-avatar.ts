import { createFileRoute } from "@tanstack/react-router";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXT_MAP: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/gif": "gif",
};

export const Route = createFileRoute("/api/upload-avatar")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const session = await auth.api.getSession({ headers: request.headers });
				if (!session) {
					return new Response(JSON.stringify({ error: "Non autorisé" }), {
						status: 401,
						headers: { "Content-Type": "application/json" },
					});
				}

				let formData: FormData;
				try {
					formData = await request.formData();
				} catch {
					return new Response(JSON.stringify({ error: "Requête invalide" }), {
						status: 400,
						headers: { "Content-Type": "application/json" },
					});
				}

				const file = formData.get("avatar");
				if (!(file instanceof File)) {
					return new Response(JSON.stringify({ error: "Aucun fichier fourni" }), {
						status: 400,
						headers: { "Content-Type": "application/json" },
					});
				}

				if (!ALLOWED_MIME_TYPES.includes(file.type)) {
					return new Response(
						JSON.stringify({ error: "Format non supporté. Utilisez JPEG, PNG, WebP ou GIF." }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				if (file.size > MAX_SIZE_BYTES) {
					return new Response(
						JSON.stringify({ error: "Fichier trop volumineux (max 5 Mo)" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				const ext = EXT_MAP[file.type] ?? "jpg";
				const fileName = `${session.user.id}.${ext}`;
				const avatarsDir = join(process.cwd(), "public", "images", "avatars");

				await mkdir(avatarsDir, { recursive: true });
				const buffer = Buffer.from(await file.arrayBuffer());
				await writeFile(join(avatarsDir, fileName), buffer);

				const imageUrl = `/images/avatars/${fileName}`;
				await db
					.update(user)
					.set({ image: imageUrl, updatedAt: new Date() })
					.where(eq(user.id, session.user.id));

				return new Response(JSON.stringify({ url: imageUrl }), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			},
		},
	},
});
