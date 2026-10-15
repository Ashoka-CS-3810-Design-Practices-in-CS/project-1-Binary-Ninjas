import { describe, it, expect } from "vitest";
import { enqueue, dequeue, peekQueue, clearQueue } from "./queue-operation";

// Helper: build a queue by enqueueing values in order, ids 1, 2, 3...
const build = (...values: number[]) =>
  values.reduce<ReturnType<typeof enqueue>>(
    (q, v, i) => enqueue(q, v, i + 1),
    []
  );

describe("queue: normal behaviour", () => {
  it("enqueue adds to an empty queue", () => {
    const q = enqueue([], 10, 1);
    expect(q).toHaveLength(1);
    expect(peekQueue(q)).toBe(10);
  });

  it("enqueue adds to the back, peek still shows the front", () => {
    const q = build(10, 20, 30);
    expect(q).toHaveLength(3);
    expect(peekQueue(q)).toBe(10);
  });

  it("dequeue removes from the front (FIFO order)", () => {
    const q = dequeue(build(10, 20, 30));
    expect(q).toHaveLength(2);
    expect(peekQueue(q)).toBe(20);
  });

  it("elements come out in the order they went in", () => {
    let q = build(1, 2, 3, 4);
    const out: number[] = [];
    while (q.length > 0) {
      out.push(peekQueue(q) as number);
      q = dequeue(q);
    }
    expect(out).toEqual([1, 2, 3, 4]);
  });

  it("clearQueue returns an empty queue", () => {
    expect(clearQueue()).toEqual([]);
  });
});

describe("queue: edge cases", () => {
  it("dequeue on an empty queue throws a clear error", () => {
    expect(() => dequeue([])).toThrow("Cannot dequeue from an empty queue.");
  });

  it("peek on an empty queue throws a clear error", () => {
    expect(() => peekQueue([])).toThrow("Cannot peek at an empty queue.");
  });

  it("dequeuing the only element leaves an empty queue", () => {
    const q = dequeue(build(42));
    expect(q).toEqual([]);
    expect(q).toHaveLength(0);
  });

  it("dequeuing more times than there are elements throws once empty", () => {
    let q = build(1, 2);
    q = dequeue(dequeue(q)); // now empty
    expect(q).toEqual([]);
    expect(() => dequeue(q)).toThrow("Cannot dequeue from an empty queue.");
  });

  it("allows duplicate values and keeps both", () => {
    const q = build(7, 7, 7);
    expect(q).toHaveLength(3);
    expect(peekQueue(dequeue(q))).toBe(7);
  });

  it("handles zero, negative and decimal values", () => {
    const q = build(0, -5, 3.14);
    expect(q.map((n) => n.value)).toEqual([0, -5, 3.14]);
    expect(peekQueue(q)).toBe(0); // 0 is a real value, not "empty"
  });

  it("handles very large and very small numbers", () => {
    const q = build(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
    expect(peekQueue(q)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("interleaved enqueue and dequeue keeps correct order", () => {
    let q = build(1, 2);
    q = dequeue(q);          // [2]
    q = enqueue(q, 3, 3);    // [2, 3]
    q = dequeue(q);          // [3]
    q = enqueue(q, 4, 4);    // [3, 4]
    expect(q.map((n) => n.value)).toEqual([3, 4]);
  });

  it("works on a large queue", () => {
    const values = Array.from({ length: 1000 }, (_, i) => i);
    let q = build(...values);
    expect(q).toHaveLength(1000);
    expect(peekQueue(q)).toBe(0);
    q = dequeue(q);
    expect(peekQueue(q)).toBe(1);
    expect(q).toHaveLength(999);
  });

  it("keeps each element's id", () => {
    const q = enqueue(enqueue([], 10, 5), 20, 9);
    expect(q.map((n) => n.id)).toEqual([5, 9]);
  });
});

describe("queue: immutability (React state must never be mutated)", () => {
  it("enqueue does not change the original queue", () => {
    const original = build(1, 2);
    enqueue(original, 3, 3);
    expect(original).toHaveLength(2);
  });

  it("dequeue does not change the original queue", () => {
    const original = build(1, 2);
    dequeue(original);
    expect(original).toHaveLength(2);
    expect(peekQueue(original)).toBe(1);
  });

  it("clearQueue returns a fresh array each time", () => {
    const a = clearQueue();
    const b = clearQueue();
    a.push({ id: 1, value: 1 } as never);
    expect(b).toEqual([]);
  });
});