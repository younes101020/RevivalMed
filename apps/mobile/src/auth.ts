const BASE_URL = "http://10.0.2.2:3000";

export interface AuthUser {
  name: string;
  role: "therapist" | "patient";
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const user = data?.user;

    if (!user?.name || !user?.role) return null;

    return { name: user.name, role: user.role };
  } catch {
    return null;
  }
}
