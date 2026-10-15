
import { describe, it, expect } from "vitest";
import {
  insertHeap,
  deleteMin,
  searchHeap,
  getMin,
} from "./heap-operation";

describe("min-heap operations", () => {
  const makeHeap = () => {
    let heap = insertHeap([], 10, 1);
    heap = insertHeap(heap, 5, 2);
    heap = insertHeap(heap, 20, 3);
    heap = insertHeap(heap, 3, 4);
    heap = insertHeap(heap, 8, 5);
    return heap;
  };

  const expectMinHeap = (
    heap: { id: number; value: number }[]
  ) => {
    for (let i = 1; i < heap.length; i++) {
      const parent = Math.floor((i - 1) / 2);
      expect(heap[parent].value).toBeLessThanOrEqual(
        heap[i].value
      );
    }
  };

  it("inserts into an empty heap", () => {
    expect(insertHeap([], 10, 1)).toEqual([
      { id: 1, value: 10 },
    ]);
  });

  it("maintains min-heap ordering after insertion", () => {
    expectMinHeap(makeHeap());
    expect(getMin(makeHeap())).toBe(3);
  });

  it("moves a smaller value toward the root", () => {
    const heap = insertHeap(
      insertHeap([], 10, 1),
      2,
      2
    );

    expect(heap[0].value).toBe(2);
    expectMinHeap(heap);
  });

  it("returns the minimum element", () => {
    expect(getMin(makeHeap())).toBe(3);
  });

  it("throws when getting the minimum of an empty heap", () => {
    expect(() => getMin([])).toThrow(
      "Cannot get the minimum of an empty heap."
    );
  });

  it("deletes the only element", () => {
    expect(deleteMin([{ id: 1, value: 10 }])).toEqual([]);
  });

  it("throws when deleting from an empty heap", () => {
    expect(() => deleteMin([])).toThrow(
      "Cannot delete from an empty heap."
    );
  });

  it("removes the minimum and restores heap ordering", () => {
    const heap = makeHeap();
    const result = deleteMin(heap);

    expect(getMin(result)).toBe(5);
    expectMinHeap(result);
  });

  it("extracts elements in ascending order", () => {
    let heap = makeHeap();
    const extracted: number[] = [];

    while (heap.length > 0) {
      extracted.push(getMin(heap));
      heap = deleteMin(heap);
    }

    expect(extracted).toEqual([3, 5, 8, 10, 20]);
  });

  it("searches for existing and missing values", () => {
    const heap = makeHeap();

    expect(searchHeap(heap, 10)).not.toBe(-1);
    expect(searchHeap(heap, 3)).not.toBe(-1);
    expect(searchHeap(heap, 99)).toBe(-1);
    expect(searchHeap([], 10)).toBe(-1);
  });

  it("supports duplicate values", () => {
    let heap = insertHeap([], 5, 1);
    heap = insertHeap(heap, 5, 2);
    heap = insertHeap(heap, 3, 3);

    expect(getMin(heap)).toBe(3);
    expectMinHeap(heap);

    heap = deleteMin(heap);
    expect(getMin(heap)).toBe(5);

    heap = deleteMin(heap);
    expect(getMin(heap)).toBe(5);
  });

  it("handles negative, zero, and decimal values", () => {
    let heap = insertHeap([], 0, 1);
    heap = insertHeap(heap, -5, 2);
    heap = insertHeap(heap, 2.5, 3);

    expect(getMin(heap)).toBe(-5);
    expectMinHeap(heap);
  });

  it("does not mutate the original heap", () => {
    const heap = makeHeap();
    const original = heap.map((node) => ({ ...node }));

    insertHeap(heap, 1, 10);
    deleteMin(heap);

    expect(heap).toEqual(original);
  });
});
