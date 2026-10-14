# Binary Ninjas — Data Structure Visualizer

An interactive, web-based platform for visualizing fundamental data structures and understanding how their operations work through step-by-step animations, algorithm explanations, and complexity analysis.

## Overview

**Binary Ninjas: Data Structure Visualizer (BN_DSV)** is designed to make learning data structures and algorithms more intuitive and accessible. Instead of relying only on static diagrams or theoretical explanations, users can interact with data structures, execute operations, and observe how their internal states change.

The platform combines visual learning with algorithmic understanding by connecting operations to their implementations, pseudocode, and time and space complexity.

## Features

- **Interactive Visualizations:** Explore data structures through dynamic, step-by-step visual representations.
- **Multiple Data Structures:** Work with stacks, queues, linked lists, binary search trees, graphs, and heaps/priority queues.
- **Operation-Based Interaction:** Select operations and observe how they modify the underlying data structure.
- **Algorithm Explanations:** Understand the logic behind operations through pseudocode and implementation details.
- **Complexity Analysis:** Learn the time and space complexity associated with different operations.
- **Step-by-Step Animations:** Follow changes in the data structure as operations are executed.
- **Intuitive Navigation:** Switch between different visualizers through a unified interface designed to support experimentation and conceptual understanding.

## Data Structures

| Data Structure | Concepts and Operations |
|---|---|
| Stack | Push, pop, peek, and last-in-first-out (LIFO) behaviour |
| Queue | Enqueue, dequeue, front, and first-in-first-out (FIFO) behaviour |
| Linked List | Node connections, insertion, deletion, and traversal |
| Binary Search Tree | Node insertion, searching, deletion, and tree traversal |
| Graph | Vertices, edges, graph representation, and traversal |
| Heap / Priority Queue | Heap structure, priority-based operations, insertion, and removal |

*Available operations may vary by visualizer and implementation.*

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Web application framework and routing |
| React | Component-based user interface |
| TypeScript | Type-safe application development |
| Tailwind CSS | Styling and responsive layouts |
| shadcn/ui | Reusable interface components |
| Framer Motion | Animations and transitions |
| React Flow | Graph-based visual representations |

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Ensure that the following are installed:

- [Node.js](https://nodejs.org/) — a compatible version for the project
- npm — included with Node.js
- Git

### Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/HB2006/BN_DSV.git
```

**2. Navigate to the project directory**

```bash
cd BN_DSV
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Visit [http://localhost:3000](http://localhost:3000) in your browser to access the Data Structure Visualizer.

To stop the development server, press `Ctrl + C` in the terminal.

## Project Structure

The repository is organized into the following major directories and configuration files:

```text
BN_DSV/
├── Apps/                 # Application routes and pages
├── Backend/              # Backend-related functionality
├── components/           # UI and visualizer components
├── content/              # Supporting learning content
├── hooks/                # Custom React hooks
├── lib/                  # Shared utilities and helpers
├── components.json       # UI component configuration
├── package.json          # Project scripts and dependencies
├── package-lock.json     # Dependency lockfile
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## How to Use

1. Launch the application in your browser.
2. Navigate to the data structure you want to explore.
3. Select an available operation.
4. Provide the required input, if applicable.
5. Execute the operation and observe the resulting visualization.
6. Refer to the accompanying pseudocode and complexity analysis to understand how the algorithm works.
7. Experiment with different operations to explore their behaviour and performance.

## Learning Objectives

The project aims to help users:

- Develop a stronger understanding of fundamental data structures and algorithms.
- Visualize how operations affect nodes, pointers, elements, and connections.
- Connect theoretical concepts with practical implementations.
- Understand the trade-offs between different data structures.
- Build intuition about time and space complexity.
- Learn through experimentation and interactive visual feedback.

---

**Repository:** [HB2006/BN_DSV](https://github.com/HB2006/BN_DSV)
