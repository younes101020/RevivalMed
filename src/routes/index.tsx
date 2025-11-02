import { createFileRoute } from "@tanstack/react-router";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<section className="h-full container mx-auto p-4 flex items-center">
			<div>
				<h1>Exercice</h1>
				<p>
					Lisez l’histoire suivante à voix haute ou dans votre tête, selon votre
					préférence. Ne lisez cette histoire qu’une seule fois, puis cacher le
					texte pour lire les questions. Soyez attentif ! Pour vous aider,
					pensez à utiliser la procédure de résolution de problème pour réaliser
					cet exercice. Vous pouvez également utiliser la feuille de suivi pour
					voir votre progression ! Vous êtes prêts ? ... C’est parti !
				</p>
				<Dialog>
					<DialogTrigger>Commencer l'exercice</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle></DialogTitle>
							<DialogDescription></DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
		</section>
	);
}
