import { Expand, Shrink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCountdown } from "@/hooks/countdown";
import { cn } from "@/lib/utils";
import { VitesseTraitementExercise } from "./exercice";

export function VitesseTraitement() {
	const [isFullscreen, setIsFullscreen] = useState(false);

	return (
		<>
			<CardContent className="space-y-3">
				<p>
					Voici une série de paires de lettres, répartie sur 2 colonnes. Pour
					chaque paire, vous devez comparer les 2 lettres et cocher dans l'une
					des 2 cases en face si elles sont identiques ou différentes.
				</p>
				<p>
					Essayez de faire cet exercice le plus rapidement possible et en
					essayant de faire le moins d'erreurs possible. Pour vous aider, pensez
					à utiliser la procédure de résolution de problème pour réaliser cet
					exercice. Vous pouvez également utiliser la feuille de suivi pour voir
					votre progression !
				</p>
				<p>
					Vous devez lancer le chronomètre au moment où vous commencez
					l'exercice et l'arrêter dès que vous avez terminé. Indiquez ensuite le
					temps que vous avez mis en bas de la feuille.
				</p>
				<p>Vous êtes prêts ? ... C'est parti !</p>
			</CardContent>
			<CardFooter className="mt-4">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">Commencer l'exercice</Button>
					</DialogTrigger>
					<DialogContent
						className={cn(
							"rounded-xl max-h-[80vh] overflow-scroll",
							isFullscreen && "min-w-[90vw] max-h-screen",
						)}
					>
						<Card className="border-none rounded-lg mt-7 px-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsFullscreen(!isFullscreen)}
								className="absolute top-1.5 left-1 opacity-70 transition-opacity hover:opacity-100"
							>
								{isFullscreen ? <Shrink /> : <Expand />}
							</Button>
							<VitesseTraitementCountdown />
						</Card>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</>
	);
}

function VitesseTraitementCountdown() {
	const [hasStarted, setHasStarted] = useState(false);
	const { remainingSecond, cancel } = useCountdown(3, () =>
		setHasStarted(true),
	);

	return (
		<>
			{hasStarted ? (
				<VitesseTraitementExercise />
			) : (
				<p className="py-12 text-center">
					L'exercice va commencer dans
					<span className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance pl-2 underline underline-offset-8">
						{remainingSecond}
					</span>
				</p>
			)}
			{hasStarted && <Separator className="my-2" />}
			<DialogClose asChild>
				<Button type="button" variant="outline" onClick={cancel}>
					Annuler
				</Button>
			</DialogClose>
		</>
	);
}
