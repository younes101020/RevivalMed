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
import { completeMission, getMissionsForPatient } from "@/lib/missions";
import { getAssignmentsForPatient, getProgress } from "@/lib/progress";
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
		const [rows, assignments, missionsData] = await Promise.all([
			getProgress({ data: context.user!.id }),
			getAssignmentsForPatient({ data: context.user!.id }),
			getMissionsForPatient({ data: context.user!.id }),
		]);
		initLevelStore(context.user!.id, rows);
		return { rows, assignments, missionsData };
	},
	ssr: false,
	component: PatientDashboard,
});

function PatientDashboard() {
	const { assignments, missionsData } = Route.useLoaderData();
	const { user } = Route.useRouteContext();
	const assignedKeys = new Set(assignments.map((a) => a.exerciseKey as ExerciseKey));
	const visibleTabs = EXERCISE_TAB_CONFIG.filter((t) => assignedKeys.has(t.key));

	// Optimistic completion state
	const [completedIds, setCompletedIds] = useState<Set<string>>(
		() => new Set(missionsData.missions.filter((m) => m.completedAt).map((m) => m.id)),
	);
	const [completing, setCompleting] = useState<string | null>(null);

	const handleComplete = async (missionId: string) => {
		setCompleting(missionId);
		try {
			await completeMission({ data: { missionId, patientId: user!.id } });
			setCompletedIds((prev) => new Set([...prev, missionId]));
		} finally {
			setCompleting(null);
		}
	};

	if (visibleTabs.length === 0) {
		return (
			<section className="h-full container mx-auto p-4 flex items-center justify-center">
				<p className="text-muted-foreground text-center">
					Votre thérapeute n'a pas encore assigné d'exercices.
				</p>
			</section>
		);
	}

	return (
		<section className="h-full container mx-auto p-4 flex items-center">
			<Tabs defaultValue={visibleTabs[0].key} className="space-y-4 container">
				<ScrollArea className="w-full whitespace-nowrap rounded-md">
					<TabsList className="flex justify-center mx-auto">
						{visibleTabs.map((t) => (
							<TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
						))}
						<TabsTrigger value="missions">Missions</TabsTrigger>
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
				<TabsContent value="missions">
					{!missionsData.unlocked ? (
						<Card>
							<CardContent className="py-8 flex flex-col items-center gap-2 text-center">
								<span className="text-2xl">🔒</span>
								<p className="font-semibold">Missions verrouillées</p>
								<p className="text-sm text-muted-foreground max-w-sm">
									Terminez tous vos exercices au niveau maximum (4/4) pour débloquer vos missions.
								</p>
							</CardContent>
						</Card>
					) : missionsData.missions.length === 0 ? (
						<Card>
							<CardContent className="py-8 text-center text-sm text-muted-foreground">
								Aucune mission assignée pour l'instant.
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-3 sm:grid-cols-2">
							{missionsData.missions.map((m) => {
								const done = completedIds.has(m.id);
								return (
									<Card key={m.id}>
										<CardHeader className="pb-2">
											<CardTitle className="text-base flex items-start justify-between gap-2">
												<span>{m.title}</span>
												{done && (
													<Badge variant="secondary" className="text-green-600 shrink-0">
														Terminée ✓
													</Badge>
												)}
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
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
											{!done && (
												<Button
													size="sm"
													disabled={completing === m.id}
													onClick={() => handleComplete(m.id)}
												>
													{completing === m.id ? "En cours…" : "Marquer comme terminée"}
												</Button>
											)}
										</CardContent>
									</Card>
								);
							})}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</section>
	);
}
