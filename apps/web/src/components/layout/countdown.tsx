import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useGamePreferences } from "@/lib/game-preferences";
import { Separator } from "@/components/ui/separator";
import { useCountdown } from "@/hooks/countdown";

interface CountdownProps {
    children: ReactNode;
}

export function Countdown({ children }: CountdownProps) {
    const [hasStarted, setHasStarted] = useState(false);
    const { preferences } = useGamePreferences();
    const audioContextRef = useRef<AudioContext | null>(null);
    const playTone = (frequency: number) => {
        if (!preferences.soundEnabled || typeof window === "undefined") return;

        try {
            const AudioContextConstructor =
                window.AudioContext ??
                (window as typeof window & { webkitAudioContext?: typeof AudioContext })
                    .webkitAudioContext;
            if (!AudioContextConstructor) return;
            const context =
                audioContextRef.current ?? new AudioContextConstructor();
            audioContextRef.current = context;
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.05, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.12);
        } catch {
            // Audio support is optional and must not block the exercise.
        }
    };

    const { remainingSecond, cancel } = useCountdown(
        preferences.countdownSeconds,
        () => {
            playTone(880);
            setHasStarted(true);
        },
    );

    useEffect(() => {
        if (hasStarted || preferences.countdownSeconds <= 0) return;
        playTone(440);
    }, [remainingSecond, hasStarted, preferences.countdownSeconds]);

    useEffect(() => () => {
        audioContextRef.current?.close();
    }, []);

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