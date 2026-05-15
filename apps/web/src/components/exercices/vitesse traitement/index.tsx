import { useStore } from "@tanstack/react-store";
import { Expand, Shrink } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { levelStore, updateRating } from "@/store/level";
import type { VitesseConfig } from "./exercice";
import { VitesseTraitementExercise } from "./exercice";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { Countdown } from "@/components/layout/countdown";

function getVitesseConfig(rating: number): VitesseConfig {
	switch (true) {
		case rating < 25:
			return {
				pairCount: 15,
				letters: ["A", "T"],
				hint: "15 paires avec 2 lettres.",
			};
		case rating < 50:
			return {
				pairCount: 20,
				letters: ["A", "T"],
				hint: "20 paires avec 2 lettres.",
			};
		case rating < 75:
			return {
				pairCount: 30,
				letters: ["A", "T", "L"],
				hint: "30 paires avec 3 lettres.",
			};
		default:
			return {
				pairCount: 45,
				letters: ["A", "T", "L", "C"],
				hint: "45 paires avec 4 lettres.",
			};
	}
}

function getLevelFromRating(rating: number): number {
	if (rating < 25) return 1;
	if (rating < 50) return 2;
	if (rating < 75) return 3;
	return 4;
}

export function VitesseTraitement() {
	const { isFullscreen, toggle, fullscreenClasses } = useFullscreen(true);
	const rating = useStore(
		levelStore,
		(s) => s.exercises.processingSpeed.rating,
	);
	const level = getLevelFromRating(rating);
	const config = getVitesseConfig(rating);

	return (
		<>
			<CardContent className="space-y-3">
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Niveau actuel :</span>
					<Badge variant="outline">{level} / 4</Badge>
				</div>
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
				<p className="text-xs text-muted-foreground italic">{config.hint}</p>
			</CardContent>
			<CardFooter className="mt-4">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">Commencer l'exercice</Button>
					</DialogTrigger>
					<DialogContent
						className={cn(
							"rounded-xl max-h-[80vh] overflow-scroll",
							fullscreenClasses,
						)}
					>
						<Card className="border-none rounded-lg mt-7 px-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={toggle}
								className="absolute top-1.5 left-1 opacity-70 transition-opacity hover:opacity-100"
							>
								{isFullscreen ? <Shrink /> : <Expand />}
							</Button>
							<Countdown>
								<VitesseTraitementExercise onComplete={(score) => updateRating("processingSpeed", score)} />
							</Countdown>
						</Card>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</>
	);
}
