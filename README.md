# Taio Merkle

A TypeScript library for calculating Merkle roots and proofs using BIP340-compatible tagged hashes.

## Features

- BIP340-compatible tagged hash implementation
- Merkle root calculation for arrays of data
- Merkle proof generation and verification
- Separate tags for leaf nodes and branch nodes
- TypeScript support with type definitions

## Installation

```bash
npm install taio-merkle
```

## Dependencies

### Runtime Dependencies
- Node.js >= 20.0.0

### Development Dependencies
- TypeScript >= 5.8.3
- Vitest >= 3.2.2 (for testing)
- tsup >= 8.5.0 (for building)
- tslib >= 2.8.1
- @types/node >= 22.15.30
- @vitest/coverage-v8 >= 3.2.2 (for test coverage)

## Usage

### Basic Usage

```typescript
import { calculateMerkleRoot } from 'taio-merkle';

// Calculate Merkle root with default tags
const data = ["hello", "world"];
const root = calculateMerkleRoot(data);
console.log(root); // Merkle root hash
```

### Using Custom Tags

```typescript
import { calculateMerkleRoot, taggedHash } from 'taio-merkle';

// Calculate Merkle root with custom tags
const data = ["hello", "world"];
const leafTag = "MyLeafTag";    // Tag for leaf nodes
const branchTag = "MyBranchTag"; // Tag for branch nodes
const root = calculateMerkleRoot(data, leafTag, branchTag);

// Use tagged hash directly
const hash = taggedHash("hello", "MyCustomTag");
```

### Working with Merkle Proofs

```typescript
import { calculateMerkleRoot, calculateMerkleProofs, verifyMerkleProof } from 'taio-merkle';

const data = ["aaa", "bbb", "ccc"];
const leafTag = "Bitcoin_Transaction";
const branchTag = "Bitcoin_Transaction";

// Calculate root and proofs
const root = calculateMerkleRoot(data, leafTag, branchTag);
const proofs = calculateMerkleProofs(data, leafTag, branchTag);

// Verify a proof
const isValid = verifyMerkleProof(data[0], proofs["0"], root, leafTag, branchTag);
console.log("Is proof valid?", isValid); // true
```

### API Reference

#### `taggedHash(data: string, tag: string): string`

Creates a BIP340-compatible tagged hash of the input data.

- `data`: The string to hash
- `tag`: Tag for hashing
- Returns: The hex-encoded hash string
- Throws: Error if data or tag is empty

#### `calculateMerkleRoot(data: string[], leafTag: string, branchTag: string): string`

Calculates the Merkle root of an array of strings.

- `data`: Array of strings to calculate the Merkle root for
- `leafTag`: Tag used for hashing leaf nodes (defaults to "Bitcoin_Transaction")
- `branchTag`: Tag used for hashing branch nodes (defaults to "Bitcoin_Transaction")
- Returns: The hex-encoded Merkle root hash
- Throws: Error if data array is empty

#### `calculateMerkleProofs(data: string[], leafTag: string, branchTag: string): MerkleProofMap`

Calculates Merkle proofs for all nodes in the data array.

- `data`: Array of strings to calculate proofs for
- `leafTag`: Tag used for hashing leaf nodes
- `branchTag`: Tag used for hashing branch nodes
- Returns: A map of Merkle proofs for each node, where keys are node indices
- Throws: Error if data array is empty or tags are empty

#### `verifyMerkleProof(leaf: string, proof: MerkleProof, root: string, leafTag: string, branchTag: string): boolean`

Verifies if a Merkle proof is valid for a given leaf node and root.

- `leaf`: The leaf node to verify
- `proof`: The Merkle proof for the leaf node
- `root`: The Merkle root to verify against
- `leafTag`: Tag used for hashing leaf nodes
- `branchTag`: Tag used for hashing branch nodes
- Returns: true if the proof is valid, false otherwise
- Throws: Error if tags are empty

## Types

```typescript
type Hash = string;
type MerkleNode = string;
type MerkleProofStep = [Hash, number]; // [hash, isRight]
type MerkleProof = MerkleProofStep[];
interface MerkleProofMap {
  [key: string]: MerkleProof; // key is node index
}
```

## How It Works

The library implements BIP340's tagged hash specification:

1. First, the tag is hashed: `tagHash = SHA256(tag)`
2. Then, the final hash is computed: `SHA256(tagHash || tagHash || data)`

For Merkle root calculation:
1. Each input string is hashed using the leaf tag
2. Pairs of hashes are combined and hashed again using the branch tag
3. This process continues until a single root hash remains

For Merkle proofs:
1. Each node's proof consists of sibling hashes and their positions (left/right)
2. Proofs are ordered from leaf to root
3. Verification reconstructs the root by following the proof steps

## License

Apache License 2.0
