import { RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function letterCount(word: string): number {
	return word.replace(/[-\s]/g, "").length;
}

function sortedWords(words: string[]): string[] {
	return [...words].sort((a, b) => {
		const diff = letterCount(a) - letterCount(b);
		if (diff !== 0) return diff;
		return a.localeCompare(b, "fr", { sensitivity: "base" });
	});
}

const QUESTIONS: { id: number; words: string[] }[] = [
	{ id: 1, words: ["Neptune", "Mars", "Vénus", "Pluton", "Lune", "Terre"] },
	{ id: 2, words: ["Sodium", "Or", "Mercure", "Plomb", "Cuivre", "Argent"] },
	{ id: 3, words: ["Ici", "Demain", "Tard", "Beaucoup", "Tôt", "Peu"] },
	{
		id: 4,
		words: ["Everest", "Tibet", "Oural", "Annapurna", "Atlas", "Himalaya"],
	},
	{ id: 5, words: ["Dollar", "Mark", "Pesos", "Couronne", "Dinar", "Euro"] },
	{
		id: 6,
		words: ["Emeraude", "Améthyste", "Rubis", "Diamant", "Saphir", "Quartz"],
	},
	{
		id: 7,
		words: ["Canada", "Italie", "Laos", "Mexique", "Russie", "Islande"],
	},
	{
		id: 8,
		words: ["Bouleau", "Chêne", "Saule", "Platane", "Séquoia", "Epicéa"],
	},
	{
		id: 9,
		words: ["Tulipe", "Rose", "Marguerite", "Lilas", "Jacinthe", "Jasmin"],
	},
	{
		id: 10,
		words: ["Rouge-gorge", "Pinson", "Aigle", "Pic-vert", "Moineau", "Mésange"],
	},
];

type QuestionState = { words: string[]; correct: string[] };

function initState(): QuestionState[] {
	return QUESTIONS.map((q) => ({
		words: [...q.words],
		correct: sortedWords(q.words),
	}));
}

export function RangerDansLOrdreExercice() {
	const [questions, setQuestions] = useState<QuestionState[]>(initState);
	const [checked, setChecked] = useState(false);
	const dragRef = useRef<{ qIdx: number; wIdx: number } | null>(null);
	const [dragOver, setDragOver] = useState<{
		qIdx: number;
		wIdx: number;
	} | null>(null);

	function handleDragStart(qIdx: number, wIdx: number) {
		dragRef.current = { qIdx, wIdx };
	}

	function handleDragOver(e: React.DragEvent, qIdx: number, wIdx: number) {
		e.preventDefault();
		setDragOver({ qIdx, wIdx });
	}

	function handleDrop(qIdx: number, wIdx: number) {
		const drag = dragRef.current;
		if (!drag || drag.qIdx !== qIdx || drag.wIdx === wIdx) {
			dragRef.current = null;
			setDragOver(null);
			return;
		}
		setQuestions((prev) => {
			const next = prev.map((q) => ({ ...q, words: [...q.words] }));
			const row = next[qIdx].words;
			const [moved] = row.splice(drag.wIdx, 1);
			row.splice(wIdx, 0, moved);
			return next;
		});
		dragRef.current = null;
		setDragOver(null);
		setChecked(false);
	}

	function handleDragEnd() {
		dragRef.current = null;
		setDragOver(null);
	}

	const score = questions.filter((q) =>
		q.words.every((w, i) => w === q.correct[i]),
	).length;

	function reset() {
		setQuestions(initState());
		setChecked(false);
	}

	return (
		<div className="p-4 space-y-4">
			<p className="text-sm text-muted-foreground">
				Pour chaque ligne, glissez-déposez les mots pour les classer d'abord par
				nombre de lettres (du moins au plus), puis dans l'ordre alphabétique en
				cas d'égalité.
			</p>

			{checked && (
				<div className="flex items-center gap-2">
					<span className="font-semibold">Score :</span>
					<Badge
						className={
							score === QUESTIONS.length ? "bg-green-600" : "bg-orange-500"
						}
					>
						{score}/{QUESTIONS.length}
					</Badge>
					{score === QUESTIONS.length && <span>🎉 Parfait !</span>}
				</div>
			)}

			<div className="space-y-3">
				{questions.map((q, qIdx) => {
					const isRowCorrect = q.words.every((w, i) => w === q.correct[i]);
					return (
						<div key={QUESTIONS[qIdx].id} className="space-y-1">
							<div className="flex items-start gap-2">
								<span
									className={cn(
										"shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5",
										checked
											? isRowCorrect
												? "bg-green-500"
												: "bg-red-500"
											: "bg-muted-foreground",
									)}
								>
									{QUESTIONS[qIdx].id}
								</span>
								<div className="flex flex-wrap gap-1.5 flex-1">
									{q.words.map((word, wIdx) => {
										const isOver =
											dragOver?.qIdx === qIdx && dragOver?.wIdx === wIdx;
										const isWordCorrect = checked && word === q.correct[wIdx];
										const isWordWrong = checked && word !== q.correct[wIdx];
										return (
											<button
												key={`${qIdx}-${word}`}
												type="button"
												draggable
												onDragStart={() => handleDragStart(qIdx, wIdx)}
												onDragOver={(e) => handleDragOver(e, qIdx, wIdx)}
												onDrop={() => handleDrop(qIdx, wIdx)}
												onDragEnd={handleDragEnd}
												className={cn(
													"px-3 py-1 rounded-full border text-sm font-medium cursor-grab active:cursor-grabbing select-none transition-colors",
													"bg-card border-border hover:bg-accent",
													isOver && "border-primary bg-primary/10",
													isWordCorrect &&
														"border-green-500 bg-green-50 text-green-800",
													isWordWrong &&
														"border-red-400 bg-red-50 text-red-800",
												)}
											>
												{word}
											</button>
										);
									})}
								</div>
							</div>
							{checked && !isRowCorrect && (
								<div className="flex items-center gap-1.5 pl-8 flex-wrap">
									<span className="text-xs text-muted-foreground">
										Correction :
									</span>
									{q.correct.map((word) => (
										<span
											key={word}
											className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 border border-green-300"
										>
											{word}
										</span>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>

			<div className="flex gap-2 pt-2">
				<Button onClick={() => setChecked(true)} disabled={checked}>
					Vérifier
				</Button>
				<Button variant="outline" onClick={reset}>
					<RotateCcw className="h-4 w-4 mr-1" />
					Recommencer
				</Button>
			</div>
		</div>
	);
}
