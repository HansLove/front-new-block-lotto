import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { LiveAttemptFeed } from '@/components/lotto/LiveAttemptFeed';
import { useLotto } from '@/hooks/useLotto';

export default function TicketActivityPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { liveActivityFeed, refreshLiveActivityFeed } = useLotto();

  const filtered =
    ticketId != null
      ? liveActivityFeed.filter(
          item => item.ticketId === ticketId || item.ticketId === String(ticketId)
        )
      : liveActivityFeed;

  const items = filtered.length > 0 ? filtered : liveActivityFeed;

  return (
    <div className="min-h-screen bg-[#07070a] px-4 pb-12 pt-20 text-white">
      <div className="mx-auto max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3"
        >
          <button
            type="button"
            onClick={() => navigate(ticketId ? `/lotto/${ticketId}` : '/lotto')}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white/80 transition-colors hover:bg-white/[0.08]"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white">Activity</h1>
            <p className="text-xs text-white/35">
              {ticketId ? 'Attempts for this ticket' : 'Your recent attempts across tickets'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refreshLiveActivityFeed()}
            className="ml-auto rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white"
          >
            Refresh
          </button>
        </motion.div>
        <LiveAttemptFeed items={items} />
      </div>
    </div>
  );
}
