import { Hash, MerkleNode } from "./types";
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
