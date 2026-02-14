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
 * Growth-friendly compact format: 2 decimals for K/M, 3 for B/T so increments are visible
 * (e.g. 3.730B → 3.731B when +1M). Trim trailing zeros so 1.00B → 1B.
 */
export function formatCompactGrowth(n: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '0';
  const num = Math.floor(n);
  if (num < 1000) return String(num);
  if (num < 1_000_000) {
    const v = num / 1000;
    return trimGrowth(v, 'K', 2);
  }
  if (num < 1_000_000_000) {
    const v = num / 1_000_000;
    return trimGrowth(v, 'M', 2);
  }
  if (num < 1_000_000_000_000) {
    const v = num / 1_000_000_000;
    return trimGrowth(v, 'B', 3);
  }
  const v = num / 1_000_000_000_000;
  return trimGrowth(v, 'T', 3);
}

function trimGrowth(value: number, suffix: string, decimals: number): string {
  const fixed = value.toFixed(decimals).replace(/\.?0+$/, '');
  return `${fixed}${suffix}`;
}

/**
 * Exact format for expand/details: full number with thousands separators.
 */
export function formatExact(n: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '0';
  return Math.floor(n).toLocaleString();
}
