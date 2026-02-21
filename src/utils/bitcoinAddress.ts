/**
 * Validates a Bitcoin mainnet address.
 * Supports: Legacy P2PKH (1...), P2SH (3...), Bech32 SegWit (bc1q...), Bech32m Taproot (bc1p...).
 */
export function isValidBitcoinAddress(addr: string): boolean {
  const trimmed = addr.trim();
  if (!trimmed) return false;
  // Legacy P2PKH (1) and P2SH (3): 26–35 chars, Base58 (exclude 0, O, I, l)
  const legacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  // Bech32 SegWit (bc1q): 42–62 chars; data chars only
  const bech32Segwit = /^bc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{39,59}$/;
  // Bech32m Taproot (bc1p): 62 chars
  const bech32Taproot = /^bc1p[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/;
  return legacy.test(trimmed) || bech32Segwit.test(trimmed) || bech32Taproot.test(trimmed);
}
