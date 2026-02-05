/**
 * Compact format for main card display: 999 → 999, 1_000 → 1.0K, 1M → 1.0M, etc.
 * Max 1 decimal; trim trailing .0.
 */
export function formatCompact(n: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '0';
  const num = Math.floor(n);
  if (num < 1000) return String(num);
  if (num < 1_000_000) {
    const v = num / 1000;
    return trimTrailingZero(v, 'K');
  }
  if (num < 1_000_000_000) {
    const v = num / 1_000_000;
    return trimTrailingZero(v, 'M');
  }
  if (num < 1_000_000_000_000) {
    const v = num / 1_000_000_000;
    return trimTrailingZero(v, 'B');
  }
  const v = num / 1_000_000_000_000;
  return trimTrailingZero(v, 'T');
}

function trimTrailingZero(value: number, suffix: string): string {
  const fixed = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1).replace(/\.0$/, '');
  return `${fixed}${suffix}`;
}

/**
 * Exact format for expand/details: full number with thousands separators.
 */
export function formatExact(n: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '0';
  return Math.floor(n).toLocaleString();
}
