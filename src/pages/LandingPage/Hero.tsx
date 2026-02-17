import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useLogInHook';

const Hero = () => {
  const { isSessionActive, openLoginModal } = useAuth();
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    if (isSessionActive) {
      navigate('/lotto');
    } else {
      openLoginModal();
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Background: subtle grid + gradient */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #22c55e 1px, transparent 1px),
            linear-gradient(to bottom, #22c55e 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-lotto-green-50/50 via-white to-white" />

      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl flex-col justify-center text-center">
        <motion.p
          className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-lotto-green-600"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mini proof of work · 24/7
        </motion.p>

        <motion.h1
          className="font-display mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Mine. Every block.
          <br />
          <span className="text-lotto-green-600">Every day.</span>
        </motion.h1>

        <motion.p
          className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          While the world sleeps, our system runs. The first transparent, high-frequency lottery on the blockchain—powered by constant mining. No house edge. Just pure probability and the power of consistency.
        </motion.p>

        <motion.p
          className="mx-auto mb-10 max-w-xl text-base text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          Powered by{' '}
          <a
            href="https://spoon.energy/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-lotto-green-600 underline decoration-lotto-green-300 underline-offset-2 transition-colors hover:text-lotto-green-700 hover:decoration-lotto-green-500"
          >
            Spoon
          </a>
          —our mining pool. The blocks are ours. The community&apos;s.
        </motion.p>

        <motion.div
          className="mb-10 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-lotto-green-200 bg-lotto-green-50/80 px-5 py-3"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <span className="text-sm font-medium text-gray-700">Hit the Bitcoin block →</span>
          <span className="font-display text-lg font-bold text-lotto-green-700">
            Win 3+ BTC
          </span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <motion.button
            onClick={handleStartPlaying}
            className="w-full rounded-xl bg-lotto-green-500 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-lotto-green-500/25 transition-colors hover:bg-lotto-green-600 sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start mining
          </motion.button>
          <Link
            to="/lotto"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            See live rounds →
          </Link>
        </motion.div>

        <motion.p
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="#transparency" className="text-sm text-gray-400 transition-colors hover:text-gray-600">
            View contracts
          </Link>
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
