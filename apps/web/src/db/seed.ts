import { auth } from "../lib/auth.ts";
import { db } from "./index.ts";
import * as schema from "./schema.ts";
import { eq } from "drizzle-orm";

async function seed() {
    try {
        const res = await auth.api.signUpEmail({
            body: {
                name: "test123",
                email: "test123@test.com",
                password: "test123@test.com",
            },
        });
        console.log("Sign up successful:", res);

        // Update user role to therapist
        await db
            .update(schema.user)
            .set({ role: "therapist" })
            .where(eq(schema.user.email, "test123@test.com"));

        console.log("User role updated to therapist");
    } catch (error) {
        console.error("Sign up failed:", error);
        process.exit(1);
    }
}

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});
