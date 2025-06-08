import { createHash } from "crypto";
import { Hash } from "./types";
import { validateNotEmpty } from "./utils";

/**
 * BIP340 Compatible tagged hash function Hash_A(M) = SHA256(SHA256("A") || SHA256("A") || M)
 * @param data - The data to hash
 * @param tag - Tag for hashing
 * @returns The tagged hash
 * @throws {Error} If data or tag is empty
 */
export function taggedHash(data: string, tag: string): Hash {
  validateNotEmpty(data, "Data");
  validateNotEmpty(tag, "Tag");

  // First hash of tag
  const tagHash = createHash("sha256").update(tag, "utf-8").digest();

  // Concatenate: tagHash || tagHash || data
  return createHash("sha256")
    .update(Buffer.concat([tagHash, tagHash, Buffer.from(data, "utf-8")]))
    .digest("hex");
}

/**
 * Combines two hashes
 * @param leftHash - Left hash
 * @param rightHash - Right hash
 * @param tag - Tag for hashing
 * @returns Combined hash
 * @throws {Error} If tag is empty
 */
export function combineHashes(leftHash: Hash, rightHash: Hash, tag: string): Hash {
  validateNotEmpty(tag, "Tag");
  return taggedHash(leftHash + rightHash, tag);
}
