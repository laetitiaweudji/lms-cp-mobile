import { useCallback, useEffect, useState } from "react";

const LOCKOUT_THRESHOLD = 3;
const LOCKOUT_SECONDS = 30;

export function useLockout() {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!lockedUntil) return;

    const tick = () => {
      const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (secondsLeft <= 0) {
        setLockedUntil(null);
        setFailedAttempts(0);
        setRemaining(0);
      } else {
        setRemaining(secondsLeft);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const recordFailure = useCallback(() => {
    setFailedAttempts((prev) => {
      const next = prev + 1;
      if (next >= LOCKOUT_THRESHOLD) {
        setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000);
        setRemaining(LOCKOUT_SECONDS);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setFailedAttempts(0);
    setLockedUntil(null);
    setRemaining(0);
  }, []);

  return {
    isLocked: lockedUntil !== null && remaining > 0,
    remainingSeconds: remaining,
    attemptsRemaining: Math.max(0, LOCKOUT_THRESHOLD - failedAttempts),
    recordFailure,
    reset,
  };
}
