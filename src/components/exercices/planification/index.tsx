import { Expand, Shrink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { useCountdown } from "@/hooks/countdown";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import { WeeklySchedule } from "./exercice";

export function Planification() {
	const [isFullscreen, setIsFullscreen] = useState(false);

	return (
		<>
			<CardContent className="space-y-3">
				<p>
					Vous devez organiser les différents rendez-vous et activités pour la
					semaine. Vous disposez d’un agenda présent en annexe. Pour vous aider,
					pensez à utiliser la procédure de résolution de problème pour réaliser
					cet exercice. Vous pouvez également utiliser la feuille de suivi pour
					voir votre progression !
				</p>
				<p>Vous êtes prêts ? ... C’est parti !</p>
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
							<PlanificationExercise />
						</Card>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</>
	);
}

function PlanificationExercise() {
	const [hasStarted, setHasStarted] = useState(false);
	const [hasFinished, setHasFinished] = useState(false);
	const { remainingSecond, cancel } = useCountdown(3, () =>
		setHasStarted(true),
	);

	if (hasFinished) return <WeeklySchedule />;

	return (
		<>
			{hasStarted ? (
				<div className="p-4 space-y-8 font-semibold text-lg">
					<p>
						Vous habitez à Villeurbanne et avez 30 minutes de trajet pour vous
						rendre sur votre lieu de travail. Vous travaillez les lundis, mardis
						et jeudis de 8h à 16h et les mercredis et vendredis de 8h à 12h, à
						Lyon Part-Dieu.
					</p>
					<ul>
						<li>
							Vous avez rendez-vous chez le kiné mardi à 15h30 (proche de
							Part-Dieu)
						</li>
						<li>Vous devez porter un colis à la poste</li>
						<li>Vous devez aller faire des courses</li>
						<li>
							Vous devez appeler la sécurité sociale (horaires d’ouverture de 9h
							à 15h)
						</li>
						<li>
							Vous avez un rendez-vous à l’ophtalmologiste le vendredi à 14h
						</li>
						<li>
							Vous devrez faire une séance de sport (salle à côté de chez vous)
						</li>
						<li>
							Vous devez décaler votre rendez-vous chez le podologue de lundi à
							un autre jour de la semaine.
						</li>
					</ul>
					<p>
						Votre chef vous informe que vous avez 3 heures de congés à prendre
						avant la fin de la semaine.
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
				<Button onClick={() => setHasFinished(true)}>
					J'ai compris, commençons
				</Button>
			)}
			<DialogClose asChild>
				<Button type="button" variant="outline" onClick={cancel}>
					Annuler
				</Button>
			</DialogClose>
		</>
	);
}
