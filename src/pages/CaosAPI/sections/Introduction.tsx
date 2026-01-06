import { FaCogs, FaNetworkWired, FaRocket, FaShieldAlt } from 'react-icons/fa';

const Introduction = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-bold text-transparent">
          API Reference
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-slate-300">
          The Caos Engine API provides verifiable, tamper-proof randomness through real-world computation performed by
          decentralized compute nodes.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
            <FaShieldAlt className="h-6 w-6 text-white" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">Secure by Default</h3>
          <p className="text-sm text-slate-400">
            All endpoints use strong authentication and return tamper-proof results.
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
            <FaCogs className="h-6 w-6 text-white" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">Simple Integration</h3>
          <p className="text-sm text-slate-400">RESTful endpoints with standard JSON format for easy integration.</p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
            <FaNetworkWired className="h-6 w-6 text-white" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">Decentralized</h3>
          <p className="text-sm text-slate-400">Powered by distributed compute nodes for maximum reliability.</p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
            <FaRocket className="h-6 w-6 text-white" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">High Performance</h3>
          <p className="text-sm text-slate-400">Optimized for speed and scalability in production environments.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-8 backdrop-blur-sm">
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-white">What You Can Build</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
                <h3 className="mb-2 font-semibold text-orange-400">Gaming & Simulations</h3>
                <p className="text-sm text-slate-400">
                  Generate fair, unpredictable outcomes for games, lotteries, and simulations.
                </p>
              </div>
              <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
                <h3 className="mb-2 font-semibold text-orange-400">Cryptographic Operations</h3>
                <p className="text-sm text-slate-400">
                  Create secure random seeds for encryption, key generation, and digital signatures.
                </p>
              </div>
              <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
                <h3 className="mb-2 font-semibold text-orange-400">Scientific Research</h3>
                <p className="text-sm text-slate-400">
                  Power Monte Carlo simulations and statistical sampling with verified randomness.
                </p>
              </div>
              <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
                <h3 className="mb-2 font-semibold text-orange-400">Blockchain Applications</h3>
                <p className="text-sm text-slate-400">
                  Integrate verifiable randomness into smart contracts and DeFi protocols.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Getting Started</h2>
            <p className="mb-4 text-slate-300">
              This documentation will guide you through authentication, endpoint structure, request formats, error
              handling, and best practices for secure and scalable integration.
            </p>
            <div className="rounded-lg bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400">
                💡 <strong className="text-slate-300">Pro Tip:</strong> Start with our Getting Started guide to create
                your first API key and make your first request in minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
