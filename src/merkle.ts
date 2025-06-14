import { Hash, MerkleNode, MerkleProof, MerkleProofMap, MerkleProofStep, MerkleTreeNode } from "./types";
import { taggedHash, combineHashes } from "./hash";
import { validateNotEmpty } from "./utils";

/**
 * Creates the next level of the Merkle tree
 * @param currentLevel - Current level of hashes
 * @param tag - Tag for hashing
 * @returns Next level of hashes
 */
function createNextLevel(currentLevel: Hash[], tag: string): Hash[] {
  const nextLevel: Hash[] = [];

  for (let i = 0; i < currentLevel.length; i += 2) {
    const leftHash = currentLevel[i];
    const rightHash = i + 1 < currentLevel.length ? currentLevel[i + 1] : leftHash;
    nextLevel.push(combineHashes(leftHash, rightHash, tag));
  }

  return nextLevel;
}

/**
 * Calculate the Merkle root of a list of data
 * @param data - The list of data to calculate the Merkle root of
 * @param leafTag - Tag for hashing
 * @param branchTag - Tag for hashing
 * @returns The Merkle root
 * @throws {Error} If data array is empty
 */
export function calculateMerkleRoot(data: MerkleNode[], leafTag: string, branchTag: string): Hash {
  if (!data || data.length === 0) {
    throw new Error("Data array cannot be empty");
  }

  validateNotEmpty(leafTag, "Leaf tag");
  validateNotEmpty(branchTag, "Branch tag");

  // Create initial level of hashes
  let currentLevel = data.map((item) => taggedHash(item, leafTag));

  // Build the tree level by level
  while (currentLevel.length > 1) {
    currentLevel = createNextLevel(currentLevel, branchTag);
  }

  return currentLevel[0];
}

/**
 * Calculate Merkle proofs for all nodes in the data array
 * @param data - The list of data to calculate proofs for
 * @param leafTag - Tag used for hashing leaf nodes
 * @param branchTag - Tag used for hashing branch nodes
 * @returns A map of Merkle proofs for each node
 * @throws {Error} If data array is empty
 */
export function calculateMerkleProofs(
  data: MerkleNode[],
  leafTag: string,
  branchTag: string
): MerkleProofMap {
  if (!data || data.length === 0) {
    throw new Error("Data array cannot be empty");
  }

  validateNotEmpty(leafTag, "Leaf tag");
  validateNotEmpty(branchTag, "Branch tag");

  // Initialize the proof map
  const proofMap: MerkleProofMap = {};
  data.forEach((_, index) => {
    proofMap[index] = [];
  });

  // Create initial level of tree nodes
  let currentLevel: MerkleTreeNode[] = data.map((item, index) => ({
    hash: taggedHash(item, leafTag),
    leafNodes: [index] // Store index instead of actual node
  }));

  // Build the tree and collect proofs
  while (currentLevel.length > 1) {
    const nextLevel: MerkleTreeNode[] = [];

    // Process each pair of nodes
    for (let i = 0; i < currentLevel.length; i += 2) {
      const leftNode = currentLevel[i];
      const rightNode = i + 1 < currentLevel.length ? currentLevel[i + 1] : leftNode;

      // Calculate parent hash
      const parentHash = combineHashes(leftNode.hash, rightNode.hash, branchTag);

      // Create parent node with merged leaf nodes
      const parentNode: MerkleTreeNode = {
        hash: parentHash,
        leafNodes: i + 1 < currentLevel.length
          ? [...leftNode.leafNodes, ...rightNode.leafNodes] // Even number of nodes
          : [...leftNode.leafNodes] // Odd number of nodes, rightNode is the same as leftNode
      };
      nextLevel.push(parentNode);

      // Add proofs for all leaf nodes in left subtree
      leftNode.leafNodes.forEach((leafIndex) => {
        proofMap[leafIndex].push([rightNode.hash, 1]); // rightHash is right sibling
      });

      // Add proofs for all leaf nodes in right subtree if it exists
      if (i + 1 < currentLevel.length) {
        rightNode.leafNodes.forEach((leafIndex) => {
          proofMap[leafIndex].push([leftNode.hash, 0]); // leftHash is left sibling
        });
      }
    }

    currentLevel = nextLevel;
  }

  return proofMap;
}

/**
 * Verify if a Merkle proof is valid for a given leaf node and root
 * @param leaf - The leaf node to verify
 * @param proof - The Merkle proof for the leaf node
 * @param root - The Merkle root to verify against
 * @param leafTag - Tag used for hashing leaf nodes
 * @param branchTag - Tag used for hashing branch nodes
 * @returns true if the proof is valid, false otherwise
 */
export function verifyMerkleProof(
  leaf: MerkleNode,
  proof: MerkleProof,
  root: Hash,
  leafTag: string,
  branchTag: string
): boolean {
  validateNotEmpty(leafTag, "Leaf tag");
  validateNotEmpty(branchTag, "Branch tag");

  // Start with the leaf hash
  let currentHash = taggedHash(leaf, leafTag);

  // Follow the proof steps to reconstruct the root
  for (const [siblingHash, isRight] of proof) {
    // If isRight is 1, currentHash is left sibling
    // If isRight is 0, currentHash is right sibling
    currentHash = isRight === 1
      ? combineHashes(currentHash, siblingHash, branchTag)
      : combineHashes(siblingHash, currentHash, branchTag);
  }

  // Compare the computed root with the provided root
  return currentHash === root;
}
