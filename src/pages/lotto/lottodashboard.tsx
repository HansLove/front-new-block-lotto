import 'react-toastify/dist/ReactToastify.css';

import { motion } from 'framer-motion';
import { Activity, Info, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { LottoOrbCard, type LottoOrbCardStatus } from '@/components/lotto/LottoOrbCard';
import { useAuth } from '@/hooks/useLogInHook';
import { useLotto } from '@/hooks/useLotto';
import type { LottoTicket } from '@/services/lotto';
import { createTicket } from '@/services/lotto';

const CYCLE_SEC = 10 * 60; // 10 min

function ticketToOrbProps(ticket: LottoTicket, isPlusUltraPending: boolean) {
  const attemptsTotal = ticket.nonceTotal ?? ticket.totalAttempts ?? 0;
  const lastAttemptMs = ticket.lastAttemptAt
    ? new Date(ticket.lastAttemptAt).getTime()
    : null;
  const nextAttemptMs = lastAttemptMs != null ? lastAttemptMs + CYCLE_SEC * 1000 : null;
  const nextAttemptInSec =
    nextAttemptMs != null
      ? Math.max(0, Math.round((nextAttemptMs - Date.now()) / 1000))
      : CYCLE_SEC;

  const isMining = !ticket.lastAttemptAt;
  const status: LottoOrbCardStatus =
    isMining ? 'MINING' : ticket.status === 'active' ? 'ACTIVE' : ticket.status === 'suspended' ? 'PAUSED' : 'EXPIRED';

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
  };
}

export default function LottoDash() {
  const navigate = useNavigate();
  const {
    tickets,
    stats,
    loading,
    refreshTickets,
    requestHighEntropyAttempt,
    highEntropyPending,
  } = useLotto();
  const { isSessionActive, openLoginModal } = useAuth();
  const [btcAddress, setBtcAddress] = useState('');
  const [validDays, setValidDays] = useState(30);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isSessionActive && !loading) {
      openLoginModal();
    }
  }, [isSessionActive, loading, openLoginModal]);

  useEffect(() => {
    if (isSessionActive) {
      refreshTickets();
    }
  }, [refreshTickets, isSessionActive]);

  const handleCreateTicket = async () => {
    if (!btcAddress || btcAddress.trim().length < 26) {
      toast.error('Please enter a valid Bitcoin address (26+ characters)');
      return;
    }
    setCreating(true);
    try {
      await createTicket({ btcAddress: btcAddress.trim(), validDays: validDays || 30 });
      toast.success('Ticket created. You will participate every 10 minutes.');
      setShowBuyModal(false);
      setBtcAddress('');
      setValidDays(30);
      await refreshTickets();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to create ticket';
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const handlePlusUltra = async (ticket: LottoTicket) => {
    try {
      toast.info('Requesting high entropy from Bitcoin mining...', {
        position: 'bottom-center',
        autoClose: 2000,
      });

      const result = await requestHighEntropyAttempt(ticket);

      toast.success(result.message || 'Plus Ultra initiated. Total attempts will update when the round completes.', {
        position: 'bottom-center',
        autoClose: 3000,
      });

      await refreshTickets();
    } catch (error: any) {
      console.error('Plus Ultra error:', error);
      const msg = error.response?.data?.message || error.message;
      toast.error(
        msg || 'Error initiating Plus Ultra. Please try again.',
        { position: 'bottom-center', autoClose: 4000 }
      );
    }
  };

  const activeTickets = tickets.filter(t => t.status === 'active' && new Date(t.validUntil) > new Date());

  if (!isSessionActive) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-lotto-green-500" />
              <span className="text-gray-700">System Operational</span>
            </div>
            {stats && (
              <span className="text-gray-500">
                Block Height: {stats.lastBlockHeight?.toLocaleString() || '---'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-5xl font-normal italic text-gray-900">Decentralized luck. Powered by math.</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Participate in the first transparent, high-frequency lottery system active on the blockchain. No house edge,
            just pure probability.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowBuyModal(true)}
              className="rounded-lg bg-lotto-green-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-lotto-green-600"
            >
              Start Playing
            </button>
          </div>
        </motion.div>

        {/* Buy Ticket Modal */}
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h3 className="mb-4 text-xl font-bold text-gray-900">Create Block-Lotto Ticket</h3>
              <p className="mb-4 text-sm text-gray-600">
                Enter your Bitcoin address to receive rewards if you win. Your ticket will participate automatically
                every 10 minutes until it expires.
              </p>
              <input
                type="text"
                value={btcAddress}
                onChange={e => setBtcAddress(e.target.value)}
                placeholder="Enter Bitcoin address..."
                className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-lotto-green-500 focus:outline-none focus:ring-2 focus:ring-lotto-green-500/20"
              />
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">Valid for (days)</label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={validDays}
                  onChange={e => setValidDays(Number(e.target.value) || 30)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-lotto-green-500 focus:outline-none focus:ring-2 focus:ring-lotto-green-500/20"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  disabled={creating}
                  className="flex-1 rounded-lg bg-lotto-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-lotto-green-600 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Active Lottos Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lotto-blue-500/10 text-lotto-blue-500">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Active Lottos</h3>
            </div>
            
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-lotto-green-500/30 border-t-lotto-green-500" />
            </div>
          ) : activeTickets.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <Activity className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h4 className="mb-2 text-lg font-semibold text-gray-900">No Active Tickets</h4>
              <p className="mb-6 text-sm text-gray-600">
                Purchase a ticket to start participating in Block-Lotto
              </p>
              <button
                onClick={() => setShowBuyModal(true)}
                className="rounded-lg bg-lotto-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-lotto-green-600"
              >
                <Plus className="mr-2 inline h-5 w-5" />
                Buy Your First Ticket
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeTickets.map(ticket => {
                const pending = highEntropyPending[ticket.ticketId] ?? false;
                const orbProps = ticketToOrbProps(ticket, pending);
                return (
                  <LottoOrbCard
                    key={ticket.id}
                    {...orbProps}
                    onOpenDetails={(id) => navigate(`/lotto/${id}`)}
                    onPlusUltra={() => handlePlusUltra(ticket)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <Info className="h-6 w-6 text-lotto-blue-500" />
            <h3 className="text-xl font-bold text-gray-900">How Block-Lotto Works</h3>
          </div>
          <div className="space-y-4 text-gray-600">
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">1. Purchase a Ticket</h4>
              <p>Buy a ticket for $10 USD. Each ticket is valid for 30 days and participates automatically.</p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">2. Automatic Participation</h4>
              <p>
                Your ticket automatically enters every participation round (every 10 minutes) while active. No action
                required.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">3. Plus Ultra - High Entropy Mining</h4>
              <p>
                Press the "Plus Ultra" button on any active ticket to trigger a high-quality entropy mining attempt
                (12 stars). This provides higher probability of mining a block but takes longer to complete.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">4. Win if Block is Mined</h4>
              <p>
                If the system successfully mines a Bitcoin block during your participation, the coinbase reward is sent
                directly to your Bitcoin address.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
            <strong>Note:</strong> Block-Lotto is a probability-based system. Not all attempts will result in a mined
            block. The system never stops trying.
          </div>
        </motion.div>
      </section>
      <ToastContainer position="bottom-center" theme="light" />
    </div>
  );
}
