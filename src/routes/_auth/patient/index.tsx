import { createFileRoute, redirect } from "@tanstack/react-router";
import { Attention } from "@/components/exercices/attention";
import { Flexibilite } from "@/components/exercices/flexibilite";
import { InformationProcessing } from "@/components/exercices/information processing";
import { Langage } from "@/components/exercices/langage";
import { Memory } from "@/components/exercices/memory/index";
import { MemoryWork } from "@/components/exercices/memory work";
import { Planification } from "@/components/exercices/planification";
import { VisiuoSpatial } from "@/components/exercices/visuo-spatial";
import { VitesseTraitement } from "@/components/exercices/vitesse traitement";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProgress } from "@/lib/progress";
import { initLevelStore } from "@/store/level";

export const Route = createFileRoute("/_auth/patient/")({
	beforeLoad: ({ context }) => {
		if (context.user?.role !== "patient") {
			throw redirect({ to: "/therapist" });
		}
	},
	loader: async ({ context }) => {
		const rows = await getProgress({ data: context.user!.id });
		initLevelStore(context.user!.id, rows);
		return rows;
	},
	ssr: false,
	component: PatientDashboard,
});

function PatientDashboard() {
	return (
		<section className="h-full container mx-auto p-4 flex items-center">
			<Tabs defaultValue="memory" className="space-y-4 container">
				<ScrollArea className="w-full whitespace-nowrap rounded-md">
					<TabsList className="flex justify-center mx-auto">
						<TabsTrigger value="memory">Mémoire</TabsTrigger>
						<TabsTrigger value="attention">Attention</TabsTrigger>
						<TabsTrigger value="planning">Planification</TabsTrigger>
						<TabsTrigger value="mental_flexibility">
							Flexibilité mentale
						</TabsTrigger>
						<TabsTrigger value="working_memory">Mémoire de travail</TabsTrigger>
						<TabsTrigger value="language_work">Travail de language</TabsTrigger>
						<TabsTrigger value="visual_spatial_ability">
							Capacité visuo-spatiale
						</TabsTrigger>
						<TabsTrigger value="information_processing_speed_work">
							Travail de vitesse de traitement de l'information
						</TabsTrigger>
						<TabsTrigger value="processing_speed">
							Vitesse de traitement
						</TabsTrigger>
					</TabsList>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
				<Card>
					<CardHeader>
						<CardTitle className="scroll-m-20 text-4xl font-bold tracking-tight text-balance">
							Exercice:
						</CardTitle>
					</CardHeader>
					<TabsContent value="memory">
						<Memory />
					</TabsContent>
					<TabsContent value="attention">
						<Attention />
					</TabsContent>
					<TabsContent value="planning">
						<Planification />
					</TabsContent>
					<TabsContent value="mental_flexibility">
						<Flexibilite />
					</TabsContent>
					<TabsContent value="working_memory">
						<MemoryWork />
					</TabsContent>
					<TabsContent value="language_work">
						<Langage />
					</TabsContent>
					<TabsContent value="visual_spatial_ability">
						<VisiuoSpatial />
					</TabsContent>
					<TabsContent value="information_processing_speed_work">
						<InformationProcessing />
					</TabsContent>
					<TabsContent value="processing_speed">
						<VitesseTraitement />
					</TabsContent>
				</Card>
			</Tabs>
		</section>
	);
}
