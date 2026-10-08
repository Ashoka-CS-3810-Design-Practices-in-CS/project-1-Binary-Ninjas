"use client";

const COLORS = {
  added: "#16a34a",
  found: "#16a34a",
  removing: "#dc2626",
  checking: "#eab308",
  active: "#eab308",
};

export default function BinaryTreeVisualizer({ data, currentStep }) {
  const values = Array.isArray(data) ? data : [];

  if (values.length === 0) {
    return (
      <p style={{ opacity: 0.6, textAlign: "center", padding: 24 }}>
        Tree is empty. Insert a value to begin.
      </p>
    );
  }

  // Binary tree stored in level order: children of i are 2i+1 and 2i+2
  const maxDepth = Math.floor(Math.log2(values.length));
  const width = Math.max(320, Math.pow(2, maxDepth) * 70);
  const height = (maxDepth + 1) * 80 + 20;

  const position = (i) => {
    const depth = Math.floor(Math.log2(i + 1));
    const indexInLevel = i + 1 - Math.pow(2, depth);
    const slots = Math.pow(2, depth);
    return {
      x: ((indexInLevel + 0.5) * width) / slots,
      y: depth * 80 + 40,
    };
  };

  const activeIndex =
    currentStep && typeof currentStep.activeIndex === "number"
      ? currentStep.activeIndex
      : -1;
  const highlightColor = COLORS[currentStep?.highlight] || "#eab308";

  return (
    <div style={{ overflowX: "auto", display: "flex", justifyContent: "center" }}>
      <svg width={width} height={height}>
        {values.map((_, i) =>
          [2 * i + 1, 2 * i + 2]
            .filter((c) => c < values.length)
            .map((c) => {
              const a = position(i);
              const b = position(c);
              return (
                <line
                  key={`${i}-${c}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#888"
                  strokeWidth={2}
                />
              );
            })
        )}

        {values.map((v, i) => {
          const { x, y } = position(i);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={22}
                fill={i === activeIndex ? highlightColor : "#2563eb"}
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="#fff"
                fontSize={14}
              >
                {v}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}