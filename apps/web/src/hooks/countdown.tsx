import { useEffect, useRef, useState } from "react";

export function useCountdown(seconds: number, onComplete: () => void) {
	const timer = useRef<NodeJS.Timeout | null>(null);
	const [remainingSecond, setRemainingSecond] = useState(seconds);
	const remainingRef = useRef(seconds);
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;

	const cancel = () => {
		if (timer.current) {
			clearInterval(timer.current);
			timer.current = null;
		}
	};

	useEffect(() => {
		remainingRef.current = seconds;
		setRemainingSecond(seconds);

		if (seconds <= 0) {
			onCompleteRef.current();
			return cancel;
		}

		timer.current = setInterval(() => {
			const next = remainingRef.current - 1;
			remainingRef.current = next;
			setRemainingSecond(next);
			if (next <= 0) {
				cancel();
				onCompleteRef.current();
			}
		}, 1000);

		return cancel;
	}, [seconds]);

	return {
		remainingSecond,
		cancel,
	};
}
