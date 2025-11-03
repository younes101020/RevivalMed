import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Memory } from "@/components/exercices/memory";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<section className="h-full container mx-auto p-4 flex items-center">
			<Tabs defaultValue="memory" className="space-y-4">
				<TabsList className="flex justify-center mx-auto">
					<TabsTrigger value="memory">Mémoire</TabsTrigger>
					<TabsTrigger value="attention">Attention</TabsTrigger>
					<TabsTrigger value="planning">Planification</TabsTrigger>
					<TabsTrigger value="mental_flexibility">Flexibilité mentale</TabsTrigger>
					<TabsTrigger value="working_memory">Mémoire de travail</TabsTrigger>
					<TabsTrigger value="language_work">Travail de language</TabsTrigger>
					<TabsTrigger value="visual_spatial_ability">Capacité visuo-spatiale</TabsTrigger>
					<TabsTrigger value="information_processing_speed_work">Travail de vitesse de traitement de l'information</TabsTrigger>
				</TabsList>
				<Card>
					<CardHeader>
						<CardTitle>Exercice</CardTitle>
					</CardHeader>
					<TabsContent value="memory">
						<Memory />
					</TabsContent>
					<TabsContent value="attention">Change your attention here.</TabsContent>
					<TabsContent value="planning">Plan your tasks here.</TabsContent>
					<TabsContent value="mental_flexibility">Work on your mental flexibility here.</TabsContent>
					<TabsContent value="working_memory">Work on your working memory here.</TabsContent>
					<TabsContent value="language_work">Improve your language skills here.</TabsContent>
					<TabsContent value="visual_spatial_ability">Enhance your visual-spatial ability here.</TabsContent>
					<TabsContent value="information_processing_speed_work">Boost your information processing speed here.</TabsContent>
				</Card>
			</Tabs>
		</section>
	);
}
