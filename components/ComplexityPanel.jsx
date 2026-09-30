"use client";

export default function ComplexityPanel({
  complexity,
  operation,
}) {
  const stackComplexities = {
    push: {
      time: "O(1)",
      space: "O(1)",
    },
    pop: {
      time: "O(1)",
      space: "O(1)",
    },
    peek: {
      time: "O(1)",
      space: "O(1)",
    },
    search: {
      time: "O(n)",
      space: "O(1)",
    },
  };

  const currentComplexity =
    complexity || stackComplexities[operation] || {
      time: "—",
      space: "—",
    };

  return (
    <section className="panel">
      <h3>04　Complexity</h3>

      <div className="complex">
        <div>
          <small>Time</small>
          <b>{currentComplexity.time}</b>
        </div>

        <div>
          <small>Space</small>
          <b>{currentComplexity.space}</b>
        </div>
      </div>

      <p className="hint">
        Complexity depends on the operation being performed.
      </p>
    </section>
  );
}