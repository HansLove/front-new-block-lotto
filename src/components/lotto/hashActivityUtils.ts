import type { HashrateBucket } from '@/services/lotto';

const MAX_CHART_POINTS = 200;

export function capChartBuckets(buckets: HashrateBucket[]): HashrateBucket[] {
  if (buckets.length <= MAX_CHART_POINTS) return buckets;
  return buckets.slice(-MAX_CHART_POINTS);
}

export function rollingAverageAttempts(values: number[], windowSize: number): number[] {
  const w = Math.max(1, windowSize);
  return values.map((_, i) => {
    const start = Math.max(0, i - w + 1);
    const slice = values.slice(start, i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

/** Total attempts in window / full window length in minutes (including empty minutes). */
export function averageAttemptsPerMinute(buckets: HashrateBucket[], rangeMs: number): number {
  if (rangeMs <= 0) return 0;
  const total = buckets.reduce((s, b) => s + b.attempts, 0);
  const minutes = rangeMs / 60000;
  return total / minutes;
}

export function peakAttemptsPerMinute(buckets: HashrateBucket[]): number {
  if (buckets.length === 0) return 0;
  return Math.max(...buckets.map(b => b.attempts));
}
