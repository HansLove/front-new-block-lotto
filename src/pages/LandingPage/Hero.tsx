import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import LoginRequiredModal from '../../components/modals/LoginRequiredModal';
import { useAuth } from '../../hooks/useLogInHook';
import { useLotto } from '../../hooks/useLotto';
import { TicketCard } from '../../components/lotto/TicketCard';

const Hero: React.FC = () => {
  const { isSessionActive } = useAuth();
  const { tickets = [], stats, loading } = useLotto(); // Hook handles no-auth case gracefully
  const [shouldLogIn, setShouldLogIn] = useState(false);
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    if (isSessionActive) {
      navigate('/lotto');
    } else {
      setShouldLogIn(true);
    }
  };

  const activeTickets = tickets?.filter(t => t.status === 'active' && new Date(t.validUntil) > new Date()) || [];
  const displayTickets = activeTickets.slice(0, 3);

  return (
    <>
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
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Main headline and CTA */}
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-normal italic leading-tight text-gray-900 sm:text-6xl md:text-7xl">
              Decentralized luck. Powered by math.
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl">
              Participate in the first transparent, high-frequency lottery system active on the blockchain. No house edge,
              just pure probability.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={handleStartPlaying}
                className="rounded-lg bg-lotto-green-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-lotto-green-600"
              >
                Start Playing
              </button>
              <Link to="#transparency" className="text-gray-600 transition-colors hover:text-gray-900">
                View Contracts →
              </Link>
            </div>
          </div>

          {/* Active Lottos Section */}
          <div className="mb-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lotto-blue-500/10 text-lotto-blue-500">
                  <CubeTransparentIcon className="h-5 w-5" />
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
            ) : displayTickets.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <CubeTransparentIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h4 className="mb-2 text-lg font-semibold text-gray-900">No Active Tickets</h4>
                <p className="mb-6 text-sm text-gray-600">
                  Purchase a ticket to start participating in Block-Lotto
                </p>
                <button
                  onClick={handleStartPlaying}
                  className="rounded-lg bg-lotto-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-lotto-green-600"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayTickets.map(ticket => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => navigate(`/lotto/${ticket.id}`)}
                    difficulty={stats?.difficulty || '12.5 T'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <LoginRequiredModal isOpen={shouldLogIn} onClose={() => setShouldLogIn(false)} />
    </>
  );
};

export default Hero;
