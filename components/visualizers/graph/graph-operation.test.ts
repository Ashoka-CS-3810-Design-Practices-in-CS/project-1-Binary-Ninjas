
import { describe, it, expect } from "vitest";
import {
  addVertex,
  removeVertex,
  addEdge,
  removeEdge,
  searchVertex,
  bfs,
  dfs,
  getNeighbors,
  clearGraph,
} from "./graph-operation";

describe("graph operations", () => {
  const makeGraph = () => {
    let graph = clearGraph();

    graph = addVertex(graph, 10, 1, 100, 100);
    graph = addVertex(graph, 20, 2, 200, 100);
    graph = addVertex(graph, 30, 3, 300, 100);
    graph = addVertex(graph, 40, 4, 400, 100);

    graph = addEdge(graph, 10, 20);
    graph = addEdge(graph, 10, 30);
    graph = addEdge(graph, 20, 40);

    return graph;
  };

  it("creates an empty graph", () => {
    expect(clearGraph()).toEqual({ nodes: [], edges: [] });
  });

  it("adds a vertex with its coordinates", () => {
    const graph = addVertex(clearGraph(), 10, 1, 50, 60);

    expect(graph.nodes).toEqual([
      { id: 1, value: 10, x: 50, y: 60 },
    ]);
    expect(graph.edges).toEqual([]);
  });

  it("rejects duplicate vertex values", () => {
    const graph = addVertex(clearGraph(), 10, 1, 50, 60);

    expect(() => addVertex(graph, 10, 2)).toThrow(
      "Vertex 10 already exists."
    );
  });

  it("finds existing vertices", () => {
    const graph = makeGraph();

    expect(searchVertex(graph, 20)?.id).toBe(2);
    expect(searchVertex(graph, 99)).toBeUndefined();
  });

  it("adds an edge with its default weight", () => {
    const graph = makeGraph();

    expect(graph.edges).toContainEqual({
      source: 1,
      target: 2,
      weight: 1,
    });
  });

  it("supports a custom edge weight", () => {
    let graph = clearGraph();
    graph = addVertex(graph, 10, 1, 0, 0);
    graph = addVertex(graph, 20, 2, 1, 1);
    graph = addEdge(graph, 10, 20, 5);

    expect(graph.edges[0].weight).toBe(5);
  });

  it("rejects edges with missing vertices", () => {
    const graph = addVertex(clearGraph(), 10, 1, 0, 0);

    expect(() => addEdge(graph, 99, 10)).toThrow(
      "Vertex 99 was not found."
    );
    expect(() => addEdge(graph, 10, 99)).toThrow(
      "Vertex 99 was not found."
    );
  });

  it("rejects self-loops and duplicate edges", () => {
    const graph = makeGraph();

    expect(() => addEdge(graph, 10, 10)).toThrow(
      "Self-loops are not allowed."
    );
    expect(() => addEdge(graph, 20, 10)).toThrow(
      "An edge between these vertices already exists."
    );
  });

  it("returns neighbors sorted by vertex value", () => {
    const graph = makeGraph();

    expect(getNeighbors(graph, 1)).toEqual([2, 3]);
    expect(getNeighbors(graph, 4)).toEqual([2]);
    expect(getNeighbors(graph, 999)).toEqual([]);
  });

  it("performs breadth-first search", () => {
    expect(bfs(makeGraph(), 10)).toEqual([10, 20, 30, 40]);
  });

  it("performs depth-first search", () => {
    expect(dfs(makeGraph(), 10)).toEqual([10, 20, 40, 30]);
  });

  it("rejects searches starting at a missing vertex", () => {
    const graph = makeGraph();

    expect(() => bfs(graph, 99)).toThrow(
      "Starting vertex 99 was not found."
    );
    expect(() => dfs(graph, 99)).toThrow(
      "Starting vertex 99 was not found."
    );
  });

  it("visits only reachable vertices in a disconnected graph", () => {
    let graph = clearGraph();
    graph = addVertex(graph, 10, 1, 0, 0);
    graph = addVertex(graph, 20, 2, 1, 1);
    graph = addVertex(graph, 30, 3, 2, 2);
    graph = addEdge(graph, 10, 20);

    expect(bfs(graph, 10)).toEqual([10, 20]);
    expect(dfs(graph, 10)).toEqual([10, 20]);
  });

  it("removes an edge", () => {
    const result = removeEdge(makeGraph(), 10, 20);

    expect(result.edges).toHaveLength(2);
    expect(getNeighbors(result, 1)).toEqual([3]);
  });

  it("removes an edge regardless of argument order", () => {
    const result = removeEdge(makeGraph(), 20, 10);

    expect(result.edges).toHaveLength(2);
  });

  it("rejects removal of a missing edge", () => {
    expect(() => removeEdge(makeGraph(), 10, 40)).toThrow();
  });

  it("removes a vertex and its connected edges", () => {
    const result = removeVertex(makeGraph(), 20);

    expect(searchVertex(result, 20)).toBeUndefined();
    expect(result.edges).toHaveLength(1);
    expect(result.edges).not.toContainEqual(
      expect.objectContaining({ source: 2 })
    );
    expect(result.edges).not.toContainEqual(
      expect.objectContaining({ target: 2 })
    );
  });

  it("rejects removal of a missing vertex", () => {
    expect(() => removeVertex(makeGraph(), 99)).toThrow(
      "Vertex 99 was not found."
    );
  });

  it("does not mutate the original graph", () => {
    const graph = makeGraph();
    const original = JSON.parse(JSON.stringify(graph));

    addVertex(graph, 50, 5, 500, 100);
    addEdge(graph, 30, 40);
    removeEdge(graph, 10, 20);
    removeVertex(graph, 20);

    expect(graph).toEqual(original);
  });
});
