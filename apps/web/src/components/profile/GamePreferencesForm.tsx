import { useId } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	COUNTDOWN_OPTIONS,
	type GamePreferences,
} from "@/lib/game-preferences";

interface GamePreferencesFormProps {
	preferences: GamePreferences;
	onChange: (preferences: GamePreferences) => void;
}

export function GamePreferencesForm({
	preferences,
	onChange,
}: GamePreferencesFormProps) {
	const soundId = useId();
	const timerId = useId();

	const update = (changes: Partial<GamePreferences>) => {
		onChange({ ...preferences, ...changes });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Préférences de jeu</CardTitle>
				<CardDescription>
					Personnalisez le démarrage et l’affichage de vos exercices.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex items-center justify-between gap-4">
					<div className="space-y-1">
						<Label htmlFor={soundId}>Son du compte à rebours</Label>
						<p className="text-sm text-muted-foreground">
							Jouer un bip à chaque seconde et au démarrage.
						</p>
					</div>
					<input
						id={soundId}
						type="checkbox"
						checked={preferences.soundEnabled}
						onChange={(event) =>
							update({ soundEnabled: event.target.checked })
						}
						className="h-4 w-4 accent-primary"
					/>
				</div>

				<div className="flex items-center justify-between gap-4">
					<div className="space-y-1">
						<Label htmlFor="countdown-duration">Durée avant le début</Label>
						<p className="text-sm text-muted-foreground">
							Choisissez le temps de préparation avant un exercice.
						</p>
					</div>
					<Select
						value={String(preferences.countdownSeconds)}
						onValueChange={(value) =>
							update({
								countdownSeconds: Number(value) as GamePreferences["countdownSeconds"],
							})
						}
					>
						<SelectTrigger id="countdown-duration" className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{COUNTDOWN_OPTIONS.map((seconds) => (
								<SelectItem key={seconds} value={String(seconds)}>
									{seconds === 0 ? "Désactivé" : `${seconds} secondes`}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center justify-between gap-4">
					<div className="space-y-1">
						<Label htmlFor={timerId}>Chronomètre de l’exercice</Label>
						<p className="text-sm text-muted-foreground">
							Afficher le temps écoulé pendant l’exercice.
						</p>
					</div>
					<input
						id={timerId}
						type="checkbox"
						checked={preferences.exerciseTimerEnabled}
						onChange={(event) =>
							update({ exerciseTimerEnabled: event.target.checked })
						}
						className="h-4 w-4 accent-primary"
					/>
				</div>
			</CardContent>
		</Card>
	);
}
