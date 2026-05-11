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
import type { AttentionConfig } from "./exercice";
import { WordSearchExercice } from "./exercice";

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
	const rating = useStore(levelStore, (s) => s.exercises.attention.rating);
	const level = getLevelFromRating(rating);
	const config = getAttentionConfig(rating);
	const [isFullscreen, setIsFullscreen] = useState(true);

	const handleComplete = (scorePercent: number) =>
		updateRating("attention", scorePercent);

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
							<AttentionExercise config={config} onComplete={handleComplete} />
						</Card>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</>
	);
}

function AttentionExercise({
	config,
	onComplete,
}: {
	config: AttentionConfig;
	onComplete: (scorePercent: number) => void;
}) {
	const [hasStarted, setHasStarted] = useState(false);
	const { remainingSecond, cancel } = useCountdown(3, () =>
		setHasStarted(true),
	);

	return (
		<>
			{hasStarted ? (
				<WordSearchExercice config={config} onComplete={onComplete} />
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
