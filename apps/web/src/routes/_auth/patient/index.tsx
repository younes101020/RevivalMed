import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { Attention } from "@/components/exercices/attention";
import { Flexibilite } from "@/components/exercices/flexibilite";
import { InformationProcessing } from "@/components/exercices/information processing";
import { Langage } from "@/components/exercices/langage";
import { Memory } from "@/components/exercices/memory/index";
import { MemoryWork } from "@/components/exercices/memory work";
import { Planification } from "@/components/exercices/planification";
import { VisiuoSpatial } from "@/components/exercices/visuo-spatial";
import { VitesseTraitement } from "@/components/exercices/vitesse traitement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActiveWeekForPatient, completeWeekMission } from "@/lib/programs";
import { getProgress } from "@/lib/progress";
import type { ExerciseKey } from "@/store/level";
import { initLevelStore } from "@/store/level";

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

const EXERCISE_TAB_CONFIG: { key: ExerciseKey; label: string; component: ReactNode }[] = [
	{ key: "memory", label: "Mémoire", component: <Memory /> },
	{ key: "attention", label: "Attention", component: <Attention /> },
	{ key: "planning", label: "Planification", component: <Planification /> },
	{ key: "mentalFlexibility", label: "Flexibilité mentale", component: <Flexibilite /> },
	{ key: "workingMemory", label: "Mémoire de travail", component: <MemoryWork /> },
	{ key: "language", label: "Langage", component: <Langage /> },
	{ key: "visuoSpatial", label: "Visuo-spatial", component: <VisiuoSpatial /> },
	{ key: "informationProcessing", label: "Traitement de l'information", component: <InformationProcessing /> },
	{ key: "processingSpeed", label: "Vitesse de traitement", component: <VitesseTraitement /> },
];

export const Route = createFileRoute("/_auth/patient/")({
	beforeLoad: ({ context }) => {
		if (context.user?.role !== "patient") {
			throw redirect({ to: "/therapist" });
		}
	},
	loader: async ({ context }) => {
		const [rows, weekData] = await Promise.all([
			getProgress({ data: context.user!.id }),
			getActiveWeekForPatient({ data: context.user!.id }),
		]);
		initLevelStore(context.user!.id, rows);
		return { rows, weekData };
	},
	ssr: false,
	component: PatientDashboard,
});

function PatientDashboard() {
	const { weekData } = Route.useLoaderData();
	const { user } = Route.useRouteContext();

	// No active program
	if (!weekData.active) {
		return (
			<section className="h-full container mx-auto p-4 flex items-center justify-center">
				<div className="text-center space-y-2">
					<p className="text-muted-foreground">
						Votre thérapeute n'a pas encore créé de programme, ou aucun programme n'est actif cette semaine.
					</p>
				</div>
			</section>
		);
	}

	const assignedKeys = new Set(
		weekData.exercises.map((e) => e.exerciseKey as ExerciseKey),
	);
	const visibleTabs = EXERCISE_TAB_CONFIG.filter((t) => assignedKeys.has(t.key));

	// Optimistic completion state
	const [completed, setCompleted] = useState(weekData.missionCompleted);
	const [completing, setCompleting] = useState(false);

	const handleComplete = async () => {
		setCompleting(true);
		try {
			await completeWeekMission({
				data: { programWeekId: weekData.week.id, patientId: user!.id },
			});
			setCompleted(true);
		} finally {
			setCompleting(false);
		}
	};

	if (visibleTabs.length === 0) {
		return (
			<section className="h-full container mx-auto p-4 flex items-center justify-center">
				<p className="text-muted-foreground text-center">
					Aucun exercice assigné pour cette semaine.
				</p>
			</section>
		);
	}

	return (
		<section className="h-full container mx-auto p-4 flex items-center">
			<Tabs defaultValue={visibleTabs[0].key} className="space-y-4 container">
				<div className="text-center">
					<Badge variant="outline" className="text-sm px-3 py-1">
						Semaine {weekData.weekNumber} / {weekData.totalWeeks}
					</Badge>
				</div>
				<ScrollArea className="w-full whitespace-nowrap rounded-md">
					<TabsList className="flex justify-center mx-auto">
						{visibleTabs.map((t) => (
							<TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
						))}
						<TabsTrigger value="mission">Mission</TabsTrigger>
					</TabsList>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
				<Card>
					<CardHeader>
						<CardTitle className="scroll-m-20 text-4xl font-bold tracking-tight text-balance">
							Exercice:
						</CardTitle>
					</CardHeader>
					{visibleTabs.map((t) => (
						<TabsContent key={t.key} value={t.key}>
							{t.component}
						</TabsContent>
					))}
				</Card>
				<TabsContent value="mission">
					{!weekData.missionUnlocked ? (
						<Card>
							<CardContent className="py-8 flex flex-col items-center gap-2 text-center">
								<span className="text-2xl">🔒</span>
								<p className="font-semibold">Mission verrouillée</p>
								<p className="text-sm text-muted-foreground max-w-sm">
									Terminez tous les exercices de cette semaine au niveau maximum (4/4) pour débloquer la mission.
								</p>
							</CardContent>
						</Card>
					) : (
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-base flex items-start justify-between gap-2">
									<span>{weekData.week.missionTitle}</span>
									{completed && (
										<Badge variant="secondary" className="text-green-600 shrink-0">
											Terminée ✓
										</Badge>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{weekData.week.missionDescription && (
									<p className="text-sm text-muted-foreground">
										{weekData.week.missionDescription}
									</p>
								)}
								{weekData.week.missionCognitiveFunctions.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{(weekData.week.missionCognitiveFunctions as ExerciseKey[]).map(
											(fn) => (
												<Badge key={fn} variant="outline" className="text-xs">
													{EXERCISE_LABELS[fn]}
												</Badge>
											),
										)}
									</div>
								)}
								{!completed && (
									<Button
										size="sm"
										disabled={completing}
										onClick={handleComplete}
									>
										{completing ? "En cours…" : "Marquer comme terminée"}
									</Button>
								)}
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</section>
	);
}
