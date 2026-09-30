"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Rewind,
} from "lucide-react";

export default function PlaybackControls({
  steps,
  stepIndex,
  setStepIndex,
  speed,
  setSpeed,
  playing,
  setPlaying,
  setDirection,
}) {
  const hasSteps = steps.length > 0;
  const atStart = stepIndex === 0;
  const atEnd = stepIndex === steps.length - 1;

  function replay() {
  if (!hasSteps) return;

  setDirection(1);
  setStepIndex(0);
  setPlaying(true);
  }

  function playForward() {
    if (!hasSteps) return;

    if (atEnd) {
      setStepIndex(0);
    }

    setDirection(1);
    setPlaying(true);
  }

  function playBackward() {
    if (!hasSteps) return;

    if (atStart) {
      setStepIndex(steps.length - 1);
    }

    setDirection(-1);
    setPlaying(true);
  }

  function togglePlay() {
    if (playing) {
      setPlaying(false);
    } else {
      playForward();
    }
  }

  function nextStep() {
    setPlaying(false);
    setDirection(1);
    setStepIndex((current) =>
      Math.min(steps.length - 1, current + 1)
    );
  }

  function previousStep() {
    setPlaying(false);
    setDirection(-1);
    setStepIndex((current) => Math.max(0, current - 1));
  }

  return (
    <section className="panel playback">
      <div className="playtop">
        <h3>
          03 Playback
          <small>
            {hasSteps
              ? `Step ${stepIndex + 1} of ${steps.length}`
              : "Run an operation to create steps"}
          </small>
        </h3>

        <label>
          Speed
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          >
            <option value="0.5">0.5×</option>
            <option value="1">1×</option>
            <option value="1.5">1.5×</option>
            <option value="2">2×</option>
            <option value="3">3×</option>
          </select>
        </label>
      </div>

      <div className="buttons">
        <button
          disabled={!hasSteps}
          onClick={replay}
          title="Replay from beginning"
        >
          <RotateCcw size={17} />
        </button>

        <button
          disabled={!hasSteps || atStart}
          onClick={previousStep}
          title="Previous step"
        >
          <SkipBack size={17} />
        </button>

        <button
          disabled={!hasSteps}
          className="play"
          onClick={togglePlay}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={17} /> : <Play size={17} />}
        </button>

        <button
          disabled={!hasSteps || atEnd}
          onClick={nextStep}
          title="Next step"
        >
          <SkipForward size={17} />
        </button>

        <button
          disabled={!hasSteps}
          onClick={playBackward}
          title="Play backward"
        >
          <Rewind size={17} />
        </button>
      </div>

      <div className="track">
        <i
          style={{
            width: hasSteps
              ? `${((stepIndex + 1) / steps.length) * 100}%`
              : "0%",
          }}
        />
      </div>
    </section>
  );
}