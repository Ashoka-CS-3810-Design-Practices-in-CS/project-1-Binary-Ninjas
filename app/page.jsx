
"use client";

import { useState } from "react";

import DataStructureSelector from "../components/DataStructureSelector";
import InputPanel from "../components/InputPanel";
import PlaybackControls from "../components/PlaybackControls";
import ComplexityPanel from "../components/ComplexityPanel";
import PseudocodePanel from "../components/PseudocodePanel";
import StepDescription from "../components/StepDescription";

import AnimationController from "../components/animation/AnimationController";

import LinkedListVisualizer from "../components/visualizers/LinkedListVisualizer";
import StackVisualizer from "../components/visualizers/StackVisualizer";
import QueueVisualizer from "../components/visualizers/QueueVisualizer";
import BinaryTreeVisualizer from "../components/visualizers/BinaryTreeVisualizer";
import GraphVisualizer from "../components/visualizers/GraphVisualizer";
import HeapVisualizer from "../components/visualizers/HeapVisualizer";

const views = {
  "Linked List": LinkedListVisualizer,
  Stack: StackVisualizer,
  Queue: QueueVisualizer,
  "Binary Tree": BinaryTreeVisualizer,   
  Graph: GraphVisualizer,
  Heap: HeapVisualizer,
};

export default function Home() {
  const [type, setType] = useState("Stack");
  const [data, setData] = useState([10, 20, 30]);

  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);

  const [playing, setPlaying] = useState(false);
  const [direction, setDirection] = useState(1);
  const [speed, setSpeed] = useState(1);

  const [operation, setOperation] = useState("");
  const [complexity, setComplexity] = useState({
    time: "—",
    space: "—",
  });
  const [code, setCode] = useState([]);

  const View = views[type];
  const step = steps[index] || null;

  const visualData =
    step && Array.isArray(step.state) ? step.state : data;

  function resetPlayback() {
    setPlaying(false);
    setDirection(1);
    setIndex(0);
  }

  function choose(t) {
    setType(t);

    setData(
      t === "Graph"
        ? {
            vertices: ["A", "B", "C", "D"],
            edges: [
              ["A", "B"],
              ["A", "C"],
              ["B", "D"],
            ],
          }
        : [10, 20, 30]
    );

    setSteps([]);
    setOperation("");
    setIndex(0);
    setPlaying(false);
    setDirection(1);
    setCode([]);
    setComplexity({ time: "—", space: "—" });
  }

  function run(op, input) {
    console.log("RUN CALLED:", { op, input, data });

  // Your existing code continues here...
    resetPlayback();
    setOperation(op);

    // STACK OPERATIONS
    if (type === "Stack") {
      const oldData = [...data];
      const value = Number(input);

      // PUSH
      if (op === "Push") {
        if (
          typeof input !== "string" ||
          input.trim() === "" ||
          !Number.isFinite(value)
        ) {
          return;
        }

        const newData = [...oldData, value];

        setData(newData);

        setSteps([
          {
            title: "Ready to push",
            description: `Prepare to push ${value} onto the stack.`,
            state: oldData,
            activeIndex: -1,
            highlight: "",
          },
          {
            title: `Push ${value}`,
            description: `${value} is added to the top of the stack.`,
            state: newData,
            activeIndex: newData.length - 1,
            highlight: "added",
          },
        ]);

        setIndex(0);

        setCode([
          "push(value):",
          "  add value to the top",
          "  update the stack",
        ]);

        setComplexity({
          time: "O(1)",
          space: "O(1)",
        });

        return;
      }

      // POP
      if (op === "Pop") {
        if (oldData.length === 0) {
          setSteps([
            {
              title: "Stack is empty",
              description: "Cannot pop from an empty stack.",
              state: oldData,
              activeIndex: -1,
              highlight: "",
            },
          ]);
          return;
        }

        const topIndex = oldData.length - 1;
        const removed = oldData[topIndex];
        const newData = oldData.slice(0, -1);

        setData(newData);

        setSteps([
          {
            title: `Remove ${removed}`,
            description: `${removed} is the top element and is about to be removed.`,
            state: oldData,
            activeIndex: topIndex,
            highlight: "removing",
          },
          {
            title: `Popped ${removed}`,
            description: `${removed} has been removed from the stack.`,
            state: newData,
            activeIndex: -1,
            highlight: "",
          },
        ]);

        setIndex(0);

        setCode([
          "pop():",
          "  remove the top element",
          "  return removed element",
        ]);

        setComplexity({
          time: "O(1)",
          space: "O(1)",
        });

        return;
      }

      // PEEK
      if (op === "Peek") {
        if (oldData.length === 0) {
          setSteps([
            {
              title: "Stack is empty",
              description: "There is no top element to peek at.",
              state: oldData,
              activeIndex: -1,
              highlight: "",
            },
          ]);
          return;
        }

        const topIndex = oldData.length - 1;

        setSteps([
          {
            title: "Peek at top",
            description: `The top element is ${oldData[topIndex]}. The stack remains unchanged.`,
            state: oldData,
            activeIndex: topIndex,
            highlight: "active",
          },
        ]);

        setIndex(0);

        setCode([
          "peek():",
          "  return the top element",
          "  do not remove it",
        ]);

        setComplexity({
          time: "O(1)",
          space: "O(1)",
        });

        return;
      }

      // SEARCH
      if (op === "Search") {
        if (
          input.trim() === "" ||
          !Number.isFinite(value)
        ) {
          return;
        }

        const searchSteps = [];
        const foundIndex = oldData.lastIndexOf(value);

        for (let i = oldData.length - 1; i >= 0; i--) {
          const found = oldData[i] === value;

          searchSteps.push({
            title: found
              ? `Found ${value}`
              : `Checking ${oldData[i]}`,
            description: found
              ? `${value} was found at index ${i}.`
              : `Checking whether ${oldData[i]} equals ${value}.`,
            state: oldData,
            activeIndex: i,
            highlight: found ? "found" : "checking",
          });

          if (found) break;
        }

        if (oldData.length === 0) {
          searchSteps.push({
            title: "Stack is empty",
            description: "There are no elements to search.",
            state: oldData,
            activeIndex: -1,
            highlight: "",
          });
        } else if (foundIndex === -1) {
          searchSteps.push({
            title: `${value} not found`,
            description: `${value} is not present in the stack.`,
            state: oldData,
            activeIndex: -1,
            highlight: "",
          });
        }

        setSteps(searchSteps);
        setIndex(0);

        setCode([
          "search(value):",
          "  check each element",
          "  if element equals value:",
          "    return found",
          "  return not found",
        ]);

        setComplexity({
          time: "O(n)",
          space: "O(1)",
        });

        return;
      }
    }

    // OTHER DATA STRUCTURES
    let next = Array.isArray(data) ? [...data] : data;
    const n = Number(input);

    // GRAPH
    if (type === "Graph") {
      if (op === "Randomize") {
        next = {
          vertices: ["A", "B", "C", "D", "E"],
          edges: [
            ["A", "B"],
            ["A", "C"],
            ["B", "D"],
            ["C", "E"],
            ["D", "E"],
          ],
        };
      }

      if (op === "Add vertex") {
        const vertex = input.trim();

        if (!vertex || data.vertices.includes(vertex)) {
          return;
        }

        next = {
          ...data,
          vertices: [...data.vertices, vertex],
        };
      }

      if (op === "Add edge") {
        const [a, b] = input.split(",").map((x) => x.trim());

        if (
          !a ||
          !b ||
          !data.vertices.includes(a) ||
          !data.vertices.includes(b)
        ) {
          return;
        }

        next = {
          ...data,
          edges: [...data.edges, [a, b]],
        };
      }

      if (op === "BFS" || op === "DFS") {
        const order =
          op === "BFS"
            ? data.vertices
            : [...data.vertices].reverse();

        setSteps(
          order.map((v, i) => ({
            title: `${op}: visit ${v}`,
            description: `Visiting vertex ${v}.`,
            state: {
              ...data,
              current: v,
              visited: order.slice(0, i + 1),
            },
          }))
        );

        setIndex(0);

        setCode([
          `initialize ${op === "BFS" ? "queue" : "stack"}`,
          "while structure is not empty",
          "  process next vertex",
          "  discover unvisited neighbours",
        ]);

        setComplexity({
          time: "O(V + E)",
          space: "O(V)",
        });

        return;
      }
    }

    // SEARCH FOR OTHER STRUCTURES
    else if (op === "Search") {
      if (
        input.trim() === "" ||
        !Number.isFinite(n)
      ) {
        return;
      }

      const found = next.includes(n);

      setSteps([
        {
          title: found ? `Found ${n}` : `${n} not found`,
          description: "Demo search result.",
          state: data,
        },
      ]);

      setIndex(0);

      setCode([
        "for each element",
        "  compare with target",
        "return result",
      ]);

      setComplexity({
        time:
          type === "Binary Tree"
            ? "O(log n) average, O(n) worst"
            : "O(n)",
        space: "O(1)",
      });

      return;
    }

    // INSERT AND ENQUEUE
    else if (op === "Insert" || op === "Enqueue") {
      if (
        input.trim() === "" ||
        !Number.isFinite(n)
      ) {
        return;
      }

      next = [...next, n];
    }

    // DELETE
    else if (op === "Delete") {
      if (
        input.trim() === "" ||
        !Number.isFinite(n)
      ) {
        return;
      }

      next = next.filter((x) => x !== n);
    }

    // DEQUEUE AND EXTRACT ROOT
    else if (["Dequeue", "Extract root"].includes(op)) {
      next = next.slice(0, -1);
    }

    setData(next);

    setSteps([
      {
        title: `${op} completed`,
        description: `${type} updated using local demo data.`,
        state: next,
      },
    ]);

    setIndex(0);

    setCode([
      `${op.toLowerCase()} operation`,
      "update data structure",
      "update visualization",
    ]);

    setComplexity({
      time: ["Stack", "Queue"].includes(type)
        ? "O(1)"
        : type === "Binary Tree"
          ? "O(log n) average, O(n) worst"
          : "O(n)",
      space: "O(1)",
    });
  }

  function randomize() {
    if (type === "Graph") {
      run("Randomize", "");
      return;
    }

    resetPlayback();

    setData(
      Array.from(
        { length: 6 },
        () => Math.floor(Math.random() * 90) + 10
      )
    );

    setSteps([]);
  }

  return (
    <main className="shell">
      <header>
        <div className="logo">DS</div>

        <div>
          <h1>DSA Visualizer</h1>
          <p>Explore data structures, one step at a time.</p>
        </div>

        <span className="tag">Frontend demo</span>
      </header>

      <div className="layout">
        <aside>
          <DataStructureSelector
            value={type}
            onChange={choose}
          />

          <InputPanel
            structure={type}
            onRun={run}
            onRandomize={randomize}
          />

          <ComplexityPanel complexity={complexity} />
        </aside>

        <section className="main">
          <div className="heading">
            <div>
              <small>VISUALIZATION CANVAS</small>
              <h2>{type}</h2>
            </div>

            <span className="ready">● Ready</span>
          </div>

          <div className="canvas">
            <View
              data={visualData}
              currentStep={step}
            />
          </div>

          <AnimationController
            playing={playing}
            setPlaying={setPlaying}
            stepIndex={index}
            setStepIndex={setIndex}
            totalSteps={steps.length}
            speed={speed}
            direction={direction}
          />

          <PlaybackControls
            steps={steps}
            stepIndex={index}
            setStepIndex={setIndex}
            speed={speed}
            setSpeed={setSpeed}
            playing={playing}
            setPlaying={setPlaying}
            setDirection={setDirection}
          />

          <div className="bottom">
            <StepDescription step={step} />
            <PseudocodePanel lines={code} />
          </div>
        </section>
      </div>

      <footer>
        DSA Visualizer · Interactive learning environment
      </footer>
    </main>
  );
}