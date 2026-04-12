import { Link, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useId, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
	createMission,
	deleteMission,
	getMissionsForTherapistPatient,
	updateMission,
} from "@/lib/missions";
import { deleteAssignment, getPatientDetail, upsertAssignment } from "@/lib/therapist";
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
		const [detail, patientMissions] = await Promise.all([
			getPatientDetail({
				data: { therapistId: context.user!.id, patientId: params.patientId },
			}),
			getMissionsForTherapistPatient({
				data: { therapistId: context.user!.id, patientId: params.patientId },
			}),
		]);
		return { ...detail, patientMissions };
	},
	component: PatientDetail,
});

type MissionForm = {
	title: string;
	description: string;
	cognitiveFunctions: ExerciseKey[];
};

const EMPTY_FORM: MissionForm = { title: "", description: "", cognitiveFunctions: [] };

function PatientDetail() {
	const { patient, progress, assignments, patientMissions } = Route.useLoaderData();
	const { user } = Route.useRouteContext();
	const { patientId } = Route.useParams();
	const router = useRouter();

	// ── Exercise state ───────────────────────────────────────────────────────
	const [assigned, setAssigned] = useState<Set<ExerciseKey>>(
		() => new Set(assignments.map((a) => a.exerciseKey as ExerciseKey)),
	);
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

	const handleToggleAssign = async (exerciseKey: ExerciseKey) => {
		setSaving(exerciseKey);
		try {
			if (assigned.has(exerciseKey)) {
				await deleteAssignment({ data: { therapistId: user!.id, patientId, exerciseKey } });
				setAssigned((prev) => { const s = new Set(prev); s.delete(exerciseKey); return s; });
			} else {
				await upsertAssignment({ data: { therapistId: user!.id, patientId, exerciseKey, difficultyOverride: null } });
				setAssigned((prev) => new Set([...prev, exerciseKey]));
			}
		} finally {
			setSaving(null);
		}
	};

	const handleSaveOverride = async (exerciseKey: ExerciseKey) => {
		setSaving(`override-${exerciseKey}`);
		const raw = overrides[exerciseKey];
		const val = raw === "" || raw === undefined ? null : Number(raw);
		try {
			await upsertAssignment({ data: { therapistId: user!.id, patientId, exerciseKey, difficultyOverride: val } });
		} finally {
			setSaving(null);
		}
	};

	// ── Mission state ────────────────────────────────────────────────────────
	const missionTitleId = useId();
	const missionDescId = useId();
	const [missionDialogOpen, setMissionDialogOpen] = useState(false);
	const [editingMissionId, setEditingMissionId] = useState<string | null>(null);
	const [missionForm, setMissionForm] = useState<MissionForm>(EMPTY_FORM);
	const [missionSaving, setMissionSaving] = useState(false);
	const [missionDeleting, setMissionDeleting] = useState<string | null>(null);

	const openNewMission = () => {
		setEditingMissionId(null);
		setMissionForm(EMPTY_FORM);
		setMissionDialogOpen(true);
	};

	const openEditMission = (m: (typeof patientMissions)[number]) => {
		setEditingMissionId(m.id);
		setMissionForm({
			title: m.title,
			description: m.description,
			cognitiveFunctions: m.cognitiveFunctions as ExerciseKey[],
		});
		setMissionDialogOpen(true);
	};

	const toggleCognitiveFunction = (key: ExerciseKey) => {
		setMissionForm((prev) => ({
			...prev,
			cognitiveFunctions: prev.cognitiveFunctions.includes(key)
				? prev.cognitiveFunctions.filter((k) => k !== key)
				: [...prev.cognitiveFunctions, key],
		}));
	};

	const handleSaveMission = async () => {
		if (!missionForm.title.trim()) return;
		setMissionSaving(true);
		try {
			if (editingMissionId) {
				await updateMission({
					data: {
						missionId: editingMissionId,
						therapistId: user!.id,
						title: missionForm.title,
						description: missionForm.description,
						cognitiveFunctions: missionForm.cognitiveFunctions,
					},
				});
			} else {
				await createMission({
					data: {
						therapistId: user!.id,
						patientId,
						title: missionForm.title,
						description: missionForm.description,
						cognitiveFunctions: missionForm.cognitiveFunctions,
					},
				});
			}
			setMissionDialogOpen(false);
			router.invalidate();
		} finally {
			setMissionSaving(false);
		}
	};

	const handleDeleteMission = async (missionId: string) => {
		setMissionDeleting(missionId);
		try {
			await deleteMission({ data: { missionId, therapistId: user!.id } });
			router.invalidate();
		} finally {
			setMissionDeleting(null);
		}
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div>
				<Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
					<Link to="/therapist">
						<ChevronLeft className="h-4 w-4" />
						Retour
					</Link>
				</Button>
				<h1 className="text-3xl font-bold">{patient.name}</h1>
				<p className="text-muted-foreground">{patient.email}</p>
			</div>

			<Separator />

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Exercices</h2>
				<p className="text-sm text-muted-foreground">
					Cochez les exercices à débloquer pour ce patient. Vous pouvez aussi imposer une difficulté fixe (0–100).
				</p>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{(Object.keys(EXERCISE_LABELS) as ExerciseKey[]).map((key) => {
						const p = progressMap[key];
						const rating = p?.rating ?? 30;
						const sessions = p?.sessions ?? 0;
						const isAssigned = assigned.has(key);
						const override = overrides[key];
						const toggling = saving === key;
						const savingOverride = saving === `override-${key}`;
						return (
							<Card key={key} className={isAssigned ? "" : "opacity-60"}>
								<CardHeader className="pb-2">
									<CardTitle className="text-base flex items-center justify-between gap-2">
										<label className="flex items-center gap-2 cursor-pointer select-none">
											<input
												type="checkbox"
												className="accent-primary h-4 w-4"
												checked={isAssigned}
												disabled={toggling}
												onChange={() => handleToggleAssign(key)}
											/>
											{EXERCISE_LABELS[key]}
										</label>
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
									{isAssigned && (
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
														setOverrides((prev) => ({ ...prev, [key]: e.target.value }))
													}
												/>
											</div>
											<Button
												size="sm"
												variant="outline"
												disabled={savingOverride}
												onClick={() => handleSaveOverride(key)}
											>
												{savingOverride ? "..." : "Sauvegarder"}
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			<Separator />

			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold">Missions</h2>
						<p className="text-sm text-muted-foreground">
							Les missions sont accessibles au patient une fois tous ses exercices au niveau maximum (4/4).
						</p>
					</div>
					<Button onClick={openNewMission}>Nouvelle mission</Button>
				</div>

				{patientMissions.length === 0 ? (
					<p className="text-sm text-muted-foreground">Aucune mission assignée pour l'instant.</p>
				) : (
					<div className="grid gap-3 sm:grid-cols-2">
						{patientMissions.map((m) => (
							<Card key={m.id}>
								<CardHeader className="pb-2">
									<CardTitle className="text-base flex items-start justify-between gap-2">
										<span>{m.title}</span>
										<div className="flex gap-1 shrink-0">
											{m.completedAt && (
												<Badge variant="secondary" className="text-green-600">
													Terminée
												</Badge>
											)}
											<Button
												size="sm"
												variant="ghost"
												className="h-7 px-2 text-xs"
												onClick={() => openEditMission(m)}
											>
												Modifier
											</Button>
											<Button
												size="sm"
												variant="ghost"
												className="h-7 px-2 text-xs text-destructive hover:text-destructive"
												disabled={missionDeleting === m.id}
												onClick={() => handleDeleteMission(m.id)}
											>
												{missionDeleting === m.id ? "..." : "Supprimer"}
											</Button>
										</div>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<p className="text-sm text-muted-foreground">{m.description}</p>
									{m.cognitiveFunctions.length > 0 && (
										<div className="flex flex-wrap gap-1">
											{(m.cognitiveFunctions as ExerciseKey[]).map((fn) => (
												<Badge key={fn} variant="outline" className="text-xs">
													{EXERCISE_LABELS[fn]}
												</Badge>
											))}
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</section>

			{/* Mission dialog (create / edit) */}
			<Dialog open={missionDialogOpen} onOpenChange={setMissionDialogOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>
							{editingMissionId ? "Modifier la mission" : "Nouvelle mission"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<div className="space-y-1">
							<Label htmlFor={missionTitleId}>Titre</Label>
							<Input
								id={missionTitleId}
								value={missionForm.title}
								onChange={(e) => setMissionForm((p) => ({ ...p, title: e.target.value }))}
								placeholder="Ex : Promenade quotidienne"
							/>
						</div>
						<div className="space-y-1">
							<Label htmlFor={missionDescId}>Description</Label>
							<Textarea
								id={missionDescId}
								value={missionForm.description}
								onChange={(e) => setMissionForm((p) => ({ ...p, description: e.target.value }))}
								placeholder="Décrivez la mission en détail…"
								rows={3}
							/>
						</div>
						<div className="space-y-2">
							<Label>Fonctions cognitives ciblées</Label>
							<div className="grid grid-cols-2 gap-2">
								{(Object.keys(EXERCISE_LABELS) as ExerciseKey[]).map((key) => (
									<label
										key={key}
										className="flex items-center gap-2 cursor-pointer select-none text-sm"
									>
										<input
											type="checkbox"
											className="accent-primary h-4 w-4"
											checked={missionForm.cognitiveFunctions.includes(key)}
											onChange={() => toggleCognitiveFunction(key)}
										/>
										{EXERCISE_LABELS[key]}
									</label>
								))}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setMissionDialogOpen(false)}>
							Annuler
						</Button>
						<Button
							disabled={missionSaving || !missionForm.title.trim()}
							onClick={handleSaveMission}
						>
							{missionSaving ? "Sauvegarde…" : "Sauvegarder"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
