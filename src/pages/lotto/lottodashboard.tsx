import 'react-toastify/dist/ReactToastify.css';

import { USDTNetwork } from '@taloon/nowpayments-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Clock, Copy, Info, Loader2, Plus, Trophy, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { formatExact } from '@/components/lotto/formatAttempts';
import { LottoOrbCard, type LottoOrbCardStatus } from '@/components/lotto/LottoOrbCard';
import { useAuth } from '@/hooks/useLogInHook';
import { useLotto } from '@/hooks/useLotto';
import { useLottoDeposit } from '@/hooks/useLottoDeposit';
import type { LottoTicket } from '@/services/lotto';

const CYCLE_SEC = 10 * 60;

const USDT_NETWORK_LABELS: Record<USDTNetwork, string> = {
  [USDTNetwork.USDTMATIC]: 'USDT (Polygon)',
  [USDTNetwork.USDTTRC20]: 'USDT (Tron)',
  [USDTNetwork.USDTBSC]: 'USDT (BNB Chain)',
  [USDTNetwork.USDTARB]: 'USDT (Arbitrum)',
  [USDTNetwork.USDTSOL]: 'USDT (Solana)',
  [USDTNetwork.USDTNEAR]: 'USDT (NEAR)',
  [USDTNetwork.USDTOP]: 'USDT (Optimism)',
  [USDTNetwork.USDTDOT]: 'USDT (Polkadot)',
};

function useLottoDisplayFonts() {
  useEffect(() => {
    if (document.getElementById('lotto-display-fonts')) return;
    const link = document.createElement('link');
    link.id = 'lotto-display-fonts';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap';
    document.head.appendChild(link);
  }, []);
}

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
  };
}

export default function LottoDash() {
  useLottoDisplayFonts();

  const navigate = useNavigate();
  const { tickets, stats, loading, refreshTickets, requestHighEntropyAttempt, highEntropyPending } = useLotto();
  const { isSessionActive, openLoginModal } = useAuth();
  const [showBuyModal, setShowBuyModal] = useState(false);

  const {
    btcAddress, selectedCurrency, paymentData, isPending, isSubmitting, error,
    setBtcAddress, selectCurrency, submitPayment, resetPayment,
  } = useLottoDeposit();

  const prevTicketsLengthRef = useRef(tickets.length);

  useEffect(() => {
    if (!isSessionActive && !loading) openLoginModal();
  }, [isSessionActive, loading, openLoginModal]);

  useEffect(() => {
    if (isSessionActive) refreshTickets();
  }, [refreshTickets, isSessionActive]);

  useEffect(() => {
    if (!isPending) {
      prevTicketsLengthRef.current = tickets.length;
      return;
    }
    if (tickets.length > prevTicketsLengthRef.current) {
      toast.success('Your ticket is now active!', { position: 'bottom-center' });
      resetPayment();
    }
    prevTicketsLengthRef.current = tickets.length;
  }, [tickets, isPending, resetPayment]);

  const handleSubmitPayment = () => {
    const trimmed = btcAddress.trim();
    const isValidAddress =
      trimmed.length >= 26 &&
      (trimmed.startsWith('bc1') || trimmed.startsWith('1') || trimmed.startsWith('3'));
    if (!isValidAddress) {
      toast.error('Invalid Bitcoin address');
      return;
    }
    submitPayment();
  };

  const handleCopyAddress = () => {
    if (!paymentData) return;
    navigator.clipboard.writeText(paymentData.payAddress)
      .then(() => toast.success('Address copied!'))
      .catch(() => toast.error('Could not copy address'));
  };

  const handleCloseModal = () => {
    if (isPending) toast.info('Waiting for payment. Your ticket will appear automatically.');
    resetPayment();
    setShowBuyModal(false);
  };

  const handlePlusUltra = async (ticket: LottoTicket) => {
    try {
      toast.info('Requesting high entropy from Bitcoin mining...', { position: 'bottom-center', autoClose: 2000 });
      const result = await requestHighEntropyAttempt(ticket);
      toast.success(result.message || 'Plus Ultra initiated.', { position: 'bottom-center', autoClose: 3000 });
      await refreshTickets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Error initiating Plus Ultra.', {
        position: 'bottom-center',
        autoClose: 4000,
      });
    }
  };

  const activeTickets = tickets.filter(t => t.status === 'active' && new Date(t.validUntil) > new Date());

  if (!isSessionActive) return null;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#07070a] pt-16 text-white">
      {/* ---- PAGE HEADER ---- */}
      <div className="border-b border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1.5 flex items-center gap-2.5">
                <motion.span
                  className="block h-1.5 w-1.5 rounded-full bg-lotto-green-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs text-white/35">Live</span>
                {stats && (
                  <span className="text-xs text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Block #{stats.lastBlockHeight?.toLocaleString() ?? '--'}
                  </span>
                )}
                {stats && (
                  <span className="hidden text-xs text-white/15 sm:inline">
                    {stats.totalActiveTickets ?? 0} active players
                  </span>
                )}
              </div>
              <h1
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-[clamp(1.6rem,3vw,2.25rem)] font-light text-white"
              >
                My Tickets
              </h1>
            </div>

            <motion.button
              onClick={() => setShowBuyModal(true)}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              New Ticket
            </motion.button>
          </div>
        </div>
      </div>

      {/* ---- STATS BAND ---- */}
      <div className="border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-white/[0.04] sm:grid-cols-4">
            {[
              {
                label: 'Active Tickets',
                value: stats?.totalActiveTickets?.toLocaleString() ?? '--',
                icon: Activity,
                mono: false,
              },
              {
                label: 'Network Attempts',
                value: stats ? formatExact(stats.totalAttempts) : '--',
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

      {/* ---- MAIN CONTENT ---- */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500/20 border-t-amber-500" />
          </div>
        )}

        {!loading && activeTickets.length === 0 && (
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
              onClick={() => setShowBuyModal(true)}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-400"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              Buy Your First Ticket
            </motion.button>
          </motion.div>
        )}

        {!loading && activeTickets.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                {activeTickets.length} {activeTickets.length === 1 ? 'ticket' : 'tickets'} running
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {activeTickets.map(ticket => {
                const pending = highEntropyPending[ticket.ticketId] ?? false;
                const orbProps = ticketToOrbProps(ticket, pending);
                return (
                  <LottoOrbCard
                    key={ticket.id}
                    {...orbProps}
                    onOpenDetails={id => navigate(`/lotto/${id}`)}
                    onPlusUltra={() => handlePlusUltra(ticket)}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-white/[0.04] py-10">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Info className="mx-auto mb-3 h-3.5 w-3.5 text-white/10" />
          <p className="text-xs leading-relaxed text-white/15">
            Block-Lotto is a probability-based participation system. Mining attempts are real and contribute to the
            Bitcoin network. Results are publicly verifiable on the blockchain.
          </p>
        </div>
      </footer>

      {/* ---- BUY TICKET MODAL ---- */}
      <AnimatePresence>
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e14] p-7 shadow-2xl"
            >
              {paymentData === null ? (
                <>
                  <h3
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    className="mb-1.5 text-2xl font-semibold text-white"
                  >
                    New Ticket
                  </h3>
                  <p className="mb-6 text-sm text-white/35">
                    Enter your Bitcoin address and select the USDT network.
                  </p>

                  <input
                    type="text"
                    value={btcAddress}
                    onChange={e => setBtcAddress(e.target.value)}
                    placeholder="Bitcoin address (bc1q...)"
                    className="mb-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  />

                  <div className="mb-4">
                    <label className="mb-1.5 block text-xs text-white/35">USDT Network</label>
                    <select
                      value={selectedCurrency}
                      onChange={e => selectCurrency(e.target.value as USDTNetwork)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                    >
                      {Object.values(USDTNetwork).map(network => (
                        <option key={network} value={network} className="bg-[#0e0e14] text-white">
                          {USDT_NETWORK_LABELS[network]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6 rounded-lg bg-white/[0.03] px-4 py-2.5 text-center">
                    <span className="text-sm font-medium text-white/60">6 USD - 3 months</span>
                  </div>

                  {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

                  <div className="flex gap-3">
                    <button
                      onClick={() => { resetPayment(); setShowBuyModal(false); }}
                      className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/45 transition-colors hover:border-white/20 hover:text-white/70"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleSubmitPayment}
                      disabled={isSubmitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? 'Creating payment...' : 'Pay with USDT'}
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <h3
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    className="mb-6 text-2xl font-semibold text-white"
                  >
                    Send Payment
                  </h3>

                  <div className="mb-5 flex justify-center rounded-xl bg-white p-4">
                    <QRCode value={paymentData.payAddress} size={180} />
                  </div>

                  <div className="mb-4 text-center">
                    <span className="text-xs uppercase tracking-wider text-white/35">
                      {USDT_NETWORK_LABELS[paymentData.payCurrency as USDTNetwork] ?? paymentData.payCurrency}
                    </span>
                  </div>

                  <div className="mb-4 rounded-lg bg-white/[0.03] px-4 py-3 text-center">
                    <span className="text-sm text-white/50">Send exactly </span>
                    <span className="text-base font-bold text-amber-400">{paymentData.payAmount}</span>
                    <span className="text-sm text-white/50"> {paymentData.payCurrency}</span>
                  </div>

                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span
                      className="min-w-0 flex-1 truncate text-xs text-white/60"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {paymentData.payAddress}
                    </span>
                    <button
                      onClick={handleCopyAddress}
                      className="shrink-0 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mb-6 text-center text-xs leading-relaxed text-white/25">
                    Send exactly this amount to the address above. Your ticket will appear automatically once the
                    payment is confirmed.
                  </p>

                  <button
                    onClick={handleCloseModal}
                    className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/45 transition-colors hover:border-white/20 hover:text-white/70"
                  >
                    Close
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ToastContainer position="bottom-center" theme="dark" />
    </div>
  );
}
