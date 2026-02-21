import { motion } from 'framer-motion';

/**
 * Skeleton card shown in the dashboard grid at the first position while a ticket
 * payment is waiting or confirming. Matches LottoOrbCard layout (orb + lines).
 */
export function PaymentTicketSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-[#0d0d12]">
      {/* Subtle top glow to signal "in progress" */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.35), transparent)' }}
      />

      {/* Header: status pill + address placeholders */}
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <motion.span
            className="block h-1.5 w-1.5 rounded-full bg-amber-500/60"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="h-5 w-24 animate-pulse rounded-full bg-white/10" />
        </div>
        <div className="h-3 w-20 animate-pulse rounded bg-white/10" style={{ fontFamily: "'JetBrains Mono', monospace" }} />
      </div>

      {/* Orb placeholder with pulse */}
      <div className="flex justify-center py-5">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 164,
            height: 164,
            background: 'radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)',
          }}
        >
          <motion.div
            className="h-[148px] w-[148px] rounded-full bg-white/[0.06]"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Label + skeleton lines (next attempt, etc.) */}
      <div className="px-5 pb-3 text-center">
        <p className="mb-3 text-xs font-medium text-amber-400/80">Activating your ticket</p>
        <div className="mb-4 space-y-2">
          <div className="mx-auto h-3 w-24 animate-pulse rounded bg-white/10" />
          <div className="mx-auto h-2 w-32 animate-pulse rounded bg-white/5" />
        </div>
        <p className="text-[10px] text-white/35">
          Questions? Contact our Director of Communication on Telegram:{' '}
          <a
            href="https://t.me/FEDERICO_bitconianos_CONSENSUS"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-400/80 underline decoration-amber-500/30 underline-offset-1 transition-colors hover:text-amber-400"
          >
            @FEDERICO_bitconianos_CONSENSUS
          </a>
        </p>
      </div>
    </div>
  );
}
