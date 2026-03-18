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
import { SortingExercice } from "./exercice";

export function InformationProcessing() {
	const [isFullscreen, setIsFullscreen] = useState(false);

	return (
		<>
			<CardContent className="space-y-3">
				<p>
					Vous devez ranger ces informations en les classant dans l'ordre
					chronologique (du plus ancien au plus récent) ou alphabétique, selon
					la consigne.
				</p>
				<p>
					Pour vous aider, pensez à utiliser la procédure de résolution de
					problème pour réaliser cet exercice. Vous pouvez également utiliser la
					feuille de suivi pour voir votre progression !
				</p>
				<p className="font-medium">
					Classez ces mois dans l'ordre chronologique d'une même année.
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
							<InformationProcessingExercise />
						</Card>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</>
	);
}

function InformationProcessingExercise() {
	const [hasStarted, setHasStarted] = useState(false);
	const { remainingSecond, cancel } = useCountdown(3, () =>
		setHasStarted(true),
	);

	return (
		<>
			{hasStarted ? (
				<SortingExercice />
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
