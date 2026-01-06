import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Activity, Info, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios, { AxiosError } from 'axios';
import { DepositModal } from '@taloon/nowpayments-components';

import { TicketCard } from '@/components/lotto/TicketCard';
import { useLotto } from '@/hooks/useLotto';
import { useAuth } from '@/hooks/useLogInHook';
import type { LottoTicket } from '@/services/lotto';
import { API_URL } from '@/utils/Rutes';

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
  const { user, isSessionActive, openLoginModal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [btcAddress, setBtcAddress] = useState('');
  const [showBuyModal, setShowBuyModal] = useState(false);

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

  const handleBuyTicket = () => {
    if (!btcAddress || btcAddress.trim().length < 26) {
      alert('Please enter a valid Bitcoin address');
      return;
    }
    setShowBuyModal(false);
    openModal();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Custom onSubmit that includes lotto ticket metadata
  const handleLottoSubmit = async (depositModalData: any) => {
    const token = localStorage.getItem('token');

    const payload = {
      amount: 10, // Fixed $10 for lotto ticket
      orderId: `lotto-ticket-${Date.now()}`,
      email: user?.email.toLowerCase() || '',
      cryptoCurrency: depositModalData.selectedCurrency,
      description: `Block-Lotto Ticket for ${btcAddress}`,
      currency: 'usd',
      metadata: {
        charge: 'lotto_ticket',
        btcAddress: btcAddress,
        btc_address: btcAddress, // Support both formats
        validDays: 30,
      },
    };

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(`${API_URL}api/v1/payment/nowpayments`, payload, options);
    return response.data;
  };

  const handleDepositSuccess = async (response: any) => {
    // Ticket will be created automatically via webhook when payment completes
    // Just refresh the tickets list
    setTimeout(() => {
      refreshTickets();
    }, 2000); // Wait a bit for webhook to process
    return {
      address: response.payment.address,
      paymentId: response.payment.order_id,
    };
  };

  const handlePlusUltra = async (ticket: LottoTicket) => {
    try {
      toast.info(`Initiating Plus Ultra for ticket ${ticket.ticketId}...`, {
        position: 'bottom-center',
        autoClose: 2000,
      });

      const result = await requestHighEntropyAttempt(ticket, 12);
      
      toast.success(`Plus Ultra completed! ${result.leadingZeros} leading zeros.`, {
        position: 'bottom-center',
        autoClose: 3000,
      });

      // Refresh tickets to get updated attempt count
      await refreshTickets();
    } catch (error: any) {
      console.error('Plus Ultra error:', error);
      toast.error(
        error.message === 'Request timed out'
          ? 'Plus Ultra request timed out. Please try again.'
          : 'Error initiating Plus Ultra. Please try again.',
        {
          position: 'bottom-center',
          autoClose: 4000,
        }
      );
    }
  };

  const activeTickets = tickets.filter(t => t.status === 'active' && new Date(t.validUntil) > new Date());

  if (!isSessionActive) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <DepositModal
        isOpen={isModalOpen}
        onClose={closeModal}
        shouldNotifyByEmail={false}
        onSubmit={async form => await handleLottoSubmit(form)}
        onSuccess={handleDepositSuccess}
        onError={error => {
          if (error instanceof AxiosError) {
            return error.response?.data.error.message || 'Payment failed due to a network error.';
          }
        }}
      />

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lotto-blue-500 text-xl font-bold text-white">
                B
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Block-Lotto</h1>
            </div>
            <nav className="hidden gap-6 md:flex">
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">
                How it works
              </a>
              <a href="#transparency" className="text-sm text-gray-600 hover:text-gray-900">
                Transparency
              </a>
              <a href="#stats" className="text-sm text-gray-600 hover:text-gray-900">
                Stats
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBuyModal(true)}
                className="rounded-lg bg-lotto-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-lotto-green-600"
              >
                + New Lotto
              </button>
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                Connect
              </button>
            </div>
          </div>
        </div>
      </header>

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
            <a href="#transparency" className="text-gray-600 hover:text-gray-900">
              View Contracts →
            </a>
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
              <h3 className="mb-4 text-xl font-bold text-gray-900">Buy Block-Lotto Ticket</h3>
              <p className="mb-4 text-sm text-gray-600">
                Enter your Bitcoin address to receive rewards if you win. Tickets are $10 USD and valid for 30 days.
              </p>
              <input
                type="text"
                value={btcAddress}
                onChange={e => setBtcAddress(e.target.value)}
                placeholder="Enter Bitcoin address..."
                className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-lotto-green-500 focus:outline-none focus:ring-2 focus:ring-lotto-green-500/20"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyTicket}
                  className="flex-1 rounded-lg bg-lotto-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-lotto-green-600"
                >
                  Continue to Payment
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
            {stats && (
              <div className="text-sm text-gray-500">
                Network Hashrate: 452 EH/s
              </div>
            )}
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
              {activeTickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => navigate(`/lotto/${ticket.id}`)}
                  onPlusUltra={handlePlusUltra}
                  difficulty="12.5 T"
                  isPlusUltraPending={highEntropyPending[ticket.ticketId] || false}
                />
              ))}
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
