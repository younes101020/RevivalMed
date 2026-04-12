import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";
import { handleForm } from "@/lib/form";
import { formOpts } from "@/lib/form-isomorphic";

type QuestionField = keyof typeof formOpts.defaultValues;

type Question =
        | { field: QuestionField; label: string; type: "text" }
        | { field: QuestionField; label: string; type: "select"; options: readonly string[] };

const QUESTIONS: readonly Question[] = [
        { field: "characterName",          label: "Nom du personnage",                                    type: "text" },
        { field: "characterCountry",       label: "Pays du personnage",                                   type: "text" },
        { field: "seasonStore",            label: "Saison durant laquelle se déroule l'histoire",         type: "select", options: ["hiver", "printemps", "été", "automne"] },
        { field: "weather",                label: "Météo dans laquelle se déroule l'histoire",            type: "select", options: ["très chaud", "chaud", "tempéré", "froid", "très froid"] },
        { field: "oceanColor",             label: "Couleur de l'océan",                                   type: "select", options: ["bleu éclatant", "rouge éclatant", "bleu foncé"] },
        { field: "inOceanPerceivedObject", label: "Objet perçu dans l'océan",                             type: "select", options: ["algues", "poissons zébré", "cailloux"] },
] as const;

const CORRECT_ANSWERS: Record<QuestionField, string> = {
        characterName:          "clara",
        characterCountry:       "australie",
        seasonStore:            "été",
        weather:                "très chaud",
        oceanColor:             "bleu éclatant",
        inOceanPerceivedObject: "poissons zébré",
};

interface MemoryExerciseFormProps {
        questionCount: 3 | 4 | 5 | 6;
        onScoreComputed: (percent: number) => void;
}

export function MemoryExerciseForm({ questionCount, onScoreComputed }: MemoryExerciseFormProps) {
        const [score, setScore] = useState("");
        const hasReportedRef = useRef(false);

        const form = useForm({
                ...formOpts,
                validators: {
                        onSubmitAsync: async ({ value }) => {
                                const visibleQuestions = QUESTIONS.slice(0, questionCount);
                                const correctCount = visibleQuestions.filter(
                                        (q) => value[q.field]?.trim().toLowerCase() === CORRECT_ANSWERS[q.field],
                                ).length;
                                const scoreStr = `${correctCount}/${visibleQuestions.length}`;
                                setScore(scoreStr);

                                if (!hasReportedRef.current) {
                                        hasReportedRef.current = true;
                                        onScoreComputed((correctCount / visibleQuestions.length) * 100);
                                }

                                const result = await handleForm({ data: value });
                                if (result.error) {
                                        const visibleFields = new Set(visibleQuestions.map((q) => q.field));
                                        const filteredErrors = Object.fromEntries(
                                                Object.entries(result.error).filter(([key]) =>
                                                        visibleFields.has(key as QuestionField),
                                                ),
                                        );
                                        if (Object.keys(filteredErrors).length > 0) {
                                                return { fields: filteredErrors };
                                        }
                                }
                        },
                },
        });

        return (
                <div className="flex flex-col gap-8 max-h-[80vh] overflow-y-auto">
                        <div className="space-y-2">
                                <h3 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance underline underline-offset-4">
                                        Questionnaire final
                                </h3>
                                <p className="text-xs">
                                        Le résultat de ce questionnaire permettra d'évaluer vos capacités de
                                        mémorisation.
                                </p>
                                {score && <Badge variant={"default"}>Votre score : {score}</Badge>}
                        </div>
                        <form
                                onSubmit={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                }}
                                className="flex flex-col gap-4 px-3"
                        >
                                {QUESTIONS.slice(0, questionCount).map((question) => (
                                        <form.Field key={question.field} name={question.field}>
                                                {(field) => (
                                                        <div className="space-y-2">
                                                                <Label htmlFor={field.name}>{question.label}</Label>
                                                                {question.type === "text" ? (
                                                                        <Input
                                                                                id={field.name}
                                                                                name={field.name}
                                                                                type="text"
                                                                                value={field.state.value}
                                                                                required
                                                                                onChange={(e) => field.handleChange(e.target.value)}
                                                                        />
                                                                ) : (
                                                                        <Select
                                                                                name={field.name}
                                                                                value={field.state.value}
                                                                                onValueChange={field.handleChange}
                                                                        >
                                                                                <SelectTrigger className="w-full">
                                                                                        <SelectValue placeholder="..." />
                                                                                </SelectTrigger>
                                                                                <SelectContent id={field.name}>
                                                                                        {question.options.map((opt) => (
                                                                                                <SelectItem key={opt} value={opt}>
                                                                                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                                                                </SelectItem>
                                                                                        ))}
                                                                                </SelectContent>
                                                                        </Select>
                                                                )}
                                                                {field.state.meta.errors.map((error) => (
                                                                        <p className="text-red-500" key={error as unknown as string}>
                                                                                {error as unknown as string}
                                                                        </p>
                                                                ))}
                                                        </div>
                                                )}
                                        </form.Field>
                                ))}
                                <form.Subscribe
                                        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
                                >
                                        {([canSubmit, isSubmitting]) => (
                                                <Button
                                                        type="submit"
                                                        disabled={!canSubmit}
                                                        onClick={() => form.handleSubmit()}
                                                        className="mt-4"
                                                >
                                                        {isSubmitting ? "..." : "Soumettre"}
                                                </Button>
                                        )}
                                </form.Subscribe>
                        </form>
                </div>
        );
}
