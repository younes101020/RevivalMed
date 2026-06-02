import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCountdown } from "@/hooks/countdown";

interface CountdownProps {
    children: ReactNode;
}

export function Countdown({ children }: CountdownProps) {
    const [hasStarted, setHasStarted] = useState(false);
    const { remainingSecond, cancel } = useCountdown(3, () =>
        setHasStarted(true),
    );

    return (
        <>
            {hasStarted ? (
                children
            ) : (
                <p className="py-12 text-center">
                    L'exercice va commencer dans
                    <span className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance pl-2 underline underline-offset-8">
                        {remainingSecond}
                    </span>
                </p>
            )}
            {hasStarted && <Separator className="my-2" />}
            {!hasStarted && (
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={cancel}>
                        Annuler
                    </Button>
                </DialogClose>
            )}
        </>
    );
}