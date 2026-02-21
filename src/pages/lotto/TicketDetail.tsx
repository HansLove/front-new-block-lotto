import { motion } from 'framer-motion';
import { Activity, ArrowLeft, CheckCircle2, Clock, Info, RefreshCw, Shield, Star, Zap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { AttemptsOverTimeChart } from '@/components/lotto/AttemptsOverTimeChart';
import { LottoOrbCanvas } from '@/components/lotto/LottoOrbCanvas';
import { getOrbParams, getOrbSizeFromAttempts } from '@/components/lotto/orbMath';
import { ticketIdToHex } from '@/components/lotto/ticketIdToColor';
import { useLotto } from '@/hooks/useLotto';
import type { LottoAttempt, LottoTicket } from '@/services/lotto';

export default function TicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const {
    getTicketDetail,
    getTicketAttempts,
    stats,
    requestHighEntropyAttempt,
    highEntropyPending,
    refreshTickets,
  } = useLotto();
  const [ticket, setTicket] = useState<LottoTicket | null>(null);
  const [attempts, setAttempts] = useState<LottoAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextAttemptTime, setNextAttemptTime] = useState<string>('--:--');
  const [probability, setProbability] = useState<string>('1 : 12,400');
  const plusUltraAvailable = import.meta.env.VITE_PLUS_ULTRA_AVAILABLE !== '0';

  const loadData = useCallback(async () => {
    if (!ticketId) return;
    try {
      setLoading(true);
      const [ticketData, attemptsData] = await Promise.all([
        getTicketDetail(ticketId),
        getTicketAttempts(ticketId, 50, 0),
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
  }, [ticketId, getTicketDetail, getTicketAttempts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlusUltra = useCallback(async () => {
    if (!ticket) return;
    try {
      toast('Requesting high entropy from Bitcoin mining...', { position: 'bottom-center', duration: 2000 });
      const result = await requestHighEntropyAttempt(ticket);
      toast.success(result.message || 'Plus Ultra initiated.', { position: 'bottom-center', duration: 3000 });
      await refreshTickets();
      const [ticketData, attemptsData] = await Promise.all([
        getTicketDetail(ticket.id),
        getTicketAttempts(ticket.id, 50, 0),
      ]);
      if (ticketData) setTicket(ticketData);
      if (attemptsData) setAttempts(attemptsData.attempts);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(msg || (err instanceof Error ? err.message : 'Error initiating Plus Ultra.'), {
        position: 'bottom-center',
        duration: 4000,
      });
    }
  }, [ticket, requestHighEntropyAttempt, refreshTickets, getTicketDetail, getTicketAttempts]);

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
      const attemptsTotalStats = stats.totalAttempts || 1;
      const estimatedProbability = Math.round(attemptsTotalStats / Math.max(blocksMined, 1));
      setProbability(`1 : ${estimatedProbability.toLocaleString()}`);
    }
  }, [stats, ticket]);

  const attemptsTotal = ticket != null ? (ticket.nonceTotal ?? ticket.totalAttempts ?? 0) : 0;
  const accentColor = useMemo(
    () => (ticket ? ticketIdToHex(ticket.ticketId ?? ticket.id) : '#0d9488'),
    [ticket]
  );
  const orbParams = useMemo(() => getOrbParams(attemptsTotal, false), [attemptsTotal]);
  const orbSizeBase = getOrbSizeFromAttempts(attemptsTotal);
  const orbSize = Math.min(220, Math.round(orbSizeBase * 1.35));
  const isMining = ticket != null && !ticket.lastAttemptAt;

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
    <div className="min-h-screen bg-surface-base p-4 pt-20">
      <div className="mx-auto max-w-6xl">
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

        {/* Hero: Orb + Total attempts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-12"
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: orbSize + 24,
              height: orbSize + 24,
              background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
            }}
          >
            <LottoOrbCanvas
              size={orbSize}
              params={orbParams}
              isMining={isMining}
              isPlusUltra={false}
              visible
              accentColor={accentColor}
            />
          </div>
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <p className="mb-2 text-xs uppercase tracking-widest text-white/25">Total attempts</p>
            <p
              className="font-bold tabular-nums text-white"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {attemptsTotal.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-white/35">Next attempt: {nextAttemptTime}</p>
            {isActive && plusUltraAvailable && (
              <button
                type="button"
                disabled={highEntropyPending[ticket.id]}
                onClick={() => handlePlusUltra()}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all sm:w-auto ${
                  highEntropyPending[ticket.id]
                    ? 'cursor-not-allowed bg-lotto-orange-500/40 opacity-60'
                    : 'bg-gradient-to-r from-lotto-orange-600 to-lotto-orange-500 hover:from-lotto-orange-500 hover:to-lotto-orange-400'
                }`}
              >
                {highEntropyPending[ticket.id] ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Mining...
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" />
                    Plus Ultra
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Chart: accumulation over time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/35">
            Attempts over time
          </h3>
          <AttemptsOverTimeChart
            attempts={attempts}
            totalAttempts={attemptsTotal}
            accentColor={accentColor}
          />
        </motion.div>

        {/* Grid: Ticket ID, Frequency/Validity, System live, etc. */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Ticket ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-surface-elevated p-6"
          >
            <p className="mb-2 text-xs uppercase text-white/25">TICKET ID</p>
            <h3 className="mb-2 break-all text-xl font-bold text-white">{ticket.ticketId}</h3>
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

          {/* Frequency, Validity, System live */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface-elevated p-6">
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
              <div className="mb-2">
                <p className="text-xs uppercase text-white/25">NEXT ATTEMPT</p>
                <p className="text-2xl font-bold text-white">{nextAttemptTime}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs uppercase text-white/25">BLOCKS</p>
                  <p className="text-lg font-semibold text-white">{(ticket.totalAttempts ?? 0).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-white/25">PROBABILITY</p>
                  <p className="text-lg font-semibold text-white">{probability}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Automatic Entry Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-2xl border border-white/10 bg-surface-elevated p-4"
        >
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 shrink-0 text-action-primary" />
            <p className="text-sm text-white/45">
              This ticket automatically enters you into every participation round while active.
            </p>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-start gap-2 rounded-lg bg-action-primary/10 p-4 text-sm text-action-primary"
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
            transition={{ delay: 0.6 }}
            className="mt-6 rounded-2xl border border-white/10 bg-surface-elevated p-6"
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
          transition={{ delay: 0.7 }}
          className="mt-6 flex items-center justify-between text-sm text-white/25"
        >
          <span>{new Date().toLocaleDateString()}</span>
          <span>PD: $10.00 USD</span>
        </motion.div>
      </div>
    </div>
  );
}
