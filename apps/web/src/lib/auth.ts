import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification,
		},
	}),
	emailAndPassword: {
		enabled: true,
		// No email provider — disable password reset
		sendResetPassword: undefined,
		// Patients are created by therapists; public sign-up is disabled
		disableSignUp: true,
	},
	user: {
		additionalFields: {
			role: {
				type: ["therapist", "patient"] as const,
				required: true,
				defaultValue: "patient" as const,
				// Prevent the client from setting their own role on sign-up
				input: false,
			},
		},
	},
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type SessionUser = Session["user"];
