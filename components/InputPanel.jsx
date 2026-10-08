"use client";
import { useState, useEffect } from "react";

const ops = {
  "Linked List": ["Insert", "Delete", "Search"],
  Stack: ["Push", "Pop", "Search"],
  Queue: ["Enqueue", "Dequeue", "Search"],
  "Binary Tree": ["Insert", "Delete", "Search"],
  Graph: ["Add vertex", "Add edge", "BFS", "DFS", "Randomize"],
  Heap: ["Insert", "Extract root", "Search"],
};

export default function InputPanel({ structure, onRun, onRandomize }) {
  const list = ops[structure] || [];
  const [op, setOp] = useState(list[0] || "");
  const [value, setValue] = useState("");

  useEffect(() => {
    setOp((ops[structure] || [])[0] || "");
    setValue("");
  }, [structure]);

  const needs = !["Pop", "Dequeue", "Extract root", "BFS", "DFS", "Randomize"].includes(op);

  return (
    <section className="panel">
      <h3>02　Operation</h3>

      <label>Choose operation</label>
      <select value={op} onChange={(e) => setOp(e.target.value)}>
        {list.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>

      {needs && (
        <>
          <label>
            {structure === "Graph"
              ? op === "Add edge"
                ? "Edge (A,B)"
                : "Vertex label"
              : "Value"}
          </label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={structure === "Graph" ? "e.g. A or A,B" : "Enter a value"}
          />
        </>
      )}

      <button className="primary" onClick={() => onRun(op, value)}>
        Run {op}
      </button>
      <button className="secondary" onClick={onRandomize}>
        Generate random data
      </button>

      <p className="hint">Local demo only; backend can be connected later.</p>
    </section>
  );
}