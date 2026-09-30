"use client";

import { useEffect } from "react";

export default function AnimationController({
  playing,
  setPlaying,
  stepIndex,
  setStepIndex,
  totalSteps,
  speed = 1,
  direction = 1,
}) {
  useEffect(() => {
    if (!playing || totalSteps <= 1) return;

    const nextIndex = stepIndex + direction;

    if (nextIndex < 0 || nextIndex >= totalSteps) {
      setPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStepIndex(nextIndex);
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [
    playing,
    stepIndex,
    totalSteps,
    speed,
    direction,
    setStepIndex,
    setPlaying,
  ]);

  return null;
}