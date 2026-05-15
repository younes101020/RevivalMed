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
import { updateRating } from "@/store/level";
import { PetitBacExercice } from "./exercice";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { Countdown } from "@/components/layout/countdown";

export function Langage() {
	const { isFullscreen, toggle, fullscreenClasses } = useFullscreen(true);
	return (
		<>
			<CardContent className="space-y-3">
				<p>
					Complétez les grilles en trouvant un aliment de chaque catégorie
					commençant par la lettre indiquée.
				</p>
				<p>
					Pour vous aider, pensez à utiliser la procédure de résolution de
					problème pour réaliser cet exercice. Vous pouvez également utiliser la
					feuille de suivi pour voir votre progression !
				</p>
				<p>Vous êtes prêts ? ... c'est parti !</p>
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
								<PetitBacExercice onComplete={(s) => updateRating("language", s)} />
							</Countdown>
						</Card>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</>
	);
}
