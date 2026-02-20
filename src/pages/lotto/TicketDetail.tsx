import { motion } from 'framer-motion';
import { Activity, ArrowLeft, CheckCircle2, Clock, Info, RefreshCw, Shield, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useLotto } from '@/hooks/useLotto';
import type { LottoAttempt } from '@/services/lotto';

export default function TicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { getTicketDetail, getTicketAttempts, stats } = useLotto();
  const [ticket, setTicket] = useState<any>(null);
  const [attempts, setAttempts] = useState<LottoAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextAttemptTime, setNextAttemptTime] = useState<string>('--:--');
  const [probability, setProbability] = useState<string>('1 : 12,400');

  useEffect(() => {
    if (!ticketId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [ticketData, attemptsData] = await Promise.all([
          getTicketDetail(ticketId),
          getTicketAttempts(ticketId, 20, 0),
        ]);

        if (ticketData) {
          setTicket(ticketData);
        }

        if (attemptsData) {
          setAttempts(attemptsData.attempts);
        }
      } catch (error) {
        console.error('Error loading ticket detail:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ticketId, getTicketDetail, getTicketAttempts]);

  const maxNextAttemptMs = (ticket?.frequencyMinutes ?? 10) * 60 * 1000;

  useEffect(() => {
    if (!ticket) return;

    const updateCountdown = () => {
      if (!ticket.lastAttemptAt) {
        setNextAttemptTime('Now');
        return;
      }

      const lastAttempt = new Date(ticket.lastAttemptAt);
      const nextAttempt = new Date(lastAttempt.getTime() + maxNextAttemptMs);
      const now = new Date();
      let diff = nextAttempt.getTime() - now.getTime();

      if (diff <= 0) {
        setNextAttemptTime('Now');
      } else {
        if (diff > maxNextAttemptMs) diff = maxNextAttemptMs;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        if (minutes > 0) {
          setNextAttemptTime(`${minutes}m ${seconds}s`);
        } else {
          setNextAttemptTime(`${seconds}s`);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [ticket, maxNextAttemptMs]);

  useEffect(() => {
    if (stats && ticket) {
      const blocksMined = stats.totalBlocksMined || 0;
      const attempts = stats.totalAttempts || 1;
      const estimatedProbability = Math.round(attempts / Math.max(blocksMined, 1));
      setProbability(`1 : ${estimatedProbability.toLocaleString()}`);
    }
  }, [stats, ticket]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-base">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-action-primary/20 border-t-action-primary" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-base">
        <div className="text-center">
          <p className="text-white/35">Ticket not found</p>
          <button onClick={() => navigate('/lotto')} className="mt-4 text-action-primary hover:text-action-hover">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isActive = ticket.status === 'active' && new Date(ticket.validUntil) > new Date();

  return (
    <div className="min-h-screen bg-surface-base p-4 pb-20">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-4"
        >
          <button
            onClick={() => navigate('/lotto')}
            className="rounded-lg bg-white/[0.04] p-2 text-white transition-colors hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Block-Lotto</h1>
            <p className="text-sm text-white/25">OFFICIAL ENTRY</p>
          </div>
          <div
            className={`ml-auto rounded-full px-4 py-2 ${
              isActive ? 'bg-lotto-green-500/20 text-lotto-green-400' : 'bg-white/[0.04] text-white/35'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-lotto-green-400' : 'bg-white/35'}`} />
              <span className="text-xs font-semibold">{isActive ? 'PARTICIPATING' : 'INACTIVE'}</span>
            </div>
          </div>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <p className="mb-2 text-xs uppercase text-white/25">CURRENT STATUS</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`h-6 w-6 ${isActive ? 'text-lotto-green-400' : 'text-white/35'}`} />
            <h2 className="text-2xl font-bold text-white">Active Ticket</h2>
          </div>
        </motion.div>

        {/* Ticket ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-2xl border border-white/10 bg-surface-elevated p-6"
        >
          <p className="mb-2 text-xs uppercase text-white/25">TICKET ID</p>
          <h3 className="mb-2 text-3xl font-bold text-white">{ticket.ticketId}</h3>
          {ticket.btcAddress && (
            <p className="mb-2 break-all font-mono text-sm text-white/45" title="Bitcoin address">
              {ticket.btcAddress}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-lotto-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Cryptographically verified unique entry</span>
          </div>
          <button className="mt-4 flex items-center gap-2 rounded-lg bg-action-primary px-4 py-2 text-sm font-semibold text-black hover:bg-action-hover">
            <Shield className="h-4 w-4" />
            VERIFIABLE
          </button>
        </motion.div>

        {/* Frequency and Validity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 grid grid-cols-2 gap-4"
        >
          <div className="rounded-2xl border border-white/10 bg-surface-elevated p-4">
            <p className="mb-2 text-xs uppercase text-white/25">FREQUENCY</p>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-lotto-orange-400" />
              <span className="text-xl font-bold text-white">{ticket.frequencyMinutes} Mins</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-surface-elevated p-4">
            <p className="mb-2 text-xs uppercase text-white/25">VALIDITY</p>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-white/25" />
              <span className="text-xl font-bold text-white">
                {(() => {
                  const validUntilMs = new Date(ticket.validUntil).getTime();
                  const nowMs = Date.now();
                  if (validUntilMs <= nowMs) return 'Expired';
                  const days = Math.floor((validUntilMs - nowMs) / (1000 * 60 * 60 * 24));
                  const hours = Math.floor(((validUntilMs - nowMs) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  return days > 0 ? `${days} day${days !== 1 ? 's' : ''} ${hours}h` : `${hours} hours`;
                })()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Automatic Entry Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 rounded-2xl border border-white/10 bg-surface-elevated p-4"
        >
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-action-primary" />
            <p className="text-sm text-white/45">
              This ticket automatically enters you into every participation round while active.
            </p>
          </div>
        </motion.div>

        {/* System Live Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 rounded-2xl border border-white/10 bg-surface-elevated p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-lotto-orange-400" />
              <span className="text-xs uppercase text-white/25">SYSTEM LIVE</span>
            </div>
            {stats && (
              <div className="text-sm text-action-primary">
                BLOCK #{stats.lastBlockHeight?.toLocaleString() || '---'}
              </div>
            )}
          </div>
          <div className="mb-4">
            <p className="mb-2 text-xs uppercase text-white/25">NEXT ATTEMPT</p>
            <p className="text-4xl font-bold text-white">{nextAttemptTime}</p>
          </div>
          <div className="mb-4 flex gap-6">
            <div>
              <p className="text-xs uppercase text-white/25">TOTAL ATTEMPTS</p>
              <p className="text-lg font-semibold text-white">
                {(ticket.nonceTotal ?? ticket.totalAttempts ?? 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-white/25">BLOCKS</p>
              <p className="text-lg font-semibold text-white">{(ticket.totalAttempts ?? 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="text-right">
              <p className="text-xs uppercase text-white/25">PROBABILITY</p>
              <p className="text-lg font-semibold text-white">{probability}</p>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 flex items-start gap-2 rounded-lg bg-action-primary/10 p-4 text-sm text-action-primary"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Block-Lotto is a probability-based system. Possession of this ticket confirms participation but does not
            guarantee specific results.
          </p>
        </motion.div>

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl border border-white/10 bg-surface-elevated p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">Recent Attempts</h3>
            <div className="space-y-3">
              {attempts.slice(0, 5).map(attempt => (
                <div key={attempt.id} className="rounded-lg bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/35">Block Height: {attempt.blockHeight}</p>
                      <p className="font-mono text-xs text-white/25">{attempt.hash.substring(0, 16)}...</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-action-primary">
                        <Star className="h-3.5 w-3.5" />
                        <span className="text-sm">{attempt.stars}</span>
                      </div>
                      {attempt.isBlock && (
                        <span className="mt-1 block text-xs font-semibold text-lotto-green-400">BLOCK MINED!</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate(`/lotto/${ticketId}/activity`)}
              className="mt-4 w-full rounded-lg bg-action-primary px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-action-hover"
            >
              <Activity className="mr-2 inline h-4 w-4" />
              View System Activity
            </button>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex items-center justify-between text-sm text-white/25"
        >
          <span>{new Date().toLocaleDateString()}</span>
          <span>PD: $10.00 USD</span>
        </motion.div>
      </div>
    </div>
  );
}
