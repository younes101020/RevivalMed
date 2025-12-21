import { useCountdown } from "@/hooks/countdown";
import { Button } from "../ui/button";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog";
import { CardContent, CardFooter } from "../ui/card";
import { MemoryExerciseForm } from "./form/memory";
import { Separator } from "../ui/separator";

export function Memory() {
    return (
        <>
            <CardContent className="space-y-3">
                <p>
                    Lisez l’histoire suivante à voix haute ou dans votre tête, selon votre
                    préférence. Ne lisez cette histoire qu’une seule fois, puis cacher le
                    texte pour lire les questions. Soyez attentif ! Pour vous aider,
                    pensez à utiliser la procédure de résolution de problème pour réaliser
                    cet exercice. Vous pouvez également utiliser la feuille de suivi pour
                    voir votre progression !
                </p>
                <p>
                    Vous êtes prêts ? ... C’est parti !
                </p>
            </CardContent>
            <CardFooter className="mt-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Commencer l'exercice</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <MemoryExercise />
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </>
    );
}

function MemoryExercise() {
    const [hasStarted, setHasStarted] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);
    const { remainingSecond, cancel } = useCountdown(3, () => setHasStarted(true));

    if (hasFinished) return <MemoryExerciseForm />;

    return (
        <>
            {hasStarted ?
            <div className="p-4 space-y-8 font-semibold text-lg">
                <p>Pendant son voyage de deux semaines en Australie, Clara a décidé d’aller faire une ballade sur la plage.</p>
                <p>C’est l’été et il fait très chaud, mais Clara porte un grand chapeau de paille.</p>
                <p>Elle décide d’aller marcher au bord de l’eau, tout en admirant l’océan d’un bleu éclatant.</p>
                <p> L’eau est tellement claire que, si elle regarde de plus près, elle pourrait même réussir à percevoir quelques poissons zébrés nager tranquillement sous la surface de l’eau.</p>
            </div>
                :
                <p className="py-12 text-center">
                    L'exercice va commencer dans
                    <span className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance pl-2 underline underline-offset-8">
                        {remainingSecond}
                    </span>
                </p>
            }
            {hasStarted && <Separator className="my-2" />}
            {hasStarted && <Button onClick={() => setHasFinished(true)}>J'ai tout lu</Button>}
            <DialogClose asChild>
                <Button type="button" variant="outline" onClick={cancel}>
                Annuler
                </Button>
            </DialogClose>
        </>
    );
}