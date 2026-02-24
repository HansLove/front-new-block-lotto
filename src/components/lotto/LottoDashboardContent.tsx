import { motion } from 'framer-motion';
import { Activity, Clock, Plus, Trophy, Zap } from 'lucide-react';
import { useMemo } from 'react';

import { formatExact } from '@/components/lotto/formatAttempts';
import { LottoOrbCard, type LottoOrbCardStatus } from '@/components/lotto/LottoOrbCard';
import { PaymentTicketSkeleton } from '@/components/lotto/PaymentTicketSkeleton';
import type { LottoTicket, SystemStats } from '@/services/lotto';

const CYCLE_SEC = 10 * 60;

function ticketToOrbProps(ticket: LottoTicket, isPlusUltraPending: boolean) {
  const attemptsTotal = ticket.nonceTotal ?? ticket.totalAttempts ?? 0;
  const lastAttemptMs = ticket.lastAttemptAt ? new Date(ticket.lastAttemptAt).getTime() : null;
  const nextAttemptMs = lastAttemptMs != null ? lastAttemptMs + CYCLE_SEC * 1000 : null;
  const nextAttemptInSec =
    nextAttemptMs != null ? Math.max(0, Math.round((nextAttemptMs - Date.now()) / 1000)) : CYCLE_SEC;

  const isMining = !ticket.lastAttemptAt;
  const status: LottoOrbCardStatus = isMining
    ? 'MINING'
    : ticket.status === 'active'
      ? 'ACTIVE'
      : ticket.status === 'suspended'
        ? 'PAUSED'
        : 'EXPIRED';

  return {
    ticketId: ticket.id,
    btcAddress: ticket.btcAddress ?? '',
    status,
    attemptsTotal,
    nextAttemptInSec,
    lastAttemptAt: ticket.lastAttemptAt ?? undefined,
    expiresAt: ticket.validUntil,
    isMining,
    isPlusUltra: isPlusUltraPending,
    stars: ticket.stars ?? 5,
    isPlusUltraPending,
    plusUltraRemaining: ticket.plusUltraRemaining ?? 10,
  };
}

export interface LottoDashboardContentProps {
  loading: boolean;
  tickets: LottoTicket[];
  stats: SystemStats | null;
  highEntropyPending: Record<string, boolean>;
  /** When true, show a skeleton card at the first grid position (payment waiting/confirming). */
  showPaymentSkeleton?: boolean;
  onBuyTicket: () => void;
  onOpenDetails: (id: string) => void;
  onPlusUltra: (ticket: LottoTicket) => void;
}

export function LottoDashboardContent({
  loading,
  tickets,
  stats,
  highEntropyPending,
  showPaymentSkeleton = false,
  onBuyTicket,
  onOpenDetails,
  onPlusUltra,
}: LottoDashboardContentProps) {
  const activeTickets = tickets.filter(
    t => t.status === 'active' && new Date(t.validUntil) > new Date()
  );
  const sortedActiveTickets = useMemo(
    () =>
      [...activeTickets].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [activeTickets]
  );
  const myTotalAttempts = activeTickets.reduce(
    (sum, t) => sum + (t.nonceTotal ?? t.totalAttempts ?? 0),
    0
  );

  const showGrid = !loading && (activeTickets.length > 0 || showPaymentSkeleton);
  const showEmptyState = !loading && activeTickets.length === 0 && !showPaymentSkeleton;

  return (
    <>
      {/* Stats band */}
      <div className="border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-white/[0.04] sm:grid-cols-4">
            {[
              {
                label: 'Your Tickets',
                value: String(activeTickets.length),
                icon: Activity,
                mono: false,
              },
              {
                label: 'Your Attempts',
                value: formatExact(myTotalAttempts),
                icon: Zap,
                mono: true,
              },
              {
                label: 'Blocks Mined',
                value: stats?.totalBlocksMined?.toLocaleString() ?? '0',
                icon: Trophy,
                mono: false,
              },
              {
                label: 'Block Height',
                value: stats?.lastBlockHeight?.toLocaleString() ?? '--',
                icon: Clock,
                mono: true,
              },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3 px-4 py-4 sm:px-6">
                <stat.icon className="h-3.5 w-3.5 shrink-0 text-white/15" />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-white/25">{stat.label}</div>
                  <div
                    className="truncate text-base font-semibold text-white"
                    style={stat.mono ? { fontFamily: "'JetBrains Mono', monospace" } : undefined}
                  >
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500/20 border-t-amber-500" />
          </div>
        )}

        {showEmptyState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div
              className="mb-5 leading-none text-white/[0.035]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '7rem' }}
            >
              ?
            </div>
            <h3 className="mb-2 text-xl font-light text-white/50">No active tickets</h3>
            <p className="mb-8 text-sm text-white/25">Every 10 minutes is a chance. Start one now.</p>
            <motion.button
              onClick={onBuyTicket}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-400"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              Buy Your First Ticket
            </motion.button>
          </motion.div>
        )}

        {showGrid && (
          <>
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                {showPaymentSkeleton && activeTickets.length === 0
                  ? 'Activating your ticket'
                  : `${activeTickets.length} ${activeTickets.length === 1 ? 'ticket' : 'tickets'} running`}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {showPaymentSkeleton && <PaymentTicketSkeleton />}
              {sortedActiveTickets.map(ticket => {
                const pending = highEntropyPending[ticket.id] ?? false;
                const orbProps = ticketToOrbProps(ticket, pending);
                return (
                  <LottoOrbCard
                    key={ticket.id}
                    {...orbProps}
                    onOpenDetails={onOpenDetails}
                    onPlusUltra={() => onPlusUltra(ticket)}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}
