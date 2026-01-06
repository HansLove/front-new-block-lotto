import { Fade, Slide, Zoom } from 'react-awesome-reveal';
import { FaExternalLinkAlt, FaKey } from 'react-icons/fa';
import { GiServerRack } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const GettingStarted = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Zoom triggerOnce>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
            <GiServerRack className="h-10 w-10 text-white" />
          </div>
        </Zoom>
        <Slide triggerOnce>
          <h1 className="mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-5xl font-bold text-transparent">
            Caos Engine API
          </h1>
        </Slide>
        <p className="mx-auto max-w-3xl text-xl text-slate-300">
          Get started with the most powerful decentralized randomness API
        </p>
      </div>

      {/* Overview Section */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-8 backdrop-blur-sm">
        <Fade cascade triggerOnce>
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">How It Works</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
                  <div className="mb-2 text-2xl">⚡</div>
                  <h3 className="mb-2 font-semibold text-orange-400">Request Energy</h3>
                  <p className="text-sm text-slate-400">
                    Your application requests computational energy through our API endpoints.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
                  <div className="mb-2 text-2xl">🔗</div>
                  <h3 className="mb-2 font-semibold text-orange-400">Real Computation</h3>
                  <p className="text-sm text-slate-400">
                    Our distributed mining network performs actual proof-of-work operations.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
                  <div className="mb-2 text-2xl">✅</div>
                  <h3 className="mb-2 font-semibold text-orange-400">Verified Results</h3>
                  <p className="text-sm text-slate-400">
                    Receive cryptographically verifiable randomness with proof of computation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-300">
                Caos API allows any system to request computational energy using real operations performed by our
                distributed mining network. Instead of trusting centralized logic, you interact with the fundamental
                forces of distributed computation, verifiable through proof-of-work operations and cryptographic
                validation.
              </p>
              <p className="text-slate-400">
                Every request triggers real computational work executed by our network of mining machines — delivering
                pure, verifiable computational energy.
              </p>
            </div>
          </div>
        </Fade>
      </div>

      {/* API Endpoint Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-bold text-white">Main API Endpoint</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-900/50 p-4">
              <p className="mb-2 text-sm font-medium text-slate-300">Endpoint URL:</p>
              <code className="block rounded bg-slate-800 p-3 font-mono text-sm text-green-400">
                POST https://api.caosengine.com/v1/energy/request
              </code>
            </div>
            <p className="text-sm text-slate-400">
              Requests computational energy through real proof-of-work operations performed by our distributed mining
              network.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-bold text-white">Example Request</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-900/50 p-4">
              <p className="mb-2 text-sm font-medium text-slate-300">Request Body:</p>
              <pre className="overflow-x-auto rounded bg-slate-800 p-3 font-mono text-sm text-blue-400">
                {`{
  "stars": 3,
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "seed": "optional_seed_value"
}`}
              </pre>
            </div>
            <div className="space-y-2 text-sm text-slate-400">
              <p>
                <strong className="text-slate-300">stars:</strong> Controls computational difficulty
              </p>
              <p>
                <strong className="text-slate-300">address:</strong> Target for computation
              </p>
              <p>
                <strong className="text-slate-300">seed:</strong> Optional for deterministic results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Section */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-8 backdrop-blur-sm">
        <div className="mb-6 flex items-center">
          <div className="mr-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-3">
            <FaKey className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">API Key Required</h2>
            <p className="text-slate-400">Secure authentication for all API requests</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-slate-300">
              To start using the Caos Engine API, you&apos;ll need an API key. Our API uses the{' '}
              <code className="rounded bg-slate-800 px-2 py-1 text-orange-400">X-Caos-Key</code> header for
              authentication instead of the traditional Bearer token format.
            </p>

            <div className="rounded-lg bg-slate-900/50 p-4">
              <p className="mb-2 text-sm font-medium text-slate-300">Authentication Header:</p>
              <code className="block rounded bg-slate-800 p-3 font-mono text-sm text-yellow-400">
                X-Caos-Key: YOUR_API_KEY
              </code>
            </div>
          </div>

          <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">Manage Your API Keys</h3>
            <p className="mb-4 text-sm text-slate-400">
              Create, view, and manage your API keys in the dedicated management section. You&apos;ll need to be logged
              in to generate new keys.
            </p>
            <Link
              to="/api-key"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-red-700 hover:to-orange-700 hover:shadow-red-500/25"
            >
              <span>Go to API Keys</span>
              <FaExternalLinkAlt size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/30 to-slate-900/20 p-8 text-center backdrop-blur-sm">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 text-4xl">💭</div>
          <blockquote className="text-xl font-medium text-slate-300">
            &quot;Caos is not destruction — it is pure computation.&quot;
          </blockquote>
          <cite className="mt-3 block text-sm text-orange-400">– Bob Burnett</cite>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
