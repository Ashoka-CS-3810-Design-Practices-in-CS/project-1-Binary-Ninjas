
import { describe, it, expect } from "vitest";
import {
  insertTree,
  searchTree,
  deleteTree,
  inorderTraversal,
  getTreeRoot,
} from "./BT-operation";

describe("binary search tree operations", () => {
  const makeTree = () => {
    let tree = insertTree([], 10, 1);
    tree = insertTree(tree, 5, 2);
    tree = insertTree(tree, 15, 3);
    tree = insertTree(tree, 3, 4);
    tree = insertTree(tree, 7, 5);
    tree = insertTree(tree, 12, 6);
    tree = insertTree(tree, 18, 7);
    return tree;
  };

  it("inserts the root into an empty tree", () => {
    expect(insertTree([], 10, 1)).toEqual([
      { id: 1, value: 10, left: null, right: null },
    ]);
  });

  it("inserts smaller and larger values in the correct positions", () => {
    const tree = insertTree(
      insertTree(insertTree([], 10, 1), 5, 2),
      15,
      3
    );

    expect(tree[0].left).toBe(2);
    expect(tree[0].right).toBe(3);
    expect(inorderTraversal(tree)).toEqual([5, 10, 15]);
  });

  it("rejects duplicate values", () => {
    const tree = insertTree([], 10, 1);
    expect(() => insertTree(tree, 10, 2)).toThrow(
      "Duplicate values are not allowed."
    );
  });

  it("searches for existing and missing values", () => {
    const tree = makeTree();

    expect(searchTree(tree, 10)).toBe(1);
    expect(searchTree(tree, 3)).toBe(4);
    expect(searchTree(tree, 18)).toBe(7);
    expect(searchTree(tree, 99)).toBe(-1);
    expect(searchTree([], 10)).toBe(-1);
  });

  it("returns the root node", () => {
    expect(getTreeRoot(makeTree())).toEqual({
      id: 1,
      value: 10,
      left: 2,
      right: 3,
    });
    expect(getTreeRoot([])).toBeNull();
  });

  it("returns inorder traversal in sorted order", () => {
    expect(inorderTraversal(makeTree())).toEqual([
      3, 5, 7, 10, 12, 15, 18,
    ]);
  });

  it("returns an empty traversal for an empty tree", () => {
    expect(inorderTraversal([])).toEqual([]);
  });

  it("deletes a leaf node", () => {
    const result = deleteTree(makeTree(), 3);

    expect(inorderTraversal(result)).toEqual([
      5, 7, 10, 12, 15, 18,
    ]);
    expect(searchTree(result, 3)).toBe(-1);
  });

  it("deletes a node with one child", () => {
    const tree = insertTree(
      insertTree(insertTree([], 10, 1), 5, 2),
      3,
      3
    );

    const result = deleteTree(tree, 5);

    expect(inorderTraversal(result)).toEqual([3, 10]);
    expect(searchTree(result, 3)).toBe(3);
  });

  it("deletes a node with two children", () => {
    const result = deleteTree(makeTree(), 5);

    expect(inorderTraversal(result)).toEqual([
      3, 7, 10, 12, 15, 18,
    ]);
    expect(searchTree(result, 5)).toBe(-1);
  });

  it("deletes the root", () => {
    const result = deleteTree(makeTree(), 10);

    expect(inorderTraversal(result)).toEqual([
      3, 5, 7, 12, 15, 18,
    ]);
    expect(searchTree(result, 10)).toBe(-1);
  });

  it("does not mutate the original tree", () => {
    const tree = makeTree();
    const original = tree.map((node) => ({ ...node }));

    insertTree(tree, 20, 8);
    deleteTree(tree, 5);

    expect(tree).toEqual(original);
  });
});
