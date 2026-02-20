import { motion } from 'framer-motion';
import { Cpu, History as HistoryIcon, Zap } from 'lucide-react';

import type { LottoTicket } from '@/services/lotto';

interface TicketCardProps {
  ticket: LottoTicket;
  onClick?: () => void;
  // eslint-disable-next-line no-unused-vars -- callback param in type
  onPlusUltra?: (ticket: LottoTicket) => void;
  isPlusUltraPending?: boolean;
}

export const TicketCard = ({ ticket, onClick, onPlusUltra, isPlusUltraPending = false }: TicketCardProps) => {
  const isMining = !ticket.lastAttemptAt;

  // Last attempt: always show specific time.
  const lastAttemptLabel = ticket.lastAttemptAt
    ? new Date(ticket.lastAttemptAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'Never';

  const borderColor = isMining ? 'border-t-lotto-orange-400' : 'border-t-lotto-green-400';

  // Extract lotto number from ticketId (assuming format like "Lotto #142" or similar)
  const lottoNumber = ticket.ticketId?.replace(/[^0-9]/g, '') || ticket.id?.slice(-3) || '---';

  const totalAttemptsDisplay = ticket.nonceTotal ?? ticket.totalAttempts ?? 0;
  const nowMs = Date.now();
  const validUntilMs = ticket.validUntil ? new Date(ticket.validUntil).getTime() : 0;
  const expiresInDays =
    validUntilMs > nowMs ? Math.max(0, Math.ceil((validUntilMs - nowMs) / (1000 * 60 * 60 * 24))) : 0;
  const expiresLabel = expiresInDays > 0 ? `${expiresInDays} day${expiresInDays !== 1 ? 's' : ''} left` : 'Expired';

  const truncatedBtc = ticket.btcAddress ? `${ticket.btcAddress.slice(0, 6)}...${ticket.btcAddress.slice(-6)}` : '';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden rounded-xl border border-t-4 border-white/10 ${borderColor} bg-surface-elevated p-6 transition-all`}
    >
      {/* Ticket Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">Lotto #{lottoNumber}</h3>
        {ticket.btcAddress && (
          <p className="mt-1 truncate font-mono text-xs text-white/25" title={ticket.btcAddress}>
            {truncatedBtc}
          </p>
        )}
      </div>

      {/* Total Attempts (nonce_total) - Large Display */}
      <div className="mb-4">
        <div className="text-4xl font-bold text-white">{totalAttemptsDisplay.toLocaleString()}</div>
        <div className="text-sm text-white/25">Total Attempts</div>
        <div className="mt-1 text-xs text-white/20">{ticket.totalAttempts.toLocaleString()} blocks</div>
      </div>

      {/* Expiration */}
      <div className="mb-4 text-xs text-white/25">
        <span className="font-medium text-white/35">Expires:</span> {expiresLabel}
      </div>

      {/* Mining cycle (~10 min) + Last attempt */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-white/[0.03] p-3">
          <div className="mb-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/25">
            <Cpu className="h-2.5 w-2.5" />
            <span>Mining cycle</span>
          </div>
          <div className="text-xs font-medium text-white/45">~10 min per block</div>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-3">
          <div className="mb-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/25">
            <HistoryIcon className="h-2.5 w-2.5" />
            <span>Last attempt</span>
          </div>
          <div className="text-xs font-medium text-white">{lastAttemptLabel}</div>
        </div>
      </div>

      {/* Plus Ultra Button */}
      {onPlusUltra && ticket.status === 'active' && new Date(ticket.validUntil) > new Date() && (
        <button
          onClick={e => {
            e.stopPropagation();
            onPlusUltra(ticket);
          }}
          disabled={isPlusUltraPending}
          className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-black transition-all ${
            isPlusUltraPending
              ? 'cursor-not-allowed bg-action-primary/60'
              : 'bg-gradient-to-r from-action-primary to-action-hover hover:opacity-90'
          }`}
        >
          {isPlusUltraPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              Mining...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              Plus Ultra
            </span>
          )}
        </button>
      )}
    </motion.div>
  );
};
