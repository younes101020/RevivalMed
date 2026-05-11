import { useStore } from "@tanstack/react-store";
import { Expand, Shrink } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/countdown";
import { cn } from "@/lib/utils";
import { levelStore, updateRating } from "@/store/level";
import { Card, CardContent, CardFooter } from "../../ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import { MemoryExerciseForm } from "./form/memory";

type MemoryConfig = {
	readingTimeSec: number | null;
	questionCount: 3 | 4 | 5 | 6;
	hint: string;
};

function getMemoryConfig(rating: number): MemoryConfig {
	switch (true) {
		case rating < 25:
			return {
				readingTimeSec: null,
				questionCount: 3,
				hint: "Prenez votre temps pour lire l'histoire.",
			};
		case rating < 50:
			return {
				readingTimeSec: 120,
				questionCount: 4,
				hint: "Vous avez 2 minutes pour lire l'histoire.",
			};
		case rating < 75:
			return {
				readingTimeSec: 90,
				questionCount: 5,
				hint: "Vous avez 1 minute 30 secondes pour lire l'histoire.",
			};
		default:
			return {
				readingTimeSec: 45,
				questionCount: 6,
				hint: "Vous avez 45 secondes pour lire l'histoire.",
			};
	}
}

function ReadingCountdown({
	sec,
	onDone,
}: {
	sec: number;
	onDone: () => void;
}) {
	const { remainingSecond } = useCountdown(sec, onDone);
	return (
		<p className="text-right text-sm text-muted-foreground">
			Temps restant :{" "}
			<span className="font-bold text-base">{remainingSecond}s</span>
		</p>
	);
}

function getLevelFromRating(rating: number): number {
	if (rating < 25) return 1;
	if (rating < 50) return 2;
	if (rating < 75) return 3;
	return 4;
}

export function Memory() {
	const [isFullscreen, setIsFullscreen] = useState(true);
	const rating = useStore(levelStore, (s) => s.exercises.memory.rating);
	const level = getLevelFromRating(rating);
	const config = getMemoryConfig(rating);
	const handleComplete = useCallback(
		(scorePercent: number) => updateRating("memory", scorePercent),
		[],
	);

	return (
		<>
			<CardContent className="space-y-3">
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Niveau actuel :</span>
					<Badge variant="outline">{level} / 4</Badge>
				</div>
				<p>
					Lisez l'histoire suivante à voix haute ou dans votre tête, selon votre
					préférence. Ne lisez cette histoire qu'une seule fois, puis cacher le
					texte pour lire les questions. Soyez attentif ! Pour vous aider,
					pensez à utiliser la procédure de résolution de problème pour réaliser
					cet exercice. Vous pouvez également utiliser la feuille de suivi pour
					voir votre progression !
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
							isFullscreen && "min-w-[90vw] max-h-screen",
						)}
					>
						<Card className="border-none rounded-lg mt-7">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsFullscreen(!isFullscreen)}
								className="absolute top-1.5 left-1 opacity-70 transition-opacity hover:opacity-100"
							>
								{isFullscreen ? <Shrink /> : <Expand />}
							</Button>
							<MemoryExercise config={config} onComplete={handleComplete} />
						</Card>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</>
	);
}

function MemoryExercise({
	config,
	onComplete,
}: {
	config: MemoryConfig;
	onComplete: (scorePercent: number) => void;
}) {
	const [hasStarted, setHasStarted] = useState(false);
	const [hasFinished, setHasFinished] = useState(false);
	const { remainingSecond, cancel } = useCountdown(3, () =>
		setHasStarted(true),
	);

	if (hasFinished)
		return (
			<MemoryExerciseForm
				questionCount={config.questionCount}
				onScoreComputed={onComplete}
			/>
		);

	return (
		<>
			{hasStarted ? (
				<div className="p-4 space-y-8 font-semibold text-lg">
					{config.readingTimeSec !== null && (
						<ReadingCountdown
							sec={config.readingTimeSec}
							onDone={() => setHasFinished(true)}
						/>
					)}
					<p>
						Pendant son voyage de deux semaines en Australie, Clara a décidé
						d'aller faire une ballade sur la plage.
					</p>
					<p>
						C'est l'été et il fait très chaud, mais Clara porte un grand chapeau
						de paille.
					</p>
					<p>
						Elle décide d'aller marcher au bord de l'eau, tout en admirant
						l'océan d'un bleu éclatant.
					</p>
					<p>
						{" "}
						L'eau est tellement claire que, si elle regarde de plus près, elle
						pourrait même réussir à percevoir quelques poissons zébrés nager
						tranquillement sous la surface de l'eau.
					</p>
				</div>
			) : (
				<p className="py-12 text-center">
					L'exercice va commencer dans
					<span className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance pl-2 underline underline-offset-8">
						{remainingSecond}
					</span>
				</p>
			)}
			{hasStarted && <Separator className="my-2" />}
			{hasStarted && (
				<Button onClick={() => setHasFinished(true)}>J'ai tout lu</Button>
			)}
			<DialogClose asChild>
				<Button type="button" variant="outline" onClick={cancel}>
					Annuler
				</Button>
			</DialogClose>
		</>
	);
}
