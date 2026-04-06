import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ITEMS = [
	{
		id: 1,
		wordAnswer: "gendarme",
		drawingAnswer: "cerf",
		acceptedWords: ["gendarme"],
		acceptedDrawings: [
			"cerf",
			"deer",
			"daim",
			"biche",
			"animal",
			"cheval",
			"horse",
			"chameau",
			"kangourou",
		],
	},
	{
		id: 2,
		wordAnswer: "serpent",
		drawingAnswer: "éléphant",
		acceptedWords: ["serpent"],
		acceptedDrawings: ["éléphant", "elephant"],
	},
	{
		id: 3,
		wordAnswer: "valise",
		drawingAnswer: "ours",
		acceptedWords: ["valise"],
		acceptedDrawings: ["ours", "singe", "bear", "monkey", "animal"],
	},
	{
		id: 4,
		wordAnswer: "journal",
		drawingAnswer: "carotte",
		acceptedWords: ["journal"],
		acceptedDrawings: ["carotte", "carrot", "navet", "légume", "radis"],
	},
	{
		id: 5,
		wordAnswer: "demain",
		drawingAnswer: "coq",
		acceptedWords: ["demain"],
		acceptedDrawings: [
			"coq",
			"oiseau",
			"poulet",
			"bird",
			"rooster",
			"pigeon",
			"dindon",
		],
	},
];

type Answers = { word: string; drawing: string }[];

function initAnswers(): Answers {
	return ITEMS.map(() => ({ word: "", drawing: "" }));
}

export function JeVoisDoubleExercice({ onComplete }: { onComplete?: (score: number) => void } = {}) {
	const [answers, setAnswers] = useState<Answers>(initAnswers);
	const [checked, setChecked] = useState(false);
	const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

	function handleChange(
		index: number,
		field: "word" | "drawing",
		value: string,
	) {
		setAnswers((prev) =>
			prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
		);
	}

	function isWordCorrect(index: number): boolean {
		const val = answers[index].word.trim().toLowerCase();
		return ITEMS[index].acceptedWords.some((w) => w.toLowerCase() === val);
	}

	function isDrawingCorrect(index: number): boolean {
		const val = answers[index].drawing.trim().toLowerCase();
		return ITEMS[index].acceptedDrawings.some((d) => d.toLowerCase() === val);
	}

	function reset() {
		setAnswers(initAnswers());
		setChecked(false);
	}

	const totalScore = checked
		? ITEMS.reduce(
				(acc, _, i) =>
					acc + (isWordCorrect(i) ? 1 : 0) + (isDrawingCorrect(i) ? 1 : 0),
				0,
			)
		: null;
	const maxScore = ITEMS.length * 2;

	return (
		<div className="p-4 space-y-6">
			<p className="text-sm text-muted-foreground">
				Pour chaque image, identifiez le <strong>mot</strong> écrit et le{" "}
				<strong>dessin</strong> représenté.
			</p>

			{checked && totalScore !== null && (
				<Badge variant={totalScore === maxScore ? "default" : "outline"}>
					Score : {totalScore} / {maxScore}
					{totalScore === maxScore && " 🎉 Félicitations !"}
				</Badge>
			)}

			<div className="space-y-8">
				{ITEMS.map((item, index) => (
					<div
						key={item.id}
						className="space-y-3 pb-6 border-b last:border-0 last:pb-0"
					>
						<p className="font-semibold text-sm text-muted-foreground">
							Image {item.id}
						</p>

						<div className="flex items-center justify-center rounded-lg overflow-hidden border bg-muted min-h-48">
							{failedImages.has(item.id) ? (
								<span className="text-sm text-muted-foreground italic px-4 text-center">
									Image {item.id} introuvable — placez-la dans{" "}
									<code>/public/images/jvd/image{item.id}.png</code>
								</span>
							) : (
								<img
									src={`/images/jvd/image${item.id}.png`}
									alt={`Exercice Je vois double — visuel ${item.id}`}
									className="max-h-48 max-w-full object-contain"
									onError={() =>
										setFailedImages((prev) => new Set([...prev, item.id]))
									}
								/>
							)}
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label htmlFor={`word-${item.id}`}>Mot :</Label>
								<Input
									id={`word-${item.id}`}
									value={answers[index].word}
									onChange={(e) => handleChange(index, "word", e.target.value)}
									disabled={checked}
									className={cn(
										checked &&
											(isWordCorrect(index)
												? "border-green-500"
												: "border-red-400"),
									)}
									placeholder="Quel est le mot ?"
								/>
								{checked && !isWordCorrect(index) && (
									<p className="text-xs text-red-500">
										Réponse : {item.wordAnswer}
									</p>
								)}
							</div>

							<div className="space-y-1">
								<Label htmlFor={`drawing-${item.id}`}>Dessin :</Label>
								<Input
									id={`drawing-${item.id}`}
									value={answers[index].drawing}
									onChange={(e) =>
										handleChange(index, "drawing", e.target.value)
									}
									disabled={checked}
									className={cn(
										checked &&
											(isDrawingCorrect(index)
												? "border-green-500"
												: "border-red-400"),
									)}
									placeholder="Quel est le dessin ?"
								/>
								{checked && !isDrawingCorrect(index) && (
									<p className="text-xs text-red-500">
										Réponse : {item.drawingAnswer}
									</p>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="flex gap-2 pt-2">
				{!checked ? (
					<Button
						onClick={() => {
							const s = ITEMS.reduce(
								(acc, _, i) =>
									acc + (isWordCorrect(i) ? 1 : 0) + (isDrawingCorrect(i) ? 1 : 0),
								0,
							);
							setChecked(true);
							onComplete?.(Math.round((s / (ITEMS.length * 2)) * 100));
						}}
					>
						Vérifier
					</Button>
				) : (
					<Button variant="outline" onClick={reset}>
						<RotateCcw className="mr-2 h-4 w-4" />
						Recommencer
					</Button>
				)}
			</div>
		</div>
	);
}
