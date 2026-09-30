
"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function StackVisualizer({
  data = [],
  currentStep,
}) {
  const activeIndex = currentStep?.activeIndex ?? -1;
  const highlight = currentStep?.highlight ?? "";

  return (
    <div className="stage">
      <div className="stack">
        <small>TOP</small>

        <AnimatePresence initial={false}>
          {[...data].reverse().map((value, i) => {
            const originalIndex = data.length - 1 - i;
            const isActive = originalIndex === activeIndex;

            let className = "block";

            if (isActive && highlight) {
              className += ` ${highlight}`;
            }

            return (
              <motion.div
                layout
                key={`${originalIndex}-${value}`}
                initial={{
                  opacity: 0,
                  y: -25,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isActive ? 1.05 : 1,
                }}
                exit={{
                  opacity: 0,
                  y: -25,
                  scale: 0.9,
                }}
                transition={{ duration: 0.35 }}
                className={className}
              >
                {value}
                {i === 0 ? " ← TOP" : ""}
              </motion.div>
            );
          })}
        </AnimatePresence>

        <small>BOTTOM</small>

        {data.length === 0 && <p>Stack is empty</p>}
      </div>
    </div>
  );
}