"use client";

import { useState } from "react";

import DataStructureSelector from "../components/DataStructureSelector";
import InputPanel from "../components/InputPanel";
import PlaybackControls from "../components/PlaybackControls";
import ComplexityPanel from "../components/ComplexityPanel";
import PseudocodePanel from "../components/PseudocodePanel";
import StepDescription from "../components/StepDescription";

// IMPORTANT:
// You said the animation folder is OUTSIDE components.
// If your structure is:
// app/
// components/
// animation/
// then this is the correct import.
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

  // Animation steps
  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);

  // Playback
  const [playing, setPlaying] = useState(false);
  const [direction, setDirection] = useState(1);
  const [speed, setSpeed] = useState(1);

  // Operation information
  const [operation, setOperation] = useState("");

  const [complexity, setComplexity] = useState({
    time: "—",
    space: "—",
  });

  const [code, setCode] = useState([]);

  const View = views[type];

  // Current animation step
  const step = steps[index] || null;

  /*
   * IMPORTANT:
   *
   * The visualizer follows the current playback step.
   *
   * After an operation is performed, we set index to the
   * FINAL step immediately.
   *
   * This means the data changes immediately.
   *
   * The user can still use playback controls afterwards
   * to watch the operation from the beginning.
   */
  const visualData =
    step && step.state !== undefined ? step.state : data;

  /*
   * Reset playback to the beginning.
   *
   * This is used when changing data structures or starting
   * a fresh randomization.
   */
  function resetPlayback() {
    setPlaying(false);
    setDirection(1);
    setIndex(0);
  }

  /*
   * Change data structure.
   */
  function choose(t) {
    setType(t);

    const initialData =
      t === "Graph"
        ? {
            vertices: ["A", "B", "C", "D"],
            edges: [
              ["A", "B"],
              ["A", "C"],
              ["B", "D"],
            ],
          }
        : [10, 20, 30];

    setData(initialData);

    setSteps([]);
    setOperation("");

    // No old animation should remain.
    setIndex(0);

    setPlaying(false);
    setDirection(1);

    setCode([]);

    setComplexity({
      time: "—",
      space: "—",
    });
  }

  /*
   * RUN OPERATION
   */
  function run(op, input) {
    console.log("RUN CALLED:", {
      operation: op,
      input,
      currentData: data,
    });

    // Stop any currently playing animation.
    setPlaying(false);
    setDirection(1);

    setOperation(op);

    // ============================================================
    // STACK
    // ============================================================

    if (type === "Stack") {
      const oldData = [...data];
      const value = Number(input);

      // ----------------------------------------------------------
      // PUSH
      // ----------------------------------------------------------

      if (op === "Push") {
        if (
          typeof input !== "string" ||
          input.trim() === "" ||
          !Number.isFinite(value)
        ) {
          return;
        }

        const newData = [...oldData, value];

        /*
         * Create the steps FIRST.
         *
         * This is important because we cannot rely on the old
         * `steps` state immediately after calling setSteps().
         */
        const newSteps = [
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
        ];

        // Update actual data immediately.
        setData(newData);

        // Save animation.
        setSteps(newSteps);

        /*
         * IMPORTANT:
         *
         * Show the FINAL step immediately.
         *
         * We use newSteps.length - 1, NOT steps.length - 1.
         */
        setIndex(newSteps.length - 1);

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

      // ----------------------------------------------------------
      // POP
      // ----------------------------------------------------------

      if (op === "Pop") {
        if (oldData.length === 0) {
          const newSteps = [
            {
              title: "Stack is empty",
              description: "Cannot pop from an empty stack.",
              state: oldData,
              activeIndex: -1,
              highlight: "",
            },
          ];

          setSteps(newSteps);
          setIndex(0);

          return;
        }

        const topIndex = oldData.length - 1;
        const removed = oldData[topIndex];
        const newData = oldData.slice(0, -1);

        const newSteps = [
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
        ];

        setData(newData);
        setSteps(newSteps);

        // Immediately show the final stack.
        setIndex(newSteps.length - 1);

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

      // ----------------------------------------------------------
      // PEEK
      // ----------------------------------------------------------

      if (op === "Peek") {
        if (oldData.length === 0) {
          const newSteps = [
            {
              title: "Stack is empty",
              description: "There is no top element to peek at.",
              state: oldData,
              activeIndex: -1,
              highlight: "",
            },
          ];

          setSteps(newSteps);
          setIndex(0);

          return;
        }

        const topIndex = oldData.length - 1;

        const newSteps = [
          {
            title: "Peek at top",
            description: `The top element is ${oldData[topIndex]}. The stack remains unchanged.`,
            state: oldData,
            activeIndex: topIndex,
            highlight: "active",
          },
        ];

        setSteps(newSteps);
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

      // ----------------------------------------------------------
      // SEARCH
      // ----------------------------------------------------------

      if (op === "Search") {
        if (
          typeof input !== "string" ||
          input.trim() === "" ||
          !Number.isFinite(value)
        ) {
          return;
        }

        const searchSteps = [];

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

            highlight: found
              ? "found"
              : "checking",
          });

          if (found) {
            break;
          }
        }

        if (oldData.length === 0) {
          searchSteps.push({
            title: "Stack is empty",
            description: "There are no elements to search.",
            state: oldData,
            activeIndex: -1,
            highlight: "",
          });
        } else if (!oldData.includes(value)) {
          searchSteps.push({
            title: `${value} not found`,
            description: `${value} is not present in the stack.`,
            state: oldData,
            activeIndex: -1,
            highlight: "",
          });
        }

        setSteps(searchSteps);

        /*
         * Immediately show the LAST search step.
         *
         * This means the user sees the result immediately.
         *
         * They can then press Replay/Play to watch:
         *
         * 30 → 20 → 10 → Found
         */
        setIndex(searchSteps.length - 1);

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

    // ============================================================
    // OTHER DATA STRUCTURES
    // ============================================================

    let next = Array.isArray(data)
      ? [...data]
      : data;

    const n = Number(input);

    // ============================================================
    // GRAPH
    // ============================================================

    if (type === "Graph") {
      // ----------------------------------------------------------
      // RANDOMIZE
      // ----------------------------------------------------------

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

      // ----------------------------------------------------------
      // ADD VERTEX
      // ----------------------------------------------------------

      if (op === "Add vertex") {
        const vertex = input.trim();

        if (
          !vertex ||
          data.vertices.includes(vertex)
        ) {
          return;
        }

        next = {
          ...data,
          vertices: [
            ...data.vertices,
            vertex,
          ],
        };
      }

      // ----------------------------------------------------------
      // ADD EDGE
      // ----------------------------------------------------------

      if (op === "Add edge") {
        const [a, b] = input
          .split(",")
          .map((x) => x.trim());

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

          edges: [
            ...data.edges,
            [a, b],
          ],
        };
      }

      // ----------------------------------------------------------
      // BFS / DFS
      // ----------------------------------------------------------

      if (op === "BFS" || op === "DFS") {
        const order =
          op === "BFS"
            ? data.vertices
            : [...data.vertices].reverse();

        const newSteps = order.map(
          (vertex, i) => ({
            title: `${op}: visit ${vertex}`,

            description: `Visiting vertex ${vertex}.`,

            state: {
              ...data,

              current: vertex,

              visited: order.slice(
                0,
                i + 1
              ),
            },

            activeIndex: i,
          })
        );

        setSteps(newSteps);

        // Immediately show final state.
        setIndex(newSteps.length - 1);

        setCode([
          `initialize ${
            op === "BFS"
              ? "queue"
              : "stack"
          }`,
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

    // ============================================================
    // SEARCH FOR OTHER STRUCTURES
    // ============================================================

    else if (op === "Search") {
      if (
        typeof input !== "string" ||
        input.trim() === "" ||
        !Number.isFinite(n)
      ) {
        return;
      }

      const found = next.includes(n);

      const newSteps = [
        {
          title: found
            ? `Found ${n}`
            : `${n} not found`,

          description: found
            ? `${n} exists in the ${type}.`
            : `${n} does not exist in the ${type}.`,

          state: data,

          activeIndex: found
            ? next.indexOf(n)
            : -1,

          highlight: found
            ? "found"
            : "",
        },
      ];

      setSteps(newSteps);

      setIndex(newSteps.length - 1);

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

    // ============================================================
    // INSERT / ENQUEUE
    // ============================================================

    else if (
      op === "Insert" ||
      op === "Enqueue"
    ) {
      if (
        typeof input !== "string" ||
        input.trim() === "" ||
        !Number.isFinite(n)
      ) {
        return;
      }

      next = [
        ...next,
        n,
      ];
    }

    // ============================================================
    // DELETE
    // ============================================================

    else if (op === "Delete") {
      if (
        typeof input !== "string" ||
        input.trim() === "" ||
        !Number.isFinite(n)
      ) {
        return;
      }

      next = next.filter(
        (x) => x !== n
      );
    }

    // ============================================================
    // DEQUEUE / EXTRACT ROOT
    // ============================================================

    else if (
      op === "Dequeue" ||
      op === "Extract root"
    ) {
      if (next.length === 0) {
        const newSteps = [
          {
            title: `${type} is empty`,
            description: `Cannot perform ${op.toLowerCase()} on an empty structure.`,
            state: next,
          },
        ];

        setSteps(newSteps);
        setIndex(0);

        return;
      }

      next = next.slice(0, -1);
    }

    // ============================================================
    // FINAL UPDATE FOR OTHER STRUCTURES
    // ============================================================

    setData(next);

    const newSteps = [
      {
        title: `${op} completed`,

        description:
          `${type} updated successfully.`,

        state: next,

        activeIndex:
          next.length - 1,

        highlight: "added",
      },
    ];

    setSteps(newSteps);

    // Immediately show updated data.
    setIndex(newSteps.length - 1);

    setCode([
      `${op.toLowerCase()} operation`,
      "update data structure",
      "update visualization",
    ]);

    setComplexity({
<<<<<<< HEAD
      time: ["Stack", "Queue"].includes(type)
        ? "O(1)"
        : type === "Binary Tree"
          ? "O(log n) average, O(n) worst"
          : "O(n)",
=======
      time:
        ["Stack", "Queue"].includes(type)
          ? "O(1)"
          : type === "Binary Tree"
            ? "O(log n) average, O(n) worst"
            : "O(n)",

>>>>>>> 547d38a8fddbbdc024566ac5c8853008ff47478a
      space: "O(1)",
    });
  }

  // ============================================================
  // RANDOMIZE
  // ============================================================

  function randomize() {
    if (type === "Graph") {
      run("Randomize", "");
      return;
    }

    setPlaying(false);
    setDirection(1);

    const randomData = Array.from(
      { length: 6 },
      () =>
        Math.floor(
          Math.random() * 90
        ) + 10
    );

    setData(randomData);

    setSteps([]);

    setIndex(0);
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="shell">

      {/* HEADER */}
      <header className="topbar">

        <div className="logo">
          BN
        </div>

        <div>
          <h1>
            Binary Ninja
          </h1>

          <p>
            Interactive Data Structures & Algorithms
          </p>
        </div>

        <span className="tag">
          ● Ready
        </span>

      </header>


      {/* MAIN LAYOUT */}
      <div className="layout">

        {/* SIDEBAR */}
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

          <ComplexityPanel
            complexity={complexity}
          />

        </aside>


        {/* MAIN VISUALIZATION */}
        <section className="main">

          {/* HEADING */}
          <div className="heading">

            <div>

              <small>
                VISUALIZATION CANVAS
              </small>

              <h2>
                {type}
              </h2>

            </div>

            <span className="ready">
              ● Ready
            </span>

          </div>


          {/* CANVAS */}
          <div className="canvas">

            <View
              data={visualData}
              currentStep={step}
            />

          </div>


          {/* AUTOMATIC ANIMATION CONTROLLER */}
          <AnimationController
            playing={playing}
            setPlaying={setPlaying}
            stepIndex={index}
            setStepIndex={setIndex}
            totalSteps={steps.length}
            speed={speed}
            direction={direction}
          />


          {/* PLAYBACK */}
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


          {/* DESCRIPTION + PSEUDOCODE */}
          <div className="bottom">

            <StepDescription
              step={step}
            />

            <PseudocodePanel
              lines={code}
            />

          </div>

        </section>

      </div>


      {/* FOOTER */}
      <footer>
        Binary Ninja · Interactive learning environment
      </footer>

    </main>
  );
}