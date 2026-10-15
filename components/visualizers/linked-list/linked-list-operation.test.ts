
import { describe, it, expect } from "vitest";
import {
  insertHead,
  insertTail,
  insertAtPosition,
  deleteValue,
  searchValue,
} from "./linked-list-operation";

describe("linked list operations", () => {
  const initial = [
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
  ];

  it("inserts at the head", () => {
    expect(insertHead(initial, 5, 4)).toEqual([
      { id: 4, value: 5 },
      ...initial,
    ]);
  });

  it("inserts at the tail", () => {
    expect(insertTail(initial, 40, 4)).toEqual([
      ...initial,
      { id: 4, value: 40 },
    ]);
  });

  it("inserts at a specified position", () => {
    expect(insertAtPosition(initial, 15, 1, 4)).toEqual([
      initial[0],
      { id: 4, value: 15 },
      initial[1],
      initial[2],
    ]);
  });

  it("inserts into an empty list", () => {
    expect(insertHead([], 10, 1)).toEqual([
      { id: 1, value: 10 },
    ]);
    expect(insertTail([], 20, 2)).toEqual([
      { id: 2, value: 20 },
    ]);
  });

  it("allows insertion at the beginning and end positions", () => {
    expect(insertAtPosition(initial, 5, 0, 4)[0].value).toBe(5);
    expect(
      insertAtPosition(initial, 40, initial.length, 4).at(-1)?.value
    ).toBe(40);
  });

  it.each([-1, 4, 1.5])(
    "rejects invalid insertion position %s",
    (position) => {
      expect(() =>
        insertAtPosition(initial, 15, position, 4)
      ).toThrow();
    }
  );

  it("deletes the first matching value", () => {
    expect(deleteValue(initial, 20)).toEqual([
      initial[0],
      initial[2],
    ]);
  });

  it("throws when deleting a missing value", () => {
    expect(() => deleteValue(initial, 99)).toThrow(
      "Value 99 was not found."
    );
  });

  it("searches for a value and returns its index", () => {
    expect(searchValue(initial, 20)).toBe(1);
    expect(searchValue(initial, 99)).toBe(-1);
    expect(searchValue([], 10)).toBe(-1);
  });

  it("deletes the head and tail correctly", () => {
    expect(deleteValue(initial, 10)).toEqual(initial.slice(1));
    expect(deleteValue(initial, 30)).toEqual(initial.slice(0, 2));
  });

  it("preserves the original list after insertion and deletion", () => {
    const original = initial.map((node) => ({ ...node }));
    insertHead(initial, 5, 4);
    insertTail(initial, 40, 5);
    insertAtPosition(initial, 15, 1, 6);
    deleteValue(initial, 20);

    expect(initial).toEqual(original);
  });

  it("preserves duplicate values when deleting one occurrence", () => {
    const list = [
      { id: 1, value: 10 },
      { id: 2, value: 10 },
    ];

    expect(deleteValue(list, 10)).toEqual([
      { id: 2, value: 10 },
    ]);
  });
});
