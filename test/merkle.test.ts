import { describe, it, expect } from "vitest";
import { calculateMerkleRoot } from "../src/merkle";

describe("Merkle Tree", () => {
  it("should calculate Merkle root for array of data", () => {
    const data = ["hello", "world", "merkle"];
    const tag = "Bitcoin_Transaction";
    const root = calculateMerkleRoot(data, tag);
    console.log("Merkle root:", root);
    expect(root).toBeDefined();
  });

  it("should throw error for empty array", () => {
    const tag = "Bitcoin_Transaction";
    expect(() => calculateMerkleRoot([], tag)).toThrow("Data array cannot be empty");
  });
});

describe("Merkle Root Calculation", () => {
  it("should calculate Merkle Root for sample array", () => {
    const data = ["aaa", "bbb", "ccc", "ddd", "eee"];
    const root = calculateMerkleRoot(data, "Bitcoin_Transaction");

    expect(root).toBe("33ce01bab47b07c208ccc2e2adfa62949b0209c547fd01087e52c12c259ec30c");
  });
});
