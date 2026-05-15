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
import type { InfoProcessingConfig } from "./exercice";
import { SortingExercice } from "./exercice";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { Countdown } from "@/components/layout/countdown";

function getInfoProcessingConfig(rating: number): InfoProcessingConfig {
	switch (true) {
		case rating < 25:
			return {
				sortedItems: ["Janvier", "Avril", "Juillet", "Octobre"],
				instruction:
					"Glissez-déposez pour classer ces 4 mois dans l'ordre chronologique.",
				hint: "4 mois à trier dans l'ordre chronologique.",
			};
		case rating < 50:
			return {
				sortedItems: [
					"Janvier",
					"Mars",
					"Avril",
					"Mai",
					"Juillet",
					"Septembre",
					"Décembre",
				],
				instruction:
					"Glissez-déposez pour classer ces 7 mois dans l'ordre chronologique.",
				hint: "7 mois à trier dans l'ordre chronologique.",
			};
		case rating < 75:
			return {
				sortedItems: [
					"Janvier",
					"Février",
					"Mars",
					"Avril",
					"Mai",
					"Juin",
					"Juillet",
					"Août",
					"Septembre",
					"Octobre",
				],
				instruction:
					"Glissez-déposez pour classer ces 10 mois dans l'ordre chronologique.",
				hint: "10 mois à trier dans l'ordre chronologique.",
			};
		default:
			return {
				sortedItems: [
					"Janvier",
					"Février",
					"Mars",
					"Avril",
					"Mai",
					"Juin",
					"Juillet",
					"Août",
					"Septembre",
					"Octobre",
					"Novembre",
					"Décembre",
				],
				instruction:
					"Glissez-déposez pour classer les 12 mois de l'année dans l'ordre chronologique.",
				hint: "Les 12 mois à trier dans l'ordre chronologique.",
			};
	}
}

function getLevelFromRating(rating: number): number {
	if (rating < 25) return 1;
	if (rating < 50) return 2;
	if (rating < 75) return 3;
	return 4;
}

export function InformationProcessing() {
	const rating = useStore(
		levelStore,
		(s) => s.exercises.informationProcessing.rating,
	);
	const level = getLevelFromRating(rating);
	const config = getInfoProcessingConfig(rating);
	const { isFullscreen, toggle, fullscreenClasses } = useFullscreen(true);

	const handleComplete = (scorePercent: number) =>
		updateRating("informationProcessing", scorePercent);

	return (
		<>
			<CardContent className="space-y-3">
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Niveau actuel :</span>
					<Badge variant="outline">{level} / 4</Badge>
				</div>
				<p>
					Vous devez ranger ces informations en les classant dans l'ordre
					chronologique (du plus ancien au plus récent) ou alphabétique, selon
					la consigne.
				</p>
				<p className="text-sm text-muted-foreground">{config.hint}</p>
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
								<SortingExercice config={config} onComplete={handleComplete} />
							</Countdown>
						</Card>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</>
	);
}
