import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

import { capChartBuckets } from '@/components/lotto/hashActivityUtils';
import type { HashrateBucket } from '@/services/lotto';
import { fetchTicketHashrate } from '@/services/lotto';

export interface TicketHashSparklineProps {
  ticketId: string;
  accentColor: string;
  hashrateRefreshToken: number;
}

export function TicketHashSparkline({
  ticketId,
  accentColor,
  hashrateRefreshToken,
}: TicketHashSparklineProps) {
  const [buckets, setBuckets] = useState<HashrateBucket[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchTicketHashrate(ticketId, '1h')
      .then(data => {
        if (!cancelled) setBuckets(capChartBuckets(data).slice(-90));
      })
      .catch(() => {
        if (!cancelled) setBuckets([]);
      });
    return () => {
      cancelled = true;
    };
  }, [ticketId, hashrateRefreshToken]);

  const data = buckets.map(b => ({
    t: b.timestamp,
    v: b.attempts,
  }));

  if (data.length === 0) {
    return (
      <div className="mx-5 h-7 rounded-md bg-white/[0.02]" aria-hidden>
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent opacity-50" />
      </div>
    );
  }

  return (
    <div className="mx-5 h-8 w-auto" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
          <Line
            type="monotone"
            dataKey="v"
            stroke={accentColor}
            strokeWidth={1.25}
            strokeOpacity={0.45}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
