import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.ts";

function createPool() {
	if (typeof process === "undefined" || !process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL environment variable is required");
	}
	return new Pool({ connectionString: process.env.DATABASE_URL });
}

// Singleton — reuse across requests in the same process (server-only)
const globalForDb = globalThis as unknown as { _pgPool?: Pool };
const pool = globalForDb._pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForDb._pgPool = pool;

export const db = drizzle(pool, { schema });
export type Db = typeof db;
