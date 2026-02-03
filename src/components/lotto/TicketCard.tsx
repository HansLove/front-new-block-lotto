import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Zap } from 'lucide-react';
import type { LottoTicket } from '@/services/lotto';

interface TicketCardProps {
  ticket: LottoTicket;
  onClick?: () => void;
  onPlusUltra?: (ticket: LottoTicket) => void;
  difficulty?: string;
  isPlusUltraPending?: boolean;
}

export const TicketCard = ({
  ticket,
  onClick,
  onPlusUltra,
  difficulty = '12.5 T',
  isPlusUltraPending = false,
}: TicketCardProps) => {
  const [timeUntilNext, setTimeUntilNext] = useState<string>('--:--');
  const [isMining, setIsMining] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      if (!ticket.lastAttemptAt) {
        setTimeUntilNext('00:00');
        setIsMining(true);
        return;
      }

      const lastAttempt = new Date(ticket.lastAttemptAt);
      const nextAttempt = new Date(lastAttempt.getTime() + ticket.frequencyMinutes * 60 * 1000);
      const now = new Date();
      const diff = nextAttempt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilNext('00:00');
        setIsMining(true);
      } else {
        setIsMining(false);
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeUntilNext(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [ticket.lastAttemptAt, ticket.frequencyMinutes]);

  // Determine status and colors
  const status = isMining ? 'MINING' : 'ACTIVE';
  const borderColor = isMining ? 'border-t-lotto-orange-400' : 'border-t-lotto-teal-400';
  const badgeBg = isMining ? 'bg-lotto-orange-100' : 'bg-lotto-blue-100';
  const badgeText = isMining ? 'text-lotto-orange-700' : 'text-lotto-blue-700';

  // Extract lotto number from ticketId (assuming format like "Lotto #142" or similar)
  const lottoNumber = ticket.ticketId?.replace(/[^0-9]/g, '') || ticket.id?.slice(-3) || '---';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden rounded-xl border-t-4 ${borderColor} bg-white p-6 shadow-sm transition-all hover:shadow-md`}
    >
      {/* Status Badge */}
      <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${badgeBg} ${badgeText}`}>
        {status}
      </div>

      {/* Ticket Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Lotto #{lottoNumber}</h3>
      </div>

      {/* Total Attempts - Large Display */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-gray-900">{ticket.totalAttempts.toLocaleString()}</div>
        <div className="text-sm text-gray-500">Total Attempts</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Next Block</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">{timeUntilNext}</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp className="h-3 w-3" />
            <span>Difficulty</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">{difficulty}</div>
        </div>
      </div>

      {/* Plus Ultra Button */}
      {onPlusUltra && ticket.status === 'active' && new Date(ticket.validUntil) > new Date() && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlusUltra(ticket);
          }}
          disabled={isPlusUltraPending}
          className={`mt-4 w-full rounded-lg py-2.5 px-4 text-sm font-semibold text-white transition-all ${
            isPlusUltraPending
              ? 'cursor-not-allowed bg-lotto-orange-400 opacity-60'
              : 'bg-gradient-to-r from-lotto-orange-500 to-lotto-orange-600 hover:from-lotto-orange-600 hover:to-lotto-orange-700 hover:shadow-md'
          }`}
        >
          {isPlusUltraPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
