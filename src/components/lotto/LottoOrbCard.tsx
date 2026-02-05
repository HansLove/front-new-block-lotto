import { motion } from 'framer-motion';
import { ChevronRight, Copy, Zap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { formatCompact, formatExact } from './formatAttempts';
import { LottoOrbCanvas } from './LottoOrbCanvas';
import { getOrbParams } from './orbMath';

export type LottoOrbCardStatus = 'ACTIVE' | 'EXPIRED' | 'PAUSED' | 'CANCELLED' | 'MINING';

export interface LottoOrbCardProps {
  ticketId: string;
  lottoNumber?: string | number;
  btcAddress: string;
  status: LottoOrbCardStatus;
  attemptsTotal: number;
  attemptsToday?: number;
  nextAttemptInSec: number;
  lastAttemptAt?: string | number | Date;
  expiresAt: string | number | Date;

  isMining?: boolean;
  isPlusUltra?: boolean;
  stars?: number;

  onOpenDetails?: (_ticketId: string) => void;
  onCopyAddress?: (_address: string) => void;
  onPlusUltra?: () => void;
  isPlusUltraPending?: boolean;
}

function formatCountdown(sec: number): string {
  if (sec <= 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatExpires(expiresAt: string | number | Date): string {
  const ms = new Date(expiresAt).getTime();
  const now = Date.now();
  if (ms <= now) return 'Expired';
  const days = Math.ceil((ms - now) / (1000 * 60 * 60 * 24));
  return `${days}d`;
}

export function LottoOrbCard({
  ticketId,
  lottoNumber,
  btcAddress,
  status,
  attemptsTotal,
  attemptsToday,
  nextAttemptInSec,
  lastAttemptAt,
  expiresAt,
  isMining = false,
  isPlusUltra = false,
  stars: _stars = 5,
  onOpenDetails,
  onCopyAddress,
  onPlusUltra,
  isPlusUltraPending = false,
}: LottoOrbCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [countdown, setCountdown] = useState(nextAttemptInSec);

  const orbParams = useMemo(
    () => getOrbParams(attemptsTotal, isPlusUltra),
    [attemptsTotal, isPlusUltra]
  );

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: '50px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setCountdown(nextAttemptInSec);
  }, [nextAttemptInSec]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => {
      setCountdown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleCopy = useCallback(() => {
    if (btcAddress) {
      navigator.clipboard.writeText(btcAddress);
      onCopyAddress?.(btcAddress);
    }
  }, [btcAddress, onCopyAddress]);

  const truncatedAddress = btcAddress
    ? `${btcAddress.slice(0, 6)}...${btcAddress.slice(-6)}`
    : '';
  const displayNumber = lottoNumber ?? ticketId.slice(-4);
  const expiresLabel = formatExpires(expiresAt);
  const lastAttemptLabel = lastAttemptAt
    ? new Date(lastAttemptAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : 'Never';

  const statusPillClass =
    status === 'MINING'
      ? 'border-lotto-orange-400 text-lotto-orange-700 bg-lotto-orange-50'
      : status === 'ACTIVE'
        ? 'border-lotto-green-500 text-lotto-green-700 bg-lotto-green-50'
        : 'border-gray-300 text-gray-600 bg-gray-50';

  const canPlusUltra =
    (status === 'ACTIVE' || status === 'MINING') &&
    new Date(expiresAt) > new Date() &&
    Boolean(onPlusUltra);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onOpenDetails?.(ticketId)}
      className="relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lotto #{displayNumber}</h3>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusPillClass}`}
        >
          {status}
        </span>
      </div>

      {/* Address */}
      <div className="mb-4 flex items-center gap-2">
        <span className="truncate font-mono text-xs text-gray-500" title={btcAddress}>
          {truncatedAddress || 'No address'}
        </span>
        {btcAddress && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Copy address"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Main row: attempts + orb */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-2xl font-bold tabular-nums text-gray-900">
            {formatCompact(attemptsTotal)}
          </div>
          <div className="text-xs text-gray-500">Total Attempts</div>
          <div className="mt-0.5 text-xs text-gray-400">
            {attemptsToday != null && attemptsToday > 0
              ? `+${formatCompact(attemptsToday)} today`
              : `Last: ${lastAttemptLabel}`}
          </div>
        </div>
        <div className="shrink-0">
          <LottoOrbCanvas
            size={120}
            params={orbParams}
            isMining={isMining}
            isPlusUltra={isPlusUltra}
            visible={visible}
          />
        </div>
      </div>

      {/* Footer pills */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-600">
          Next: {formatCountdown(countdown)}
        </span>
        <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-600">Cycle: 10m</span>
        <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-600">Expires: {expiresLabel}</span>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        {btcAddress ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.(ticketId);
            }}
            className="flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            aria-label="View ticket details"
          >
            View details
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.(ticketId);
            }}
            className="flex w-full items-center justify-center gap-1 rounded-lg border border-amber-300 bg-amber-50 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
          >
            Set payout address
          </button>
        )}

        {canPlusUltra && (
          <button
            type="button"
            disabled={isPlusUltraPending}
            onClick={(e) => {
              e.stopPropagation();
              onPlusUltra?.();
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all ${
              isPlusUltraPending
                ? 'cursor-not-allowed bg-lotto-orange-400 opacity-60'
                : 'bg-gradient-to-r from-lotto-orange-500 to-lotto-orange-600 hover:from-lotto-orange-600 hover:to-lotto-orange-700'
            }`}
          >
            {isPlusUltraPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Mining...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Plus Ultra
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export { formatCompact, formatExact };
