import { useEffect, useId, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  averageAttemptsPerMinute,
  capChartBuckets,
  peakAttemptsPerMinute,
  rollingAverageAttempts,
} from '@/components/lotto/hashActivityUtils';
import type { HashrateBucket, HashrateRange } from '@/services/lotto';
import { fetchGlobalHashrate } from '@/services/lotto';

const RANGE_MS: Record<HashrateRange, number> = {
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
};

const RANGE_LABEL: Record<HashrateRange, string> = {
  '1h': '1h',
  '6h': '6h',
  '24h': '24h',
};

function formatAxisTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export interface GlobalHashrateChartProps {
  hashrateRefreshToken: number;
  accentColor?: string;
}

export function GlobalHashrateChart({
  hashrateRefreshToken,
  accentColor = '#2dd4bf',
}: GlobalHashrateChartProps) {
  const glowFilterId = `hashLineGlow-${useId().replace(/:/g, '')}`;
  const [range, setRange] = useState<HashrateRange>('1h');
  const [buckets, setBuckets] = useState<HashrateBucket[]>([]);
  const [buckets24h, setBuckets24h] = useState<HashrateBucket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchGlobalHashrate(range)
      .then(data => {
        if (!cancelled) setBuckets(capChartBuckets(data));
      })
      .catch(() => {
        if (!cancelled) setBuckets([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range, hashrateRefreshToken]);

  useEffect(() => {
    let cancelled = false;
    fetchGlobalHashrate('24h')
      .then(data => {
        if (!cancelled) setBuckets24h(data);
      })
      .catch(() => {
        if (!cancelled) setBuckets24h([]);
      });
    return () => {
      cancelled = true;
    };
  }, [hashrateRefreshToken]);

  const chartData = useMemo(() => {
    const raw = buckets.map(b => b.attempts);
    const smooth = rollingAverageAttempts(raw, 4);
    return buckets.map((b, i) => ({
      timestamp: b.timestamp,
      label: formatAxisTime(b.timestamp),
      raw: b.attempts,
      smooth: Math.round(smooth[i] * 100) / 100,
    }));
  }, [buckets]);

  const current = buckets.length ? buckets[buckets.length - 1].attempts : 0;
  const peakVisible = peakAttemptsPerMinute(buckets);
  const avg24h = averageAttemptsPerMinute(buckets24h, RANGE_MS['24h']);

  const hasData = buckets.some(b => b.attempts > 0);
  const lastIndex = chartData.length - 1;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d12] p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-medium tracking-tight text-white">Live Hash Activity</h2>
          <p className="text-xs text-white/35">Attempts per minute across the network</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5">
          {(['1h', '6h', '24h'] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1 text-[11px] font-medium transition-colors ${
                range === r ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {RANGE_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Current', value: current.toFixed(1), sub: '/ min' },
          { label: '24h average', value: avg24h.toFixed(2), sub: '/ min' },
          { label: 'Peak', value: peakVisible.toFixed(0), sub: 'in range' },
        ].map(m => (
          <div
            key={m.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
          >
            <div className="text-[9px] uppercase tracking-[0.12em] text-white/25">{m.label}</div>
            <div
              className="mt-0.5 text-lg font-semibold tabular-nums text-white"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {m.value}
              <span className="text-xs font-normal text-white/30">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex h-[220px] items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-teal-500/20 border-t-teal-400" />
        </div>
      ) : !hasData ? (
        <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02]">
          <p className="text-sm text-white/35">Waiting for activity...</p>
        </div>
      ) : (
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(13,13,18,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                formatter={(value: number, name: string) => [
                  typeof value === 'number' ? value.toFixed(1) : value,
                  name === 'raw' ? 'Raw / min' : 'Smoothed',
                ]}
              />
              <Line
                type="monotone"
                dataKey="raw"
                stroke={accentColor}
                strokeOpacity={0.35}
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="smooth"
                stroke={accentColor}
                strokeWidth={2}
                dot={(props: { cx?: number; cy?: number; index?: number }) => {
                  const { cx, cy, index } = props;
                  if (cx == null || cy == null || index !== lastIndex) {
                    return <g />;
                  }
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={8} fill={accentColor} fillOpacity={0.15} />
                      <circle cx={cx} cy={cy} r={4} fill={accentColor}>
                        <animate
                          attributeName="opacity"
                          values="1;0.35;1"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                }}
                activeDot={{ r: 5, fill: accentColor, stroke: '#fff', strokeWidth: 1 }}
                filter={`url(#${glowFilterId})`}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
