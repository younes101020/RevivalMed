import { useStore } from "@tanstack/react-store";
import { Expand, Shrink } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { levelStore, updateRating } from "@/store/level";
import type { AttentionConfig } from "./exercice";
import { WordSearchExercice } from "./exercice";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { Countdown } from "@/components/layout/countdown";
import { ConfettiComponent } from "@/components/layout/confetti";

function getAttentionConfig(rating: number): AttentionConfig {
	switch (true) {
		case rating < 25:
			return {
				wordCount: 5,
				gridSize: 10,
				directions: ["horizontal", "vertical"],
				hint: "5 mots sur une grille 10×10, horizontaux et verticaux.",
			};
		case rating < 50:
			return {
				wordCount: 8,
				gridSize: 12,
				directions: ["horizontal", "vertical", "diagonal"],
				hint: "8 mots sur une grille 12×12, avec diagonales.",
			};
		case rating < 75:
			return {
				wordCount: 13,
				gridSize: 14,
				directions: ["horizontal", "vertical", "diagonal", "diagonal-reverse"],
				hint: "13 mots sur une grille 14×14, toutes directions.",
			};
		default:
			return {
				wordCount: 18,
				gridSize: 17,
				directions: ["horizontal", "vertical", "diagonal", "diagonal-reverse"],
				hint: "18 mots sur une grille 17×17, toutes directions.",
			};
	}
}

function getLevelFromRating(rating: number): number {
	if (rating < 25) return 1;
	if (rating < 50) return 2;
	if (rating < 75) return 3;
	return 4;
}

export function Attention() {
	const [showConfetti, setShowConfetti] = useState(false);
	const rating = useStore(levelStore, (s) => s.exercises.attention.rating);
	const level = getLevelFromRating(rating);
	const config = getAttentionConfig(rating);
	const { isFullscreen, toggle, fullscreenClasses } = useFullscreen(true);

	const handleComplete = (scorePercent: number) => {
		const { isNewHighscore } = updateRating("attention", scorePercent);
		if (isNewHighscore) {
			setShowConfetti(true);
			setTimeout(() => setShowConfetti(false), 5000);
		}
	}
	return (
		<>
			<CardContent className="space-y-3">
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Niveau actuel :</span>
					<Badge variant="outline">{level} / 4</Badge>
				</div>
				<p>
					Des mots mêlés ca vous dis ? Retrouvez {config.wordCount} îles du
					monde cachées dans la grille.
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
								<WordSearchExercice config={{ ...config, showConfetti }} onComplete={handleComplete} />
							</Countdown>
						</Card>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</>
	);
}
