import { useEffect, useId, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { capChartBuckets, rollingAverageAttempts } from '@/components/lotto/hashActivityUtils';
import type { HashrateBucket, LottoAttempt } from '@/services/lotto';
import { fetchTicketHashrate } from '@/services/lotto';

export interface TicketHashTimelineProps {
  ticketId: string;
  accentColor: string;
  attempts: LottoAttempt[];
  hashrateRefreshToken?: number;
}

export function TicketHashTimeline({
  ticketId,
  accentColor,
  attempts,
  hashrateRefreshToken = 0,
}: TicketHashTimelineProps) {
  const glowId = `ticketHashGlow-${useId().replace(/:/g, '')}`;
  const [buckets, setBuckets] = useState<HashrateBucket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTicketHashrate(ticketId, '24h')
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
  }, [ticketId, hashrateRefreshToken]);

  const highMinuteTs = useMemo(() => {
    const set = new Set<number>();
    for (const a of attempts) {
      if (a.energyType !== 'HIGH') continue;
      const ms = new Date(a.attemptedAt).getTime();
      if (Number.isNaN(ms)) continue;
      const minute = Math.floor(ms / 60000) * 60000;
      set.add(minute);
    }
    return set;
  }, [attempts]);

  const chartData = useMemo(() => {
    const raw = buckets.map(b => b.attempts);
    const smooth = rollingAverageAttempts(raw, 4);
    return buckets.map((b, i) => ({
      timestamp: b.timestamp,
      label: new Date(b.timestamp).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }),
      raw: b.attempts,
      smooth: Math.round(smooth[i] * 100) / 100,
      isHighMinute: highMinuteTs.has(b.timestamp),
    }));
  }, [buckets, highMinuteTs]);

  const highDots = chartData.filter(d => d.isHighMinute);

  if (loading) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-white/10 bg-surface-elevated">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-teal-400" />
      </div>
    );
  }

  if (buckets.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-white/10 bg-surface-elevated">
        <p className="text-sm text-white/35">No activity in this window yet</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-surface-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] text-white/35">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-sm bg-white/25" /> Raw / min
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-sm" style={{ backgroundColor: accentColor }} /> Rolling avg
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400/90" /> Plus Ultra minute
        </span>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
              tickFormatter={(ts: number) =>
                new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
              }
              minTickGap={36}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={32}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(13,13,18,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                fontSize: '11px',
              }}
              formatter={(v: number, name: string) => [
                typeof v === 'number' ? v.toFixed(1) : v,
                name === 'raw' ? 'Raw' : 'Avg',
              ]}
            />
            <Line
              type="monotone"
              dataKey="raw"
              stroke={accentColor}
              strokeOpacity={0.3}
              strokeWidth={1}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="smooth"
              stroke={accentColor}
              strokeWidth={2}
              dot={false}
              filter={`url(#${glowId})`}
              isAnimationActive={false}
            />
            {highDots.map(d => (
              <ReferenceDot
                key={d.timestamp}
                x={d.timestamp}
                y={d.raw}
                r={4}
                fill="#fbbf24"
                fillOpacity={0.85}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={1}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
