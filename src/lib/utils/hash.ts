import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

export type Hashed = string & { readonly __brand: 'Hashed' };

export function hashSha256(data: string): Hashed {
	const bytes = new TextEncoder().encode(data);
	return bytesToHex(sha256(bytes)) as Hashed;
}
