import { motion } from 'framer-motion';

import { useBtcPrice } from '@/hooks/useBtcPrice';

interface BtcPriceTickerProps {
  enabled: boolean;
}

const LOTTO_AMOUNT_USD = 6;

const formatUsd = (value: number): string =>
  value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatSats = (sats: number): string => sats.toLocaleString('en-US');

export function BtcPriceTicker({ enabled }: BtcPriceTickerProps) {
  const { priceUsd, secondsUntilRefresh, satsForUsd, error } = useBtcPrice({ enabled });

  const hasPrice = priceUsd !== null;
  const isAboutToRefresh = secondsUntilRefresh <= 2 && enabled;
  const sats = satsForUsd(LOTTO_AMOUNT_USD);

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-surface-elevated px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span
            className="text-[10px] uppercase tracking-wider text-white/35"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            1 BTC
          </span>
          <motion.span
            key={priceUsd ?? 'pending'}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="text-base font-semibold text-action-primary"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {hasPrice ? `$${formatUsd(priceUsd)}` : '—'}
          </motion.span>
        </div>

        <motion.span
          animate={isAboutToRefresh ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
          transition={isAboutToRefresh ? { duration: 0.6, repeat: Infinity } : { duration: 0.2 }}
          className="text-[10px] uppercase tracking-wider text-white/35"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {enabled ? `refresh in ${secondsUntilRefresh}s` : 'paused'}
        </motion.span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span
          className="text-xs text-white/45"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {hasPrice ? `~ ${formatSats(sats)} sats per ${LOTTO_AMOUNT_USD} USD` : 'rate unavailable'}
        </span>
        {error !== null && !hasPrice && (
          <span className="text-[10px] uppercase tracking-wider text-white/25">rate unavailable</span>
        )}
      </div>
    </div>
  );
}
