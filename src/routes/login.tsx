import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
beforeLoad: ({ context }) => {
if (context.user) {
throw redirect({
to: context.user.role === "therapist" ? "/therapist" : "/patient",
});
}
},
component: LoginPage,
ssr: false,
});

function LoginPage() {
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState<string | null>(null);
const [pending, setPending] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setError(null);
setPending(true);
try {
const { data, error: signInError } = await authClient.signIn.email({
email,
password,
});
if (signInError || !data?.user) {
setError(signInError?.message ?? "Identifiants invalides");
return;
}
const role = (data.user as { role?: string }).role;
await navigate({ to: role === "therapist" ? "/therapist" : "/patient" });
} catch {
setError("Une erreur est survenue. Veuillez réessayer.");
} finally {
setPending(false);
}
};

return (
<div className="h-full flex items-center justify-center">
<Card className="w-full max-w-sm">
<CardHeader>
<CardTitle className="text-2xl font-bold text-center">
RevivalMed
</CardTitle>
</CardHeader>
<CardContent>
<form onSubmit={handleSubmit} className="space-y-4">
<div className="space-y-1">
<Label htmlFor="email">Email</Label>
<Input
id="email"
type="email"
autoComplete="email"
required
value={email}
onChange={(e) => setEmail(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label htmlFor="password">Mot de passe</Label>
<Input
id="password"
type="password"
autoComplete="current-password"
required
value={password}
onChange={(e) => setPassword(e.target.value)}
/>
</div>
{error && <p className="text-sm text-red-500">{error}</p>}
<Button type="submit" className="w-full" disabled={pending}>
{pending ? "Connexion..." : "Se connecter"}
</Button>
</form>
</CardContent>
</Card>
</div>
);
}
