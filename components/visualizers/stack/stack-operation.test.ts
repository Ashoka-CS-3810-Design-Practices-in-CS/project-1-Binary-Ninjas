import { describe, it, expect } from "vitest";
import { push, pop, peekStack, searchStack, clearStack } from "./stack-operation";

describe("stack operations", () => {
  it("push adds to the top", () => {
    const s = push([], 10, 1);
    expect(s).toHaveLength(1);
    expect(peekStack(s)).toBe(10);
  });

  it("pop removes the top element", () => {
    const s = push(push([], 10, 1), 20, 2);
    const after = pop(s);
    expect(after).toHaveLength(1);
    expect(peekStack(after)).toBe(10);
  });

  it("does not mutate the original stack", () => {
    const s = push([], 10, 1);
    pop(s);
    expect(s).toHaveLength(1);
  });

  it("searchStack returns the index, or -1 when absent", () => {
    const s = push(push([], 10, 1), 20, 2);
    expect(searchStack(s, 10)).toBe(0);
    expect(searchStack(s, 99)).toBe(-1);
  });

  it("clearStack returns an empty stack", () => {
    expect(clearStack()).toEqual([]);
  });
});