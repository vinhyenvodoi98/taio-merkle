import { describe, it, expect } from "vitest";
import { calculateMerkleRoot, calculateMerkleProofs, verifyMerkleProof } from "../src/merkle";

describe("Merkle Tree", () => {
  it("should calculate Merkle root for array of data", () => {
    const data = ["hello", "world", "merkle"];
    const leafTag = "Bitcoin_Transaction";
    const branchTag = "Bitcoin_Transaction";
    const root = calculateMerkleRoot(data, leafTag, branchTag);
    expect(root).toBeDefined();
  });

  it("should throw error for empty array", () => {
    const leafTag = "Bitcoin_Transaction";
    const branchTag = "Bitcoin_Transaction";
    expect(() => calculateMerkleRoot([], leafTag, branchTag)).toThrow("Data array cannot be empty");
  });
});

describe("Merkle Root Calculation", () => {
  it("should calculate Merkle Root for sample array", () => {
    const data = ["aaa", "bbb", "ccc", "ddd", "eee"];
    const leafTag = "Bitcoin_Transaction";
    const branchTag = "Bitcoin_Transaction";
    const root = calculateMerkleRoot(data, leafTag, branchTag);

    expect(root).toBe("33ce01bab47b07c208ccc2e2adfa62949b0209c547fd01087e52c12c259ec30c");
  });
});

describe("Merkle Proofs", () => {
  const leafTag = "Bitcoin_Transaction";
  const branchTag = "Bitcoin_Transaction";

  it("should calculate Merkle proofs for all nodes", () => {
    const data = ["aaa", "bbb", "ccc"];
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Check that each node has a proof
    expect(proofs).toHaveProperty("0");
    expect(proofs).toHaveProperty("1");
    expect(proofs).toHaveProperty("2");

    // Check proof structure
    const firstProof = proofs["0"];
    expect(firstProof).toHaveLength(Math.ceil(Math.log2(data.length))); // Two levels of proof
  });

  it("should handle even number of nodes correctly", () => {
    const data = ["aaa", "bbb", "ccc", "ddd"];
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Check all nodes have proofs
    data.forEach((_, index) => {
      expect(proofs).toHaveProperty(index.toString());
      expect(proofs[index.toString()]).toHaveLength(Math.ceil(Math.log2(data.length))); // Two levels of proof
    });

    // Verify proof structure for first level
    const firstProof = proofs["0"];
    expect(firstProof).toHaveLength(Math.ceil(Math.log2(data.length)));

    const secondProof = proofs["1"];
    expect(secondProof).toHaveLength(Math.ceil(Math.log2(data.length)));
  });

  it("should handle odd number of nodes correctly", () => {
    const data = ["aaa", "bbb", "ccc", "ddd", "eee"];
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Check all nodes have proofs
    data.forEach((_, index) => {
      expect(proofs).toHaveProperty(index.toString());
      expect(proofs[index.toString()]).toHaveLength(Math.ceil(Math.log2(data.length)));
    });

    // Verify last node's proof (should be paired with itself)
    const lastProof = proofs["4"];
    expect(lastProof).toHaveLength(Math.ceil(Math.log2(data.length)));
  });

  it("should handle duplicate values correctly", () => {
    const data = ["aaa", "aaa", "bbb", "bbb"];
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Check that each instance has its own proof
    expect(proofs["0"]).toHaveLength(Math.ceil(Math.log2(data.length)));
    expect(proofs["2"]).toHaveLength(Math.ceil(Math.log2(data.length)));

    // Verify proofs are different for same values
    const firstAaaProof = proofs["0"];
    const secondAaaProof = proofs["1"];
    expect(firstAaaProof).not.toEqual(secondAaaProof); // Should be different as they have different positions
  });

  it("should maintain proof order from leaf to root", () => {
    const data = ["aaa", "bbb", "ccc", "ddd"];
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Check that proofs are ordered from leaf to root
    data.forEach((_, index) => {
      const proof = proofs[index.toString()];
      expect(proof).toHaveLength(2); // Two levels

      // First level proof (leaf level)
      expect(proof[0]).toHaveLength(2);
      // Second level proof (branch level)
      expect(proof[1]).toHaveLength(2);
    });
  });

  it("should throw error for empty array in proof calculation", () => {
    expect(() => calculateMerkleProofs([], leafTag, branchTag))
      .toThrow("Data array cannot be empty");
  });

  it("should throw error for invalid tags", () => {
    const data = ["aaa", "bbb"];
    expect(() => calculateMerkleProofs(data, "", branchTag))
      .toThrow("Leaf tag cannot be empty");
    expect(() => calculateMerkleProofs(data, leafTag, ""))
      .toThrow("Branch tag cannot be empty");
  });
});

describe("Merkle Proof Verification", () => {
  const leafTag = "Bitcoin_Transaction";
  const branchTag = "Bitcoin_Transaction";

  it("should verify valid Merkle proof", () => {
    const data = ["aaa", "bbb", "ccc"];
    const root = calculateMerkleRoot(data, leafTag, branchTag);
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Verify proof for first node
    const isValid = verifyMerkleProof(data[0], proofs["0"], root, leafTag, branchTag);
    expect(isValid).toBe(true);
  });

  it("should reject invalid Merkle proof", () => {
    const data = ["aaa", "bbb", "ccc"];
    const root = calculateMerkleRoot(data, leafTag, branchTag);
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Modify the proof to make it invalid
    const invalidProof = [...proofs["0"]];
    invalidProof[0] = ["invalid_hash", 1];

    const isValid = verifyMerkleProof(data[0], invalidProof, root, leafTag, branchTag);
    expect(isValid).toBe(false);
  });

  it("should reject proof with wrong root", () => {
    const data = ["aaa", "bbb", "ccc"];
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);
    const wrongRoot = "wrong_root_hash";

    const isValid = verifyMerkleProof(data[0], proofs["0"], wrongRoot, leafTag, branchTag);
    expect(isValid).toBe(false);
  });

  it("should verify all nodes in the tree", () => {
    const data = ["aaa", "bbb", "ccc", "ddd"];
    const root = calculateMerkleRoot(data, leafTag, branchTag);
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Verify all nodes
    data.forEach((node, index) => {
      const isValid = verifyMerkleProof(node, proofs[index.toString()], root, leafTag, branchTag);
      expect(isValid).toBe(true);
    });
  });

  it("should throw error for invalid tags", () => {
    const data = ["aaa", "bbb"];
    const root = calculateMerkleRoot(data, leafTag, branchTag);
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    expect(() => verifyMerkleProof(data[0], proofs["0"], root, "", branchTag))
      .toThrow("Leaf tag cannot be empty");
    expect(() => verifyMerkleProof(data[0], proofs["0"], root, leafTag, ""))
      .toThrow("Branch tag cannot be empty");
  });

  it("should handle single node tree", () => {
    const data = ["aaa"];
    const root = calculateMerkleRoot(data, leafTag, branchTag);
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    const isValid = verifyMerkleProof(data[0], proofs["0"], root, leafTag, branchTag);
    expect(isValid).toBe(true);
  });

  it("should handle even number of nodes", () => {
    const data = ["aaa", "bbb", "ccc", "ddd"];
    const root = calculateMerkleRoot(data, leafTag, branchTag);
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Verify middle node
    const isValid = verifyMerkleProof(data[1], proofs["1"], root, leafTag, branchTag);
    expect(isValid).toBe(true);
  });

  it("should handle odd number of nodes", () => {
    const data = ["aaa", "bbb", "ccc"];
    const root = calculateMerkleRoot(data, leafTag, branchTag);
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Verify last node (which pairs with itself)
    const isValid = verifyMerkleProof(data[2], proofs["2"], root, leafTag, branchTag);
    expect(isValid).toBe(true);
  });

  it("should reject proof with wrong leaf node", () => {
    const data = ["aaa", "bbb", "ccc"];
    const root = calculateMerkleRoot(data, leafTag, branchTag);
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Try to verify with wrong leaf node
    const isValid = verifyMerkleProof("wrong_leaf", proofs["0"], root, leafTag, branchTag);
    expect(isValid).toBe(false);
  });

  it("should reject proof with modified step order", () => {
    const data = ["aaa", "bbb", "ccc"];
    const root = calculateMerkleRoot(data, leafTag, branchTag);
    const proofs = calculateMerkleProofs(data, leafTag, branchTag);

    // Modify proof by changing step order
    const invalidProof = [...proofs["0"]].reverse();

    const isValid = verifyMerkleProof(data[0], invalidProof, root, leafTag, branchTag);
    expect(isValid).toBe(false);
  });
});
