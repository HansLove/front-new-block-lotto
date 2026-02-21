import { useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { LottoAttempt } from '@/services/lotto';

export interface AttemptsOverTimeChartProps {
  attempts: LottoAttempt[];
  /** Total lifetime attempts from the ticket (nonceTotal). Used as final point so Y-axis reflects real scale. */
  totalAttempts: number;
  accentColor?: string;
}

function formatAxisDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatLargeNumber(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

export function AttemptsOverTimeChart({
  attempts,
  totalAttempts,
  accentColor = '#14b8a6',
}: AttemptsOverTimeChartProps) {
  const [excludeHighEnergy, setExcludeHighEnergy] = useState(false);

  const filtered = excludeHighEnergy
    ? attempts.filter(a => a.energyType !== 'HIGH')
    : attempts;

  // Oldest to newest so cumulative nonce sum is correct (first point = first nonce, second = first+second, etc.)
  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime()
  );

  let runningSum = 0;
  const eventPoints = sorted.map(a => {
    const nonceNum = Number(a.nonce) || 0;
    runningSum += nonceNum;
    return {
      time: formatAxisDate(a.attemptedAt),
      timeRaw: a.attemptedAt,
      cumulative: runningSum,
    };
  });

  const data =
    totalAttempts > 0 && eventPoints.length > 0 && totalAttempts >= runningSum
      ? [
          ...eventPoints,
          {
            time: 'Now',
            timeRaw: new Date().toISOString(),
            cumulative: totalAttempts,
          },
        ]
      : eventPoints;

  const highCount = attempts.filter(a => a.energyType === 'HIGH').length;

  if (attempts.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-surface-elevated">
        <p className="text-sm text-white/35">No attempt data yet</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-surface-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/35">
          <input
            type="checkbox"
            checked={excludeHighEnergy}
            onChange={e => setExcludeHighEnergy(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-action-primary focus:ring-action-primary/50"
          />
          <span>Exclude Bitcoin-powered attempts</span>
        </label>
        {highCount > 0 && (
          <span className="text-xs text-white/25">
            {highCount} high-energy in dataset
          </span>
        )}
      </div>
      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-white/35">
            No attempts to show (all excluded)
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="attemptsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                allowDecimals={false}
                tickFormatter={formatLargeNumber}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(13,13,18,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                formatter={(value: number) =>
                  [typeof value === 'number' ? value.toLocaleString() : value, 'Attempts']
                }
                labelFormatter={label => label}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke={accentColor}
                strokeWidth={2}
                fill="url(#attemptsGradient)"
              />
          </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
