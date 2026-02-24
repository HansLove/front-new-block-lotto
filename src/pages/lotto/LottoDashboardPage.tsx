import 'react-toastify/dist/ReactToastify.css';

import { AnimatePresence, motion } from 'framer-motion';
import { Info, Plus, Ticket } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { BuyTicketModal } from '@/components/lotto/BuyTicketModal';
import { formatExact } from '@/components/lotto/formatAttempts';
import { LottoDashboardContent } from '@/components/lotto/LottoDashboardContent';
import { type PaymentLifecycleStatus } from '@/components/lotto/PaymentStatusPipeline';
import { useAuth } from '@/hooks/useLogInHook';
import { useLotto } from '@/hooks/useLotto';
import { useLottoDeposit } from '@/hooks/useLottoDeposit';
import type { LottoTicket } from '@/services/lotto';
import { redeemPromoCode } from '@/services/lotto';
import { isValidBitcoinAddress } from '@/utils/bitcoinAddress';

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

export default function LottoDashboardPage() {
  useLottoDisplayFonts();

  const navigate = useNavigate();
  const { isSessionActive, openLoginModal } = useAuth();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentLifecycleStatus>('idle');
  const [redeemCodeValue, setRedeemCodeValue] = useState('');
  const [redeemBtcAddress, setRedeemBtcAddress] = useState('');
  const [redeemSubmitting, setRedeemSubmitting] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  const {
    btcAddress,
    selectedCurrency,
    paymentData,
    orderId,
    isPending,
    isSubmitting,
    error,
    setBtcAddress,
    selectCurrency,
    submitPayment,
    resetPayment,
  } = useLottoDeposit();

  const orderIdRef = useRef(orderId);
  orderIdRef.current = orderId;

  const { tickets, stats, loading, refreshTickets, refreshTicketsSilent, addTicket, requestHighEntropyAttempt, highEntropyPending } = useLotto({
    onPaymentLifecycle: useCallback((event: { orderId: string; status: 'waiting' | 'confirming' }) => {
      if (event.orderId !== orderIdRef.current) return;
      setPaymentStatus(event.status);
    }, []),
  });

  const prevTicketsLengthRef = useRef<number>(-1);
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (!isSessionActive && !loading) openLoginModal();
  }, [isSessionActive, loading, openLoginModal]);

  useEffect(() => {
    if (isSessionActive) refreshTickets();
  }, [refreshTickets, isSessionActive]);

  useEffect(() => {
    if (prevTicketsLengthRef.current === -1) {
      prevTicketsLengthRef.current = tickets.length;
      return;
    }
    if (!isPending) {
      confirmedRef.current = false;
      prevTicketsLengthRef.current = tickets.length;
      return;
    }
    if (tickets.length > prevTicketsLengthRef.current && !confirmedRef.current) {
      confirmedRef.current = true;
      setPaymentStatus('confirmed');
      const timerId = setTimeout(() => {
        toast.success('Your ticket is now active!', { position: 'bottom-center' });
        setPaymentStatus('idle');
        resetPayment();
      }, 1500);
      prevTicketsLengthRef.current = tickets.length;
      return () => clearTimeout(timerId);
    }
    prevTicketsLengthRef.current = tickets.length;
  }, [tickets, isPending, resetPayment]);

  // Auto-collapse modal a few seconds after payment is "confirming" so user can see the skeleton on the dashboard
  const CONFIRMING_COLLAPSE_SEC = 4;
  useEffect(() => {
    if (paymentStatus !== 'confirming' || !showBuyModal) return;
    const timerId = setTimeout(() => {
      setShowBuyModal(false);
    }, CONFIRMING_COLLAPSE_SEC * 1000);
    return () => clearTimeout(timerId);
  }, [paymentStatus, showBuyModal]);

  const handleCopyAddress = () => {
    if (!paymentData) return;
    navigator.clipboard
      .writeText(paymentData.payAddress)
      .then(() => toast.success('Address copied!'))
      .catch(() => toast.error('Could not copy address'));
  };

  const handleCloseModal = () => {
    if (paymentStatus === 'waiting') {
      toast.info('Your payment is being detected. Your ticket will appear automatically.', {
        position: 'bottom-center',
      });
    }
    if (paymentStatus === 'idle' && isPending) {
      toast.info('Waiting for payment. Your ticket will appear automatically.', { position: 'bottom-center' });
    }
    setPaymentStatus('idle');
    resetPayment();
    setShowBuyModal(false);
  };

  const handleRedeemSubmit = async () => {
    const code = redeemCodeValue.trim();
    const btc = redeemBtcAddress.trim();
    setRedeemError(null);
    if (!code) {
      setRedeemError('Enter your promo code');
      return;
    }
    if (!btc) {
      setRedeemError('Enter your Bitcoin address');
      return;
    }
    if (!isValidBitcoinAddress(btc)) {
      setRedeemError('Invalid Bitcoin address. Use legacy (1...), P2SH (3...), or SegWit (bc1q...).');
      return;
    }
    setRedeemSubmitting(true);
    try {
      const newTicket = await redeemPromoCode(code, btc);
      addTicket(newTicket);
      toast.success('Promo code redeemed! Your 7-day ticket is active.', { position: 'bottom-center' });
      setRedeemCodeValue('');
      setRedeemBtcAddress('');
      setRedeemError(null);
      setShowRedeemModal(false);
      await refreshTicketsSilent();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setRedeemError(msg ?? (err instanceof Error ? err.message : 'Failed to redeem code'));
    } finally {
      setRedeemSubmitting(false);
    }
  };

  const handleForceClose = () => {
    toast.info('Your payment is confirming. Your ticket will appear automatically once confirmed.', {
      position: 'bottom-center',
      autoClose: 5000,
    });
    setPaymentStatus('idle');
    resetPayment();
    setShowBuyModal(false);
  };

  const showPaymentSkeleton =
    isPending && (paymentStatus === 'waiting' || paymentStatus === 'confirming');

  const handlePlusUltra = async (ticket: LottoTicket) => {
    try {
      toast.info('Requesting high entropy from Bitcoin mining...', { position: 'bottom-center', autoClose: 2000 });
      const result = await requestHighEntropyAttempt(ticket);
      toast.success(result.message || 'Plus Ultra initiated.', { position: 'bottom-center', autoClose: 3000 });
      await refreshTicketsSilent();
    } catch (err: unknown) {
      const res = err && typeof err === 'object' && err !== null && 'response' in err ? (err as { response?: { status?: number; data?: { message?: string } } }).response : undefined;
      const msg = res?.data?.message ?? (err instanceof Error ? err.message : 'Error initiating Plus Ultra.');
      toast.error(msg, {
        position: 'bottom-center',
        autoClose: 4000,
      });
      if (res?.status === 403) await refreshTicketsSilent();
    }
  };

  const activeTickets = tickets.filter(
    t => t.status === 'active' && new Date(t.validUntil) > new Date()
  );
  const myTotalAttempts = activeTickets.reduce(
    (sum, t) => sum + (t.nonceTotal ?? t.totalAttempts ?? 0),
    0
  );

  if (!isSessionActive) return null;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#07070a] pt-16 text-white">
      {/* Page header */}
      <div className="border-b border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

            <div className="flex items-end gap-6 sm:gap-8">
              <div className="text-right">
                <div
                  className="text-3xl font-bold tabular-nums text-white sm:text-4xl lg:text-5xl"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {formatExact(myTotalAttempts)}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/35">
                  Total attempts
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <motion.button
                  onClick={() => setShowRedeemModal(true)}
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Ticket className="h-4 w-4" />
                  Redeem code
                </motion.button>
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
        </div>
      </div>

      <LottoDashboardContent
        loading={loading}
        tickets={tickets}
        stats={stats}
        highEntropyPending={highEntropyPending}
        showPaymentSkeleton={showPaymentSkeleton}
        onBuyTicket={() => setShowBuyModal(true)}
        onOpenDetails={id => navigate(`/lotto/${id}`)}
        onPlusUltra={handlePlusUltra}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-10">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Info className="mx-auto mb-3 h-3.5 w-3.5 text-white/10" />
          <p className="text-xs leading-relaxed text-white/15">
            Block-Lotto is a probability-based participation system. Mining attempts are real and contribute to the
            Bitcoin network. Results are publicly verifiable on the blockchain.
          </p>
        </div>
      </footer>

      <BuyTicketModal
        isOpen={showBuyModal}
        paymentStatus={paymentStatus}
        paymentData={paymentData}
        btcAddress={btcAddress}
        setBtcAddress={setBtcAddress}
        selectedCurrency={selectedCurrency}
        selectCurrency={selectCurrency}
        isSubmitting={isSubmitting}
        error={error}
        onSubmitPayment={submitPayment}
        onResetPayment={resetPayment}
        onCopyAddress={handleCopyAddress}
        onClose={handleCloseModal}
        onForceClose={handleForceClose}
      />

      <AnimatePresence>
        {showRedeemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e14] p-7 shadow-2xl"
            >
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="mb-1.5 text-2xl font-semibold text-white"
              >
                Redeem promo code
              </h3>
              <p className="mb-6 text-sm text-white/35">
                Enter your code and Bitcoin address to get a free 7-day ticket with 1 Plus Ultra.
              </p>
              <input
                type="text"
                value={redeemCodeValue}
                onChange={e => {
                  setRedeemCodeValue(e.target.value);
                  setRedeemError(null);
                }}
                placeholder="Promo code (e.g. BLOCK-XXXX-XXXX)"
                className="mb-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
              <input
                type="text"
                value={redeemBtcAddress}
                onChange={e => {
                  setRedeemBtcAddress(e.target.value);
                  setRedeemError(null);
                }}
                placeholder="Bitcoin address (bc1q...)"
                className={`mb-4 w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:ring-1 ${
                  redeemError ? 'border-red-500/60 focus:border-red-500/50' : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20'
                }`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
              {redeemError && <p className="mb-4 text-xs text-red-400">{redeemError}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRedeemModal(false);
                    setRedeemError(null);
                    setRedeemCodeValue('');
                    setRedeemBtcAddress('');
                  }}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/45 transition-colors hover:border-white/20 hover:text-white/70"
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  onClick={handleRedeemSubmit}
                  disabled={redeemSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
                  whileHover={redeemSubmitting ? undefined : { scale: 1.02 }}
                  whileTap={redeemSubmitting ? undefined : { scale: 0.98 }}
                >
                  {redeemSubmitting ? 'Redeeming...' : 'Redeem'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ToastContainer position="bottom-center" theme="dark" />
    </div>
  );
}
