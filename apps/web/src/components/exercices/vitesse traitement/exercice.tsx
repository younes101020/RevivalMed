import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SharedConfig } from "@/types";

type Answer = "identique" | "different" | null;

interface Pair {
	id: string;
	left: string;
	right: string;
	correct: "identique" | "different";
}

const PAIRS: Pair[] = [
	{ id: "L01", left: "T", right: "A", correct: "different" },
	{ id: "L02", left: "A", right: "A", correct: "identique" },
	{ id: "L03", left: "A", right: "T", correct: "different" },
	{ id: "L04", left: "T", right: "T", correct: "identique" },
	{ id: "L05", left: "A", right: "T", correct: "different" },
	{ id: "L06", left: "T", right: "A", correct: "different" },
	{ id: "L07", left: "A", right: "A", correct: "identique" },
	{ id: "L08", left: "T", right: "A", correct: "different" },
	{ id: "L09", left: "A", right: "A", correct: "identique" },
	{ id: "L10", left: "A", right: "T", correct: "different" },
	{ id: "L11", left: "T", right: "A", correct: "different" },
	{ id: "L12", left: "A", right: "T", correct: "different" },
	{ id: "L13", left: "T", right: "T", correct: "identique" },
	{ id: "L14", left: "A", right: "T", correct: "different" },
	{ id: "L15", left: "A", right: "A", correct: "identique" },
	{ id: "R01", left: "A", right: "A", correct: "identique" },
	{ id: "R02", left: "A", right: "T", correct: "different" },
	{ id: "R03", left: "T", right: "A", correct: "different" },
	{ id: "R04", left: "A", right: "T", correct: "different" },
	{ id: "R05", left: "T", right: "A", correct: "different" },
	{ id: "R06", left: "A", right: "A", correct: "identique" },
	{ id: "R07", left: "T", right: "A", correct: "different" },
	{ id: "R08", left: "A", right: "T", correct: "different" },
	{ id: "R09", left: "T", right: "T", correct: "identique" },
	{ id: "R10", left: "T", right: "A", correct: "different" },
	{ id: "R11", left: "A", right: "T", correct: "different" },
	{ id: "R12", left: "A", right: "A", correct: "identique" },
	{ id: "R13", left: "T", right: "A", correct: "different" },
	{ id: "R14", left: "A", right: "T", correct: "different" },
	{ id: "R15", left: "T", right: "T", correct: "identique" },
];

export interface VitesseConfig extends SharedConfig {
	pairCount: number;
	letters: string[];
	hint: string;
}

function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function VitesseTraitementExercise({
	onComplete,
}: {
	onComplete?: (score: number) => void;
} = {}) {
	const [answers, setAnswers] = useState<Answer[]>(
		Array(PAIRS.length).fill(null),
	);
	const [elapsed, setElapsed] = useState(0);
	const [isComplete, setIsComplete] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setElapsed((prev) => prev + 1);
		}, 1000);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	const handleAnswer = (index: number, answer: "identique" | "different") => {
		if (isComplete) return;
		const newAnswers = [...answers];
		newAnswers[index] = answer;
		setAnswers(newAnswers);
		if (newAnswers.every((a) => a !== null)) {
			if (intervalRef.current) clearInterval(intervalRef.current);
			setIsComplete(true);
			const finalScore = newAnswers.filter(
				(a, i) => a === PAIRS[i].correct,
			).length;
			onComplete?.(Math.round((finalScore / PAIRS.length) * 100));
		}
	};

	const score = answers.filter((a, i) => a === PAIRS[i].correct).length;

	if (isComplete) {
		return (
			<div className="space-y-4 py-2">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-bold">Résultats</h2>
					<div className="flex gap-2">
						<Badge variant="secondary">{formatTime(elapsed)}</Badge>
						<Badge>
							{score}/{PAIRS.length}
						</Badge>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-x-6 gap-y-1">
					{PAIRS.map((pair, i) => {
						const isCorrect = answers[i] === pair.correct;
						return (
							<div
								key={pair.id}
								className={cn(
									"flex items-center gap-2 rounded px-2 py-1 text-sm",
									isCorrect
										? "bg-green-50 text-green-800"
										: "bg-red-50 text-red-800",
								)}
							>
								<span className="font-mono font-bold w-10">
									{pair.left} {pair.right}
								</span>
								<span className="flex-1 text-xs capitalize">{answers[i]}</span>
								{isCorrect ? (
									<CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
								) : (
									<XCircle className="h-4 w-4 text-red-500 shrink-0" />
								)}
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-3 py-2">
			<div className="flex items-center justify-between">
				<h2 className="text-base font-semibold">
					Identique ou Différent ? — Niveau 1
				</h2>
				<Badge variant="secondary">{formatTime(elapsed)}</Badge>
			</div>

			<div className="grid grid-cols-2 gap-x-4">
				<PairColumn
					pairs={PAIRS.slice(0, 15)}
					offset={0}
					answers={answers}
					onAnswer={handleAnswer}
				/>
				<PairColumn
					pairs={PAIRS.slice(15)}
					offset={15}
					answers={answers}
					onAnswer={handleAnswer}
				/>
			</div>
		</div>
	);
}

function PairColumn({
	pairs,
	offset,
	answers,
	onAnswer,
}: {
	pairs: Pair[];
	offset: number;
	answers: Answer[];
	onAnswer: (index: number, answer: "identique" | "different") => void;
}) {
	return (
		<div>
			<div className="grid grid-cols-[2rem_1fr_1fr] items-center gap-x-2 pb-1 text-xs font-semibold text-muted-foreground">
				<span />
				<span className="text-center">IDENTIQUE</span>
				<span className="text-center">DIFFÉRENT</span>
			</div>
			{pairs.map((pair, rowIdx) => {
				const globalIdx = offset + rowIdx;
				const answered = answers[globalIdx];
				return (
					<div
						key={pair.id}
						className="grid grid-cols-[2rem_1fr_1fr] items-center gap-x-2 py-0.5"
					>
						<span className="font-mono text-sm font-bold">
							{pair.left} {pair.right}
						</span>
						<button
							type="button"
							onClick={() => onAnswer(globalIdx, "identique")}
							className={cn(
								"h-5 w-5 rounded border border-input mx-auto transition-colors",
								answered === "identique" && "bg-primary border-primary",
							)}
							aria-label={`Paire ${globalIdx + 1} : identique`}
						/>
						<button
							type="button"
							onClick={() => onAnswer(globalIdx, "different")}
							className={cn(
								"h-5 w-5 rounded border border-input mx-auto transition-colors",
								answered === "different" && "bg-primary border-primary",
							)}
							aria-label={`Paire ${globalIdx + 1} : différent`}
						/>
					</div>
				);
			})}
		</div>
	);
}
