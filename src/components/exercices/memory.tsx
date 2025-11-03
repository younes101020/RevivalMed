import { useCountdown } from "@/hooks/countdown";
import { Button } from "../ui/button";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog";
import { Card, CardContent, CardFooter } from "../ui/card";

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
    const { remainingSecond, cancel } = useCountdown(6, () => setHasStarted(true));

    return (
        <>
            {hasStarted ?
                <div>Exercice started!</div>
                :
                <p className="py-12 text-center underline underline-offset-8">
                    L'exercice va commencer dans
                    <span className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance pl-2">
                        {remainingSecond}
                    </span>
                </p>
            }
            <DialogClose asChild>
                <Button type="button" variant="outline" onClick={cancel} className=" w-1/3">
                Annuler
                </Button>
            </DialogClose>
        </>
    );
}