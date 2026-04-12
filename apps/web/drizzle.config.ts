import { defineConfig } from "drizzle-kit";
import { loadEnv } from "vite";

const env = loadEnv("development", process.cwd(), "");

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL ?? process.env.DATABASE_URL ?? "",
	},
});
