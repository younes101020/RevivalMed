import { useState } from "react";
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { getPatients, createPatient } from "@/lib/therapist";
import {
Card,
CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_auth/therapist/")({
beforeLoad: ({ context }) => {
if (context.user?.role !== "therapist") {
throw redirect({ to: "/patient" });
}
},
loader: async ({ context }) => {
return getPatients({ data: context.user!.id });
},
component: TherapistDashboard,
});

function TherapistDashboard() {
const patients = Route.useLoaderData();
const { user } = Route.useRouteContext();
const [open, setOpen] = useState(false);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState<string | null>(null);
const [pending, setPending] = useState(false);
const navigate = Route.useNavigate();

const handleCreate = async (e: React.FormEvent) => {
e.preventDefault();
setError(null);
setPending(true);
try {
await createPatient({
data: {
therapistId: user!.id,
name,
email,
password,
},
});
setOpen(false);
setName("");
setEmail("");
setPassword("");
navigate({ to: "/therapist" });
} catch (err) {
setError(err instanceof Error ? err.message : "Erreur lors de la création");
} finally {
setPending(false);
}
};

return (
<div className="container mx-auto p-6 space-y-6">
<div className="flex items-center justify-between">
<h1 className="text-3xl font-bold">Mes patients</h1>
<Dialog open={open} onOpenChange={setOpen}>
<DialogTrigger asChild>
<Button className="text-secondary-foreground">
<UserPlus className="mr-2 h-4 w-4" />
Ajouter un patient
</Button>
</DialogTrigger>
<DialogContent>
<DialogHeader>
<DialogTitle>Nouveau patient</DialogTitle>
</DialogHeader>
<form onSubmit={handleCreate} className="space-y-4">
<div className="space-y-1">
<Label htmlFor="new-name">Nom</Label>
<Input
id="new-name"
required
value={name}
onChange={(e) => setName(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label htmlFor="new-email">Email</Label>
<Input
id="new-email"
type="email"
required
value={email}
onChange={(e) => setEmail(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label htmlFor="new-password">Mot de passe provisoire</Label>
<Input
id="new-password"
type="password"
required
minLength={8}
value={password}
onChange={(e) => setPassword(e.target.value)}
/>
</div>
{error && <p className="text-sm text-red-500">{error}</p>}
<Button type="submit" className="w-full" disabled={pending}>
{pending ? "Création..." : "Créer le compte"}
</Button>
</form>
</DialogContent>
</Dialog>
</div>

{patients.length === 0 ? (
<Card>
<CardContent className="py-12 text-center text-muted-foreground">
Aucun patient pour le moment. Ajoutez votre premier patient.
</CardContent>
</Card>
) : (
<div className="grid gap-3">
{patients.map((patient) => (
<Link
key={patient.id}
to="/therapist/patients/$patientId"
params={{ patientId: patient.id }}
className="block"
>
<Card className="hover:bg-muted/50 transition-colors cursor-pointer">
<CardContent className="flex items-center justify-between py-4">
<div>
<p className="font-medium">{patient.name}</p>
<p className="text-sm text-muted-foreground">{patient.email}</p>
</div>
<ChevronRight className="h-4 w-4 text-muted-foreground" />
</CardContent>
</Card>
</Link>
))}
</div>
)}
</div>
);
}
