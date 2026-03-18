import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INITIAL_ITEMS = [
	"Avril",
	"Septembre",
	"Juillet",
	"Janvier",
	"Mai",
	"Décembre",
	"Mars",
];

const CORRECT_ORDER = [
	"Janvier",
	"Mars",
	"Avril",
	"Mai",
	"Juillet",
	"Septembre",
	"Décembre",
];

export function SortingExercice() {
	const [items, setItems] = useState<string[]>(INITIAL_ITEMS);
	const [checked, setChecked] = useState(false);
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

	function handleDragStart(index: number) {
		setDragIndex(index);
	}

	function handleDragOver(e: React.DragEvent, index: number) {
		e.preventDefault();
		setDragOverIndex(index);
	}

	function handleDrop(index: number) {
		if (dragIndex === null || dragIndex === index) {
			setDragIndex(null);
			setDragOverIndex(null);
			return;
		}
		const next = [...items];
		const [moved] = next.splice(dragIndex, 1);
		next.splice(index, 0, moved);
		setItems(next);
		setDragIndex(null);
		setDragOverIndex(null);
		setChecked(false);
	}

	function handleDragEnd() {
		setDragIndex(null);
		setDragOverIndex(null);
	}

	const score = checked
		? items.filter((item, i) => item === CORRECT_ORDER[i]).length
		: null;

	return (
		<div className="p-4 space-y-6">
			<p className="text-sm text-muted-foreground">
				Glissez-déposez les mois pour les classer dans l'ordre chronologique
				d'une même année (du plus ancien au plus récent).
			</p>

			<ol className="space-y-2">
				{items.map((item, index) => {
					const isCorrect = checked && item === CORRECT_ORDER[index];
					const isWrong = checked && item !== CORRECT_ORDER[index];
					const isDragging = dragIndex === index;
					const isDragOver = dragOverIndex === index;

					return (
						<li
							key={item}
							draggable
							onDragStart={() => handleDragStart(index)}
							onDragOver={(e) => handleDragOver(e, index)}
							onDrop={() => handleDrop(index)}
							onDragEnd={handleDragEnd}
							className={cn(
								"flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-grab active:cursor-grabbing select-none transition-colors",
								isDragging && "opacity-40",
								isDragOver && !isDragging && "border-primary bg-primary/10",
								!isDragOver && "border-border bg-card hover:bg-accent",
								isCorrect && "border-green-500 bg-green-500/10",
								isWrong && "border-red-500 bg-red-500/10",
							)}
						>
							<span className="text-muted-foreground font-mono text-sm w-5 text-right shrink-0">
								{index + 1}.
							</span>
							<span className="flex-1 font-medium">{item}</span>
							{checked &&
								(isCorrect ? (
									<Badge
										variant="outline"
										className="border-green-500 text-green-600"
									>
										✓
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="border-red-500 text-red-600"
									>
										✗
									</Badge>
								))}
						</li>
					);
				})}
			</ol>

			{checked && score !== null && (
				<p className="text-center font-semibold text-lg">
					Score :{" "}
					<span
						className={cn(
							score === CORRECT_ORDER.length
								? "text-green-600"
								: "text-orange-500",
						)}
					>
						{score}/{CORRECT_ORDER.length}
					</span>
					{score === CORRECT_ORDER.length && (
						<span className="ml-2">🎉 Félicitations !</span>
					)}
				</p>
			)}

			<div className="flex gap-2">
				<Button
					onClick={() => setChecked(true)}
					disabled={checked && score === CORRECT_ORDER.length}
				>
					Vérifier
				</Button>
				<Button
					variant="outline"
					onClick={() => {
						setItems(INITIAL_ITEMS);
						setChecked(false);
					}}
				>
					Recommencer
				</Button>
			</div>
		</div>
	);
}
