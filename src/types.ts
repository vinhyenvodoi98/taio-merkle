/**
 * Type definitions for the Merkle tree implementation
 */

/**
 * Represents a hash value in hexadecimal format
 */
export type Hash = string;

/**
 * Represents a node in the Merkle tree (input data)
 */
export type MerkleNode = string;

/**
 * Represents a single proof step in the Merkle proof
 * [hash, isRight] where:
 * - hash: hex-encoded string
 * - isRight: 0 for left, 1 for right
 */
export type MerkleProofStep = [Hash, number];

/**
 * Represents a complete Merkle proof for a node
 * Array of [hash, isRight] tuples ordered from leaf to root
 */
export type MerkleProof = MerkleProofStep[];

/**
 * Represents a map of Merkle proofs for all nodes
 */
export interface MerkleProofMap {
  [key: MerkleNode]: MerkleProof;
}

/**
 * Represents a node in the Merkle tree with its hash and associated leaf indices
 */
export interface MerkleTreeNode {
  hash: Hash;
  leafNodes: number[]; // Array of indices instead of actual nodes
}
