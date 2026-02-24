import { motion } from 'framer-motion';
import { ChevronRight, Copy, Zap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { formatCompact, formatExact } from './formatAttempts';
import { LottoOrbCanvas } from './LottoOrbCanvas';
import { getOrbParams, getOrbSizeFromAttempts } from './orbMath';
import { ticketIdToHex } from './ticketIdToColor';

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
  /** Remaining Plus Ultra shots (default 10). Button disabled when 0. */
  plusUltraRemaining?: number;

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

const STATUS_CONFIG = {
  MINING: {
    dot: 'bg-amber-400',
    pulse: true,
    pill: 'border-amber-500/25 bg-amber-500/10 text-amber-400',
  },
  ACTIVE: {
    dot: 'bg-lotto-green-400',
    pulse: false,
    pill: 'border-lotto-green-500/25 bg-lotto-green-500/10 text-lotto-green-400',
  },
  PAUSED: {
    dot: 'bg-white/25',
    pulse: false,
    pill: 'border-white/10 bg-white/[0.04] text-white/35',
  },
  EXPIRED: {
    dot: 'bg-white/20',
    pulse: false,
    pill: 'border-white/10 bg-white/[0.04] text-white/30',
  },
  CANCELLED: {
    dot: 'bg-white/20',
    pulse: false,
    pill: 'border-white/10 bg-white/[0.04] text-white/30',
  },
} as const;

export function LottoOrbCard({
  ticketId,
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
  plusUltraRemaining = 10,
}: LottoOrbCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prevAttemptsRef = useRef(attemptsTotal);
  const [visible, setVisible] = useState(true);
  const [countdown, setCountdown] = useState(nextAttemptInSec);
  const [recentDelta, setRecentDelta] = useState(0);

  useEffect(() => {
    if (attemptsTotal > prevAttemptsRef.current) {
      setRecentDelta(attemptsTotal - prevAttemptsRef.current);
      prevAttemptsRef.current = attemptsTotal;
    }
  }, [attemptsTotal]);

  useEffect(() => {
    if (recentDelta <= 0) return;
    const t = setTimeout(() => setRecentDelta(0), 5000);
    return () => clearTimeout(t);
  }, [recentDelta]);

  const plusUltraAvailable = import.meta.env.VITE_PLUS_ULTRA_AVAILABLE !== '0';
  const orbParams = useMemo(() => getOrbParams(attemptsTotal, isPlusUltra), [attemptsTotal, isPlusUltra]);
  const accentColor = useMemo(() => ticketIdToHex(ticketId), [ticketId]);
  const orbSize = useMemo(() => getOrbSizeFromAttempts(attemptsTotal), [attemptsTotal]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: '50px',
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setCountdown(nextAttemptInSec);
  }, [nextAttemptInSec]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => {
      setCountdown(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleCopy = useCallback(() => {
    if (!btcAddress) return;
    navigator.clipboard.writeText(btcAddress);
    onCopyAddress?.(btcAddress);
  }, [btcAddress, onCopyAddress]);

  const truncatedAddress = btcAddress ? `${btcAddress.slice(0, 6)}...${btcAddress.slice(-6)}` : '';
  const expiresLabel = formatExpires(expiresAt);
  const lastAttemptLabel = lastAttemptAt
    ? new Date(lastAttemptAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : 'Never';

  const statusCfg = STATUS_CONFIG[status];
  const showPlusUltraBlock =
    plusUltraAvailable &&
    (status === 'ACTIVE' || status === 'MINING') &&
    new Date(expiresAt) > new Date() &&
    Boolean(onPlusUltra);
  const canPlusUltra = showPlusUltraBlock && plusUltraRemaining > 0;

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12] transition-colors hover:border-white/[0.13]"
    >
      {/* Subtle top glow based on status */}
      {status === 'MINING' && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)' }}
        />
      )}
      {status === 'ACTIVE' && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)' }}
        />
      )}

      {/* Header: status + address */}
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          {statusCfg.pulse ? (
            <motion.span
              className={`block h-1.5 w-1.5 rounded-full ${statusCfg.dot}`}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ) : (
            <span className={`block h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
          )}
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide ${statusCfg.pill}`}>
            {status}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="font-mono text-[11px] text-white/30"
            title={btcAddress}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {truncatedAddress || 'No address'}
          </span>
          {btcAddress && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                handleCopy();
              }}
              className="rounded p-0.5 text-white/20 transition-colors hover:text-white/50"
              aria-label="Copy address"
            >
              <Copy className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Orb stage — focal element */}
      <div className="flex justify-center py-5">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 164,
            height: 164,
            background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%)',
          }}
        >
          <LottoOrbCanvas
            size={orbSize}
            params={orbParams}
            isMining={isMining}
            isPlusUltra={isPlusUltra}
            visible={visible}
            accentColor={accentColor}
          />
        </div>
      </div>

      {/* Attempts — centered beneath orb */}
      <div className="px-5 pb-4 text-center">
        <div
          className="tabular-nums leading-tight text-white"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(1.35rem, 3vw, 1.6rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          {formatExact(attemptsTotal)}
        </div>

        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/20">Total Attempts</span>
          {recentDelta > 0 && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-medium tabular-nums text-lotto-green-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              +{formatCompact(recentDelta)}
            </motion.span>
          )}
        </div>

        <div className="mt-0.5 text-[10px] text-white/20">
          {attemptsToday != null && attemptsToday > 0
            ? `+${formatCompact(attemptsToday)} today`
            : `Last: ${lastAttemptLabel}`}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-white/[0.05]" />

      {/* Footer pills */}
      <div className="flex items-center gap-1.5 px-5 py-3">
        <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/35">
          Next: {formatCountdown(countdown)}
        </span>
        <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/35">
          10m cycle
        </span>
        <span className="ml-auto rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/35">
          {expiresLabel}
        </span>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2 px-5 pb-5">
        <button
          type="button"
          onClick={() => onOpenDetails?.(ticketId)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm font-medium text-white/50 transition-colors hover:border-white/[0.14] hover:text-white/80"
          aria-label="See more ticket details"
        >
          See more
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        {showPlusUltraBlock && (
          <button
            type="button"
            disabled={isPlusUltraPending || !canPlusUltra}
            onClick={e => {
              e.stopPropagation();
              onPlusUltra?.();
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all ${
              isPlusUltraPending || !canPlusUltra
                ? 'cursor-not-allowed bg-lotto-orange-500/40 opacity-60'
                : 'bg-gradient-to-r from-lotto-orange-600 to-lotto-orange-500 hover:from-lotto-orange-500 hover:to-lotto-orange-400'
            }`}
          >
            {isPlusUltraPending ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Mining...
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                Plus Ultra <span className="opacity-80">({plusUltraRemaining} left)</span>
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export { formatCompact, formatExact };
