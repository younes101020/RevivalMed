import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const LETTERS = ["P", "C", "M", "B"];
const CATEGORIES = [
	"Fruit",
	"Légume",
	"Fromage",
	"Poisson",
	"Aromate ou Épice",
];

type Answers = Record<string, Record<string, string>>;

function initAnswers(): Answers {
	return Object.fromEntries(
		LETTERS.map((letter) => [
			letter,
			Object.fromEntries(CATEGORIES.map((cat) => [cat, ""])),
		]),
	);
}

export function PetitBacExercice() {
	const [answers, setAnswers] = useState<Answers>(initAnswers);
	const [checked, setChecked] = useState(false);

	function handleChange(letter: string, category: string, value: string) {
		setAnswers((prev) => ({
			...prev,
			[letter]: { ...prev[letter], [category]: value },
		}));
	}

	function isCorrect(letter: string, category: string): boolean {
		const val = answers[letter][category].trim();
		return val.length > 0 && val.toLowerCase().startsWith(letter.toLowerCase());
	}

	function reset() {
		setAnswers(initAnswers());
		setChecked(false);
	}

	const score = checked
		? LETTERS.reduce(
				(acc, letter) =>
					acc + CATEGORIES.filter((cat) => isCorrect(letter, cat)).length,
				0,
			)
		: null;

	return (
		<div className="p-4 space-y-6">
			<p className="text-sm text-muted-foreground">
				Complétez la grille en trouvant un aliment de chaque catégorie
				commençant par la lettre indiquée.
			</p>
			{checked && score !== null && (
				<Badge
					variant={
						score === LETTERS.length * CATEGORIES.length ? "default" : "outline"
					}
				>
					Score : {score} / {LETTERS.length * CATEGORIES.length}
					{score === LETTERS.length * CATEGORIES.length &&
						" 🎉 Félicitations !"}
				</Badge>
			)}
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr>
							<th className="border border-border bg-muted p-2 w-10" />
							{CATEGORIES.map((cat) => (
								<th
									key={cat}
									className="border border-border bg-muted p-2 font-semibold text-center"
								>
									{cat}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{LETTERS.map((letter) => (
							<tr key={letter}>
								<td className="border border-border bg-muted p-2 text-center font-bold text-lg">
									{letter}
								</td>
								{CATEGORIES.map((cat) => {
									const correct = checked && isCorrect(letter, cat);
									const wrong =
										checked &&
										answers[letter][cat].trim().length > 0 &&
										!isCorrect(letter, cat);
									return (
										<td key={cat} className="border border-border p-1">
											<Input
												value={answers[letter][cat]}
												onChange={(e) =>
													handleChange(letter, cat, e.target.value)
												}
												disabled={checked}
												placeholder={`${letter}...`}
												className={cn(
													"border-2 transition-colors",
													correct &&
														"border-green-500 bg-green-50 dark:bg-green-950",
													wrong && "border-red-500 bg-red-50 dark:bg-red-950",
												)}
											/>
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="flex gap-2">
				<Button onClick={() => setChecked(true)} disabled={checked}>
					Vérifier
				</Button>
				<Button variant="outline" onClick={reset}>
					<RotateCcw className="mr-2 h-4 w-4" />
					Recommencer
				</Button>
			</div>
		</div>
	);
}
