"use client";
import { useCallback, useState, useRef } from "react";

export function useTimer() {
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const [totalTime, setTotalTime] = useState(0);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);

    setTotalTime(0);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTotalTime(Date.now() - startTimeRef.current);
    }, 10);
  }, []);

  const stopTimer = useCallback(() => {
    if (startTimeRef.current === null) return;
    const elapsed = Date.now() - startTimeRef.current;

    setTotalTime(elapsed);
    clearInterval(timerRef.current);
    startTimeRef.current = null;
    timerRef.current = null;

    return elapsed;
  }, []);
  return {
    timerRef,
    startTimeRef,
    totalTime,
    setTotalTime,
    startTimer,
    stopTimer,
  };
}
