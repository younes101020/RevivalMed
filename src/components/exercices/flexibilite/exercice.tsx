import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Word = { word: string; isCorrect: boolean };
type Row = { category: "plus_grand" | "plus_petit"; words: Word[] };

const ROWS: Row[] = [
	{
		category: "plus_grand",
		words: [
			{ word: "AUTRUCHE", isCorrect: true },
			{ word: "ARBRE", isCorrect: false },
			{ word: "FRIGO", isCorrect: false },
		],
	},
	{
		category: "plus_petit",
		words: [
			{ word: "SAUTERELLE", isCorrect: true },
			{ word: "AIGUILLE", isCorrect: false },
			{ word: "VOITURE", isCorrect: false },
		],
	},
	{
		category: "plus_grand",
		words: [
			{ word: "COCHON", isCorrect: true },
			{ word: "SOURIS", isCorrect: false },
			{ word: "GOMME", isCorrect: false },
		],
	},
	{
		category: "plus_petit",
		words: [
			{ word: "MOUTON", isCorrect: false },
			{ word: "FAUTEUIL", isCorrect: false },
			{ word: "FOURMI", isCorrect: true },
		],
	},
	{
		category: "plus_grand",
		words: [
			{ word: "SIFFLET", isCorrect: false },
			{ word: "CHEVAL", isCorrect: true },
			{ word: "PAPILLON", isCorrect: false },
		],
	},
	{
		category: "plus_petit",
		words: [
			{ word: "ÉLÉPHANT", isCorrect: false },
			{ word: "GUITARE", isCorrect: false },
			{ word: "COCCINELLE", isCorrect: true },
		],
	},
	{
		category: "plus_grand",
		words: [
			{ word: "DAUPHIN", isCorrect: true },
			{ word: "CHÂTEAU", isCorrect: false },
			{ word: "PIANO", isCorrect: false },
		],
	},
	{
		category: "plus_petit",
		words: [
			{ word: "SARDINE", isCorrect: true },
			{ word: "OURS", isCorrect: false },
			{ word: "CIGARETTE", isCorrect: false },
		],
	},
	{
		category: "plus_grand",
		words: [
			{ word: "CRABE", isCorrect: false },
			{ word: "CHÈVRE", isCorrect: true },
			{ word: "CREVETTE", isCorrect: false },
		],
	},
	{
		category: "plus_petit",
		words: [
			{ word: "ÂNE", isCorrect: false },
			{ word: "RENARD", isCorrect: false },
			{ word: "CHAMEAU", isCorrect: false },
		],
	},
	{
		category: "plus_grand",
		words: [
			{ word: "VERRE", isCorrect: false },
			{ word: "CANARI", isCorrect: false },
			{ word: "CROCODILE", isCorrect: true },
		],
	},
	{
		category: "plus_petit",
		words: [
			{ word: "MOUCHE", isCorrect: true },
			{ word: "LUNETTES", isCorrect: false },
			{ word: "LOUP", isCorrect: false },
		],
	},
	{
		category: "plus_grand",
		words: [
			{ word: "ABEILLE", isCorrect: false },
			{ word: "BAIGNOIRE", isCorrect: false },
			{ word: "SANGLIER", isCorrect: true },
		],
	},
	{
		category: "plus_petit",
		words: [
			{ word: "PUCE", isCorrect: true },
			{ word: "TIGRE", isCorrect: false },
			{ word: "AVION", isCorrect: false },
		],
	},
	{
		category: "plus_grand",
		words: [
			{ word: "LÉZARD", isCorrect: false },
			{ word: "GIRAFE", isCorrect: true },
			{ word: "ESCARGOT", isCorrect: false },
		],
	},
];

const TOTAL_CORRECT = ROWS.flatMap((r) => r.words).filter(
	(w) => w.isCorrect,
).length;

export function FlexibiliteExercice({
	onComplete,
}: {
	onComplete?: (score: number) => void;
} = {}) {
	const [selected, setSelected] = useState<Record<string, boolean>>({});
	const [checked, setChecked] = useState(false);

	function toggleWord(rowIdx: number, wordIdx: number) {
		if (checked) return;
		const key = `${rowIdx}-${wordIdx}`;
		setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
	}

	function isSelected(rowIdx: number, wordIdx: number) {
		return !!selected[`${rowIdx}-${wordIdx}`];
	}

	const score = checked
		? ROWS.flatMap((row, ri) =>
				row.words.map((w, wi) => (isSelected(ri, wi) && w.isCorrect ? 1 : 0)),
			).reduce((a: number, b: number) => a + b, 0)
		: null;

	return (
		<div className="p-4 space-y-6">
			<p className="text-sm text-muted-foreground">
				Cliquez sur tous les noms d'animaux qui sont{" "}
				<strong>plus grand ou plus petit que le chat</strong> selon la consigne
				de chaque ligne.
			</p>

			<div className="space-y-2">
				{ROWS.map((row, rowIdx) => (
					<div
						key={`${row.category}-${rowIdx}`}
						className="flex items-center gap-3"
					>
						<Badge
							variant="outline"
							className={cn(
								"shrink-0 text-xs w-24 justify-center",
								row.category === "plus_grand"
									? "border-blue-400 text-blue-600"
									: "border-purple-400 text-purple-600",
							)}
						>
							{row.category === "plus_grand" ? "Plus grand" : "Plus petit"}
						</Badge>

						<div className="flex gap-2 flex-wrap">
							{row.words.map((w, wordIdx) => {
								const sel = isSelected(rowIdx, wordIdx);
								const correctlySelected = checked && sel && w.isCorrect;
								const wronglySelected = checked && sel && !w.isCorrect;
								const missed = checked && !sel && w.isCorrect;

								return (
									<button
										type="button"
										key={w.word}
										onClick={() => toggleWord(rowIdx, wordIdx)}
										className={cn(
											"px-3 py-1.5 rounded-md border-2 font-semibold text-sm transition-colors select-none",
											!checked &&
												!sel &&
												"border-border bg-card hover:bg-accent cursor-pointer",
											!checked &&
												sel &&
												"border-primary bg-primary/15 cursor-pointer",
											correctlySelected &&
												"border-green-500 bg-green-500/15 text-green-700 cursor-default",
											wronglySelected &&
												"border-red-500 bg-red-500/15 text-red-700 line-through cursor-default",
											missed &&
												"border-orange-400 bg-orange-400/15 text-orange-700 cursor-default",
											checked &&
												!sel &&
												!w.isCorrect &&
												"border-border bg-card opacity-50 cursor-default",
										)}
									>
										{w.word}
										{correctlySelected && " ✓"}
										{wronglySelected && " ✗"}
										{missed && " ○"}
									</button>
								);
							})}
						</div>
					</div>
				))}
			</div>

			{checked && score !== null && (
				<div className="space-y-1">
					<p className="text-center font-semibold text-lg">
						Score :{" "}
						<span
							className={cn(
								score === TOTAL_CORRECT ? "text-green-600" : "text-orange-500",
							)}
						>
							{score}/{TOTAL_CORRECT}
						</span>
						{score === TOTAL_CORRECT && (
							<span className="ml-2">🎉 Félicitations !</span>
						)}
					</p>
					<p className="text-center text-xs text-muted-foreground">
						✓ correct · ✗ erreur · ○ manqué
					</p>
				</div>
			)}

			<div className="flex gap-2">
				<Button
					onClick={() => {
						const correctCount = ROWS.flatMap((row, ri) =>
							row.words.map((w, wi) =>
								isSelected(ri, wi) && w.isCorrect ? 1 : 0,
							),
						).reduce((a: number, b: number) => a + b, 0);
						setChecked(true);
						onComplete?.(Math.round((correctCount / TOTAL_CORRECT) * 100));
					}}
					disabled={checked}
				>
					Vérifier
				</Button>
				<Button
					variant="outline"
					onClick={() => {
						setSelected({});
						setChecked(false);
					}}
				>
					Recommencer
				</Button>
			</div>
		</div>
	);
}
