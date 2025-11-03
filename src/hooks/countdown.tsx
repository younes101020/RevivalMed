import { useEffect, useRef, useState } from "react";

export function useCountdown(seconds: number, onComplete: () => void) {
    const timer = useRef<NodeJS.Timeout | null>(null);
    const [remainingSecond, setRemainingSecond] = useState(seconds);

    const cancel = () => {
        if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }
    };

    useEffect(() => {
        timer.current = setInterval(() => {
            setRemainingSecond((prev) => prev - 1);
            if (remainingSecond <= 0) {
                if (timer.current) clearInterval(timer.current);
                onComplete();
            }
        }, 1000);

        return cancel;
    }, [onComplete]);

    return {
        remainingSecond,
        cancel
    };
}