import { Link, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronUp, Copy, Trash2 } from "lucide-react";
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
	createProgram,
	deleteProgram,
	getProgram,
	type WeekInput,
} from "@/lib/programs";
import { getPatientDetail } from "@/lib/therapist";
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

const ALL_EXERCISE_KEYS = Object.keys(EXERCISE_LABELS) as ExerciseKey[];

export const Route = createFileRoute("/_auth/therapist/patients/$patientId")({
	beforeLoad: ({ context }) => {
		if (context.user?.role !== "therapist") {
			throw redirect({ to: "/patient" });
		}
	},
	loader: async ({ context, params }) => {
		const detail = await getPatientDetail({
			data: { therapistId: context.user!.id, patientId: params.patientId },
		});
		return detail;
	},
	component: PatientDetail,
});

// ─── Types ───────────────────────────────────────────────────────────────────

type WeekFormData = {
	exercises: Set<ExerciseKey>;
	overrides: Record<string, string>;
	missionTitle: string;
	missionDescription: string;
	missionCognitiveFunctions: ExerciseKey[];
};

function emptyWeek(): WeekFormData {
	return {
		exercises: new Set(),
		overrides: {},
		missionTitle: "",
		missionDescription: "",
		missionCognitiveFunctions: [],
	};
}

function getProgramStatus(startDate: string): "upcoming" | "active" | "completed" {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const start = new Date(startDate);
	const end = new Date(startDate);
	end.setDate(end.getDate() + 16 * 7 - 1);

	if (today < start) return "upcoming";
	if (today > end) return "completed";
	return "active";
}

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

// ─── Main component ──────────────────────────────────────────────────────────

function PatientDetail() {
	const { patient, progress, programs: patientPrograms } = Route.useLoaderData();
	const { user } = Route.useRouteContext();
	const { patientId } = Route.useParams();
	const router = useRouter();

	const [showCreator, setShowCreator] = useState(false);
	const [viewingProgramId, setViewingProgramId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<string | null>(null);

	const progressMap = Object.fromEntries(
		progress.map((p) => [p.exerciseKey, p]),
	);

	const handleDelete = async (programId: string) => {
		setDeleting(programId);
		try {
			await deleteProgram({ data: { therapistId: user!.id, programId } });
			router.invalidate();
		} finally {
			setDeleting(null);
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

			{/* Progress overview */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Progression globale</h2>
				<div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{ALL_EXERCISE_KEYS.map((key) => {
						const p = progressMap[key];
						const rating = p?.rating ?? 30;
						const sessions = p?.sessions ?? 0;
						return (
							<Card key={key}>
								<CardContent className="pt-4 space-y-2">
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">{EXERCISE_LABELS[key]}</span>
										<Badge variant="secondary" className="text-xs">
											{sessions} sess.
										</Badge>
									</div>
									<div className="h-2 bg-secondary rounded-full overflow-hidden">
										<div
											className="h-full bg-primary transition-all"
											style={{ width: `${rating}%` }}
										/>
									</div>
									<p className="text-xs text-muted-foreground text-right">{Math.round(rating)}%</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			<Separator />

			{/* Programs section */}
			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold">Programmes</h2>
						<p className="text-sm text-muted-foreground">
							Chaque programme couvre 16 semaines avec des exercices et une mission par semaine.
						</p>
					</div>
					{!showCreator && (
						<Button onClick={() => setShowCreator(true)}>Nouveau programme</Button>
					)}
				</div>

				{patientPrograms.length === 0 && !showCreator && (
					<p className="text-sm text-muted-foreground">Aucun programme créé pour l'instant.</p>
				)}

				{patientPrograms.map((prog) => {
					const status = getProgramStatus(prog.startDate);
					const endDate = new Date(prog.startDate);
					endDate.setDate(endDate.getDate() + 16 * 7 - 1);
					return (
						<Card key={prog.id}>
							<CardHeader className="pb-2">
								<CardTitle className="text-base flex items-center justify-between gap-2">
									<span>
										{formatDate(prog.startDate)} → {formatDate(endDate.toISOString().slice(0, 10))}
									</span>
									<div className="flex items-center gap-2">
										<Badge
											variant={status === "active" ? "default" : "secondary"}
											className={status === "completed" ? "text-green-600" : status === "upcoming" ? "text-blue-600" : ""}
										>
											{status === "active" ? "En cours" : status === "upcoming" ? "À venir" : "Terminé"}
										</Badge>
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												setViewingProgramId(
													viewingProgramId === prog.id ? null : prog.id,
												)
											}
										>
											{viewingProgramId === prog.id ? "Masquer" : "Détails"}
										</Button>
										<Button
											size="sm"
											variant="ghost"
											className="text-destructive hover:text-destructive"
											disabled={deleting === prog.id}
											onClick={() => handleDelete(prog.id)}
										>
											{deleting === prog.id ? "..." : <Trash2 className="h-4 w-4" />}
										</Button>
									</div>
								</CardTitle>
							</CardHeader>
							{viewingProgramId === prog.id && (
								<CardContent>
									<ProgramDetail
										therapistId={user!.id}
										programId={prog.id}
										startDate={prog.startDate}
									/>
								</CardContent>
							)}
						</Card>
					);
				})}

				{showCreator && (
					<ProgramCreator
						therapistId={user!.id}
						patientId={patientId}
						onDone={() => {
							setShowCreator(false);
							router.invalidate();
						}}
						onCancel={() => setShowCreator(false)}
					/>
				)}
			</section>
		</div>
	);
}

// ─── Program detail viewer ───────────────────────────────────────────────────

function ProgramDetail({
	therapistId,
	programId,
	startDate,
}: { therapistId: string; programId: string; startDate: string }) {
	const [data, setData] = useState<Awaited<
		ReturnType<typeof getProgram>
	> | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const load = async () => {
		if (data) return;
		setLoading(true);
		try {
			const result = await getProgram({ data: { therapistId, programId } });
			setData(result);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erreur");
		} finally {
			setLoading(false);
		}
	};

	// Load on mount
	if (!data && !loading && !error) {
		load();
	}

	if (loading) return <p className="text-sm text-muted-foreground py-2">Chargement…</p>;
	if (error) return <p className="text-sm text-destructive py-2">{error}</p>;
	if (!data) return null;

	const today = new Date();
	const start = new Date(startDate);
	const diffMs = today.getTime() - start.getTime();
	const currentWeek = start <= today
		? Math.min(16, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1)
		: 0;

	return (
		<div className="space-y-3">
			{data.weeks.map((week) => {
				const isCurrent = week.weekNumber === currentWeek;
				const isPast = week.weekNumber < currentWeek;
				return (
					<div
						key={week.id}
						className={`border rounded-lg p-3 space-y-2 ${isCurrent ? "border-primary bg-primary/5" : isPast ? "opacity-60" : ""}`}
					>
						<div className="flex items-center justify-between">
							<span className="font-medium text-sm">
								Semaine {week.weekNumber}
								{isCurrent && (
									<Badge variant="default" className="ml-2 text-xs">
										En cours
									</Badge>
								)}
							</span>
							{week.completion && (
								<Badge variant="secondary" className="text-green-600 text-xs">
									Mission terminée ✓
								</Badge>
							)}
						</div>
						<div className="flex flex-wrap gap-1">
							{week.exercises.map((ex) => (
								<Badge key={ex.id} variant="outline" className="text-xs">
									{EXERCISE_LABELS[ex.exerciseKey as ExerciseKey]}
									{ex.difficultyOverride != null && ` (${ex.difficultyOverride}%)`}
								</Badge>
							))}
						</div>
						<div className="text-sm">
							<span className="font-medium">Mission :</span>{" "}
							<span className="text-muted-foreground">{week.missionTitle}</span>
							{week.missionDescription && (
								<p className="text-xs text-muted-foreground mt-1">{week.missionDescription}</p>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

// ─── Program creator ─────────────────────────────────────────────────────────

function ProgramCreator({
	therapistId,
	patientId,
	onDone,
	onCancel,
}: {
	therapistId: string;
	patientId: string;
	onDone: () => void;
	onCancel: () => void;
}) {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const minDate = tomorrow.toISOString().slice(0, 10);

	const [startDate, setStartDate] = useState(minDate);
	const [weeks, setWeeks] = useState<WeekFormData[]>(() =>
		Array.from({ length: 16 }, () => emptyWeek()),
	);
	const [expandedWeek, setExpandedWeek] = useState<number | null>(0);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateWeek = (index: number, updater: (w: WeekFormData) => WeekFormData) => {
		setWeeks((prev) => prev.map((w, i) => (i === index ? updater(w) : w)));
	};

	const toggleExercise = (weekIdx: number, key: ExerciseKey) => {
		updateWeek(weekIdx, (w) => {
			const next = new Set(w.exercises);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return { ...w, exercises: next };
		});
	};

	const copyFromPrevious = (weekIdx: number) => {
		if (weekIdx === 0) return;
		const prev = weeks[weekIdx - 1];
		setWeeks((ws) =>
			ws.map((w, i) =>
				i === weekIdx
					? {
							exercises: new Set(prev.exercises),
							overrides: { ...prev.overrides },
							missionTitle: prev.missionTitle,
							missionDescription: prev.missionDescription,
							missionCognitiveFunctions: [...prev.missionCognitiveFunctions],
						}
					: w,
			),
		);
	};

	const handleSubmit = async () => {
		setError(null);

		// Validate
		for (let i = 0; i < 16; i++) {
			if (weeks[i].exercises.size === 0) {
				setError(`Semaine ${i + 1} : au moins un exercice requis`);
				setExpandedWeek(i);
				return;
			}
			if (!weeks[i].missionTitle.trim()) {
				setError(`Semaine ${i + 1} : titre de mission requis`);
				setExpandedWeek(i);
				return;
			}
		}

		setSaving(true);
		try {
			const weekInputs: WeekInput[] = weeks.map((w) => ({
				exercises: [...w.exercises].map((key) => ({
					exerciseKey: key,
					difficultyOverride:
						w.overrides[key] !== undefined && w.overrides[key] !== ""
							? Number(w.overrides[key])
							: null,
				})),
				missionTitle: w.missionTitle,
				missionDescription: w.missionDescription,
				missionCognitiveFunctions: w.missionCognitiveFunctions,
			}));

			await createProgram({
				data: {
					therapistId,
					patientId,
					startDate,
					weeks: weekInputs,
				},
			});
			onDone();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erreur lors de la création");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg flex items-center justify-between">
					Nouveau programme (16 semaines)
					<Button variant="ghost" size="sm" onClick={onCancel}>
						Annuler
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Start date */}
				<div className="space-y-1 max-w-xs">
					<Label htmlFor="start-date">Date de début</Label>
					<Input
						id="start-date"
						type="date"
						min={minDate}
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
					/>
				</div>

				<Separator />

				{/* Weeks */}
				<div className="space-y-2">
					{weeks.map((week, idx) => {
						const isExpanded = expandedWeek === idx;
						const exerciseCount = week.exercises.size;
						const hasMission = !!week.missionTitle.trim();

						return (
							<div key={idx} className="border rounded-lg">
								<button
									type="button"
									className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
									onClick={() => setExpandedWeek(isExpanded ? null : idx)}
								>
									<div className="flex items-center gap-2">
										<span className="font-medium text-sm">Semaine {idx + 1}</span>
										{exerciseCount > 0 && (
											<Badge variant="secondary" className="text-xs">
												{exerciseCount} exercice{exerciseCount > 1 ? "s" : ""}
											</Badge>
										)}
										{hasMission && (
											<Badge variant="outline" className="text-xs">
												Mission ✓
											</Badge>
										)}
									</div>
									{isExpanded ? (
										<ChevronUp className="h-4 w-4" />
									) : (
										<ChevronDown className="h-4 w-4" />
									)}
								</button>

								{isExpanded && (
									<div className="px-3 pb-3 space-y-4">
										{idx > 0 && (
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="text-xs"
												onClick={() => copyFromPrevious(idx)}
											>
												<Copy className="h-3 w-3 mr-1" />
												Copier la semaine {idx}
											</Button>
										)}

										{/* Exercises */}
										<div className="space-y-2">
											<Label className="text-sm">Exercices</Label>
											<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
												{ALL_EXERCISE_KEYS.map((key) => {
													const checked = week.exercises.has(key);
													return (
														<div key={key} className="space-y-1">
															<label className="flex items-center gap-2 cursor-pointer text-sm select-none">
																<input
																	type="checkbox"
																	className="accent-primary h-4 w-4"
																	checked={checked}
																	onChange={() => toggleExercise(idx, key)}
																/>
																{EXERCISE_LABELS[key]}
															</label>
															{checked && (
																<Input
																	type="number"
																	min={0}
																	max={100}
																	className="h-7 text-xs ml-6 max-w-28"
																	placeholder="Auto"
																	value={week.overrides[key] ?? ""}
																	onChange={(e) =>
																		updateWeek(idx, (w) => ({
																			...w,
																			overrides: {
																				...w.overrides,
																				[key]: e.target.value,
																			},
																		}))
																	}
																/>
															)}
														</div>
													);
												})}
											</div>
										</div>

										<Separator />

										{/* Mission */}
										<div className="space-y-3">
											<Label className="text-sm">Mission de la semaine</Label>
											<div className="space-y-1">
												<Label className="text-xs text-muted-foreground">Titre</Label>
												<Input
													value={week.missionTitle}
													onChange={(e) =>
														updateWeek(idx, (w) => ({
															...w,
															missionTitle: e.target.value,
														}))
													}
													placeholder="Ex : Promenade quotidienne"
												/>
											</div>
											<div className="space-y-1">
												<Label className="text-xs text-muted-foreground">
													Description (optionnel)
												</Label>
												<Textarea
													value={week.missionDescription}
													onChange={(e) =>
														updateWeek(idx, (w) => ({
															...w,
															missionDescription: e.target.value,
														}))
													}
													placeholder="Décrivez la mission…"
													rows={2}
												/>
											</div>
											<div className="space-y-1">
												<Label className="text-xs text-muted-foreground">
													Fonctions cognitives ciblées
												</Label>
												<div className="grid grid-cols-2 gap-1">
													{ALL_EXERCISE_KEYS.map((key) => (
														<label
															key={key}
															className="flex items-center gap-1.5 cursor-pointer text-xs select-none"
														>
															<input
																type="checkbox"
																className="accent-primary h-3.5 w-3.5"
																checked={week.missionCognitiveFunctions.includes(key)}
																onChange={() =>
																	updateWeek(idx, (w) => ({
																		...w,
																		missionCognitiveFunctions:
																			w.missionCognitiveFunctions.includes(key)
																				? w.missionCognitiveFunctions.filter(
																						(k) => k !== key,
																					)
																				: [
																						...w.missionCognitiveFunctions,
																						key,
																					],
																	}))
																}
															/>
															{EXERCISE_LABELS[key]}
														</label>
													))}
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}

				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={onCancel}>
						Annuler
					</Button>
					<Button disabled={saving} onClick={handleSubmit}>
						{saving ? "Création…" : "Créer le programme"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
