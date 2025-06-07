# Taio Merkle

A TypeScript library for calculating Merkle roots using BIP340-compatible tagged hashes.

## Features

- BIP340-compatible tagged hash implementation
- Merkle root calculation for arrays of data
- Customizable hash tags for domain separation
- TypeScript support with type definitions

## Installation

```bash
npm install taio-merkle
```

## Usage

### Basic Usage

```typescript
import { calculateMerkleRoot } from 'taio-merkle';

// Calculate Merkle root with default tag
const data = ["hello", "world"];
const root = calculateMerkleRoot(data);
console.log(root); // Merkle root hash
```

### Using Custom Tags

```typescript
import { calculateMerkleRoot, taggedHash } from 'taio-merkle';

// Calculate Merkle root with custom tag
const data = ["hello", "world"];
const root = calculateMerkleRoot(data, "MyCustomTag");

// Use tagged hash directly
const hash = taggedHash("hello", "MyCustomTag");
```

### API Reference

#### `taggedHash(data: string, tag?: string): string`

Creates a BIP340-compatible tagged hash of the input data.

- `data`: The string to hash
- `tag`: Optional custom tag (defaults to "Bitcoin_Transaction")
- Returns: The hex-encoded hash string

#### `calculateMerkleRoot(data: string[], tag?: string): string`

Calculates the Merkle root of an array of strings.

- `data`: Array of strings to calculate the Merkle root for
- `tag`: Optional custom tag (defaults to "Bitcoin_Transaction")
- Returns: The hex-encoded Merkle root hash

## How It Works

The library implements BIP340's tagged hash specification:

1. First, the tag is hashed: `tagHash = SHA256(tag)`
2. Then, the final hash is computed: `SHA256(tagHash || data)`

For Merkle root calculation:
1. Each input string is hashed using the tagged hash function
2. Pairs of hashes are combined and hashed again
3. This process continues until a single root hash remains

## Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.0.0

## License

Apache License 2.0
