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
import { EventsDescription } from "./components/events-description";

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
						<Card className="border-none rounded-lg mt-7 px-2">
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
			{hasStarted ? <EventsDescription /> : (
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
