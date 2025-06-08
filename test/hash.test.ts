import { describe, it, expect } from "vitest";
import { combineHashes, taggedHash } from "../src/hash";

describe("Tagged Hash", () => {
  it("should create BIP340 compatible hash", () => {
    const data = "hello";
    const tag = "Bitcoin_Transaction";
    const hash = taggedHash(data, tag);
    console.log("Hash result:", hash);
    expect(hash).toBe("58c1fbfa2abe50bae8636f578a8ce2cf8c217da8ddaae6ce025a1ddf62efeab2");
  });
});

describe("Combine Hashes", () => {
  it("should combine two hashes", () => {
    const leftHash = "58c1fbfa2abe50bae8636f578a8ce2cf8c217da8ddaae6ce025a1ddf62efeab2";
    const rightHash = "58c1fbfa2abe50bae8636f578a8ce2cf8c217da8ddaae6ce025a1ddf62efeab2";
    const tag = "Bitcoin_Transaction";
    const hash = combineHashes(leftHash, rightHash, tag);
    expect(hash).toBe("ac2b8db8c218880d82b463fb4bab3d28492663a96d59667cd3525132f1fc23c3");
  });
});

describe("Invalid data inputs", () => {
  it("should throw error if data is empty", () => {
    const data = "";
    const tag = "Bitcoin_Transaction";
    expect(() => taggedHash(data, tag)).toThrow("Data cannot be empty");
  });

  it("should throw error if tag is empty", () => {
    const data = "hello";
    const tag = "";
    expect(() => taggedHash(data, tag)).toThrow("Tag cannot be empty");
  });
});
