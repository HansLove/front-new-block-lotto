import { USDTNetwork } from '@taloon/nowpayments-components';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Copy, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';

import {
  type PaymentLifecycleStatus,
  PaymentStatusPipeline,
  PaymentWarningBanner,
} from '@/components/lotto/PaymentStatusPipeline';
import type { LottoPaymentResult } from '@/services/lottoPayment';
import { isValidBitcoinAddress } from '@/utils/bitcoinAddress';

import { USDT_NETWORK_LABELS } from './constants';

export interface BuyTicketModalProps {
  isOpen: boolean;
  paymentStatus: PaymentLifecycleStatus;
  paymentData: LottoPaymentResult | null;
  btcAddress: string;
  setBtcAddress: (value: string) => void;
  selectedCurrency: USDTNetwork;
  selectCurrency: (value: USDTNetwork) => void;
  isSubmitting: boolean;
  error: string | null;
  onSubmitPayment: () => void;
  onResetPayment: () => void;
  onCopyAddress: () => void;
  onClose: () => void;
  onForceClose: () => void;
}

export function BuyTicketModal({
  isOpen,
  paymentStatus,
  paymentData,
  btcAddress,
  setBtcAddress,
  selectedCurrency,
  selectCurrency,
  isSubmitting,
  error,
  onSubmitPayment,
  onResetPayment,
  onCopyAddress,
  onClose,
  onForceClose,
}: BuyTicketModalProps) {
  const [btcAddressError, setBtcAddressError] = useState<string | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const waitingStartedAtRef = useRef<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (paymentStatus === 'waiting') {
      if (waitingStartedAtRef.current === null) waitingStartedAtRef.current = Date.now();
    } else if (paymentStatus === 'idle' || paymentStatus === 'confirmed') {
      waitingStartedAtRef.current = null;
      setElapsedSec(0);
    }
  }, [paymentStatus]);

  useEffect(() => {
    if (paymentStatus !== 'waiting' && paymentStatus !== 'confirming') return;
    const interval = setInterval(() => {
      const start = waitingStartedAtRef.current;
      setElapsedSec(start ? Math.floor((Date.now() - start) / 1000) : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentStatus]);

  const handleSubmitPayment = () => {
    const trimmed = btcAddress.trim();
    if (!trimmed) {
      setBtcAddressError('Enter your Bitcoin address');
      toast.error('Enter your Bitcoin address');
      return;
    }
    if (!isValidBitcoinAddress(btcAddress)) {
      setBtcAddressError(
        'Invalid Bitcoin address. Use a legacy (1...), P2SH (3...), or SegWit (bc1q...) address.'
      );
      toast.error('Invalid Bitcoin address');
      return;
    }
    setBtcAddressError(null);
    onSubmitPayment();
  };

  const handleCancel = () => {
    onResetPayment();
    setBtcAddressError(null);
    onClose();
  };

  const handleCloseModal = () => {
    if (paymentStatus === 'confirming') {
      setShowCloseConfirm(true);
      return;
    }
    onClose();
  };

  const handleForceClose = () => {
    setShowCloseConfirm(false);
    onForceClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
                onChange={e => {
                  setBtcAddress(e.target.value);
                  if (btcAddressError) setBtcAddressError(null);
                }}
                onBlur={() => {
                  const trimmed = btcAddress.trim();
                  if (trimmed && !isValidBitcoinAddress(btcAddress)) {
                    setBtcAddressError(
                      'Invalid Bitcoin address. Use legacy (1...), P2SH (3...), or SegWit (bc1q...).'
                    );
                  } else if (trimmed) {
                    setBtcAddressError(null);
                  }
                }}
                placeholder="Bitcoin address (bc1q...)"
                className={`mb-1 w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:ring-1 ${
                  btcAddressError
                    ? 'border-red-500/60 focus:border-red-500/50 focus:ring-red-500/20'
                    : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20'
                }`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                aria-invalid={!!btcAddressError}
                aria-describedby={btcAddressError ? 'btc-address-error' : undefined}
              />
              {btcAddressError && (
                <p id="btc-address-error" className="mb-4 text-xs text-red-400">
                  {btcAddressError}
                </p>
              )}

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
                  onClick={handleCancel}
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
                className="mb-4 text-2xl font-semibold text-white"
              >
                Send Payment
              </h3>

              <PaymentStatusPipeline status={paymentStatus} />

              {(paymentStatus === 'waiting' || paymentStatus === 'confirming') && (
                <div className="mb-4 space-y-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <p className="text-xs leading-relaxed text-white/45">
                    Confirmations usually take 2–5 minutes. You can close this and your ticket will still
                    activate.
                  </p>
                  {elapsedSec > 0 && (
                    <p
                      className="text-[11px] text-white/35"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {paymentStatus === 'waiting' ? 'Waiting' : 'Confirming'}{' '}
                      {String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:
                      {String(elapsedSec % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>
              )}

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
                <span className="text-base font-bold text-amber-400">
                  {Math.round(Number(paymentData.payAmount))} USDT
                </span>
              </div>

              <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                <span
                  className="min-w-0 flex-1 truncate text-xs text-white/60"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {paymentData.payAddress}
                </span>
                <button
                  onClick={onCopyAddress}
                  className="shrink-0 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <p className="mb-3 text-center text-xs leading-relaxed text-white/25">
                Send exactly this amount to the address above. Your ticket will appear automatically once the
                payment is confirmed.
              </p>

              <p className="mb-4 text-center text-[11px] text-white/35">
                Your payment is secure. The ticket will appear on your dashboard once the network confirms it.
              </p>

              <PaymentWarningBanner status={paymentStatus} />

              <AnimatePresence mode="wait">
                {showCloseConfirm ? (
                  <motion.div
                    key="close-confirm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden rounded-xl border border-amber-500/25 bg-amber-500/[0.08] p-4"
                  >
                    <p className="mb-3 text-xs leading-relaxed text-amber-400/75">
                      Your payment is confirming on-chain. Closing now won&apos;t cancel it — your ticket will
                      still activate automatically.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCloseConfirm(false)}
                        className="flex-1 rounded-lg border border-white/10 py-2.5 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white/80"
                      >
                        Stay
                      </button>
                      <button
                        onClick={handleForceClose}
                        className="flex-1 rounded-lg border border-amber-500/20 bg-amber-500/10 py-2.5 text-xs font-medium text-amber-400/70 transition-colors hover:bg-amber-500/15"
                      >
                        Close anyway
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="close-btn"
                    onClick={handleCloseModal}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                      paymentStatus === 'confirming'
                        ? 'border-amber-500/20 text-white/50 hover:border-amber-500/35 hover:text-white/70'
                        : 'border-white/10 text-white/45 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    {paymentStatus === 'confirming' && (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400/60" />
                    )}
                    {paymentStatus === 'confirming' ? 'Close (confirming...)' : 'Close'}
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
