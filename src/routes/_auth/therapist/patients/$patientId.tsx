import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getPatientDetail, upsertAssignment } from "@/lib/therapist";
import type { ExerciseKey } from "@/store/level";

const EXERCISE_LABELS: Record<ExerciseKey, string> = {
	memory: "Mémoire",
	attention: "Attention",
	planning: "Planification",
	language: "Langage",
	visuoSpatial: "Visuo-spatial",
	processingSpeed: "Vitesse de traitement",
	informationProcessing: "Traitement de l'information",
	mentalFlexibility: "Flexibilité mentale",
	workingMemory: "Mémoire de travail",
};

export const Route = createFileRoute("/_auth/therapist/patients/$patientId")({
	beforeLoad: ({ context }) => {
		if (context.user?.role !== "therapist") {
			throw redirect({ to: "/patient" });
		}
	},
	loader: async ({ context, params }) => {
		return getPatientDetail({
			data: { therapistId: context.user!.id, patientId: params.patientId },
		});
	},
	component: PatientDetail,
});

function PatientDetail() {
	const { patient, progress, assignments } = Route.useLoaderData();
	const { user } = Route.useRouteContext();
	const { patientId } = Route.useParams();
	const [overrides, setOverrides] = useState<Record<string, string>>(() => {
		const map: Record<string, string> = {};
		for (const a of assignments) {
			if (a.difficultyOverride != null) {
				map[a.exerciseKey] = String(a.difficultyOverride);
			}
		}
		return map;
	});
	const [saving, setSaving] = useState<string | null>(null);

	const progressMap = Object.fromEntries(
		progress.map((p) => [p.exerciseKey, p]),
	);

	const handleSave = async (exerciseKey: ExerciseKey) => {
		setSaving(exerciseKey);
		const raw = overrides[exerciseKey];
		const val = raw === "" || raw === undefined ? null : Number(raw);
		try {
			await upsertAssignment({
				data: {
					therapistId: user!.id,
					patientId,
					exerciseKey,
					difficultyOverride: val,
				},
			});
		} finally {
			setSaving(null);
		}
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div>
				<h1 className="text-3xl font-bold">{patient.name}</h1>
				<p className="text-muted-foreground">{patient.email}</p>
			</div>

			<Separator />

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Progression par exercice</h2>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{(Object.keys(EXERCISE_LABELS) as ExerciseKey[]).map((key) => {
						const p = progressMap[key];
						const rating = p?.rating ?? 30;
						const sessions = p?.sessions ?? 0;
						const override = overrides[key];
						return (
							<Card key={key}>
								<CardHeader className="pb-2">
									<CardTitle className="text-base flex items-center justify-between">
										{EXERCISE_LABELS[key]}
										<Badge variant="secondary">
											{sessions} session{sessions !== 1 ? "s" : ""}
										</Badge>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="space-y-1">
										<div className="flex justify-between text-sm text-muted-foreground">
											<span>Niveau adaptatif</span>
											<span>{Math.round(rating)}%</span>
										</div>
										<div className="h-2 bg-secondary rounded-full overflow-hidden">
											<div
												className="h-full bg-primary transition-all"
												style={{ width: `${rating}%` }}
											/>
										</div>
									</div>
									<div className="flex gap-2 items-end">
										<div className="flex-1 space-y-1">
											<Label htmlFor={`override-${key}`} className="text-xs">
												Difficulté imposée (0–100, vide = auto)
											</Label>
											<Input
												id={`override-${key}`}
												type="number"
												min={0}
												max={100}
												className="h-8 text-sm"
												placeholder="Auto"
												value={override ?? ""}
												onChange={(e) =>
													setOverrides((prev) => ({
														...prev,
														[key]: e.target.value,
													}))
												}
											/>
										</div>
										<Button
											size="sm"
											variant="outline"
											disabled={saving === key}
											onClick={() => handleSave(key)}
										>
											{saving === key ? "..." : "Sauvegarder"}
										</Button>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>
		</div>
	);
}
