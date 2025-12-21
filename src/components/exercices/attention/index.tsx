import { useCountdown } from "@/hooks/countdown";

import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CardContent, CardFooter } from "@/components/ui/card";
import { WordSearchExercice } from "./exercice";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function Attention() {
    return (
        <>
            <CardContent className="space-y-3">
                <p>
                    Des mots mêlés ca vous dis ?
                    Retrouver les 13 îles du monde cachées dans la grille
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
                        <AttentionExercise />
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </>
    );
}

function AttentionExercise() {
    const [hasStarted, setHasStarted] = useState(false);
    const { remainingSecond, cancel } = useCountdown(3, () => setHasStarted(true));

    return (
        <>
            {hasStarted ?
                <WordSearchExercice />
                :
                <p className="py-12 text-center">
                    L'exercice va commencer dans
                    <span className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance pl-2 underline underline-offset-8">
                        {remainingSecond}
                    </span>
                </p>
            }
            {hasStarted && <Separator className="my-2" />}
            <DialogClose asChild>
                <Button type="button" variant="outline" onClick={cancel}>
                Annuler
                </Button>
            </DialogClose>
        </>
    );
}