import { FaArrowRight, FaCheckCircle, FaCode, FaCog, FaServer } from 'react-icons/fa';

const Endpoints = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
          <FaServer className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-bold text-transparent">
          API Endpoints
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-slate-300">
          Interact with our distributed computing network through these endpoints
        </p>
      </div>

      {/* Main Endpoint */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-8 backdrop-blur-sm">
        <div className="mb-6 flex items-center">
          <div className="mr-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-3">
            <FaCode className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">POST /energy/request</h2>
            <p className="text-slate-400">The main endpoint for requesting computational energy</p>
          </div>
        </div>

        <p className="mb-6 text-slate-300">
          Requests raw computational energy from our distributed mining pool network. This energy is generated through
          real proof-of-work computations performed by connected machines.
        </p>

        <div className="rounded-lg bg-slate-900/50 p-4">
          <code className="block font-mono text-lg text-green-400">
            POST https://api.caosengine.com/v1/energy/request
          </code>
        </div>
      </div>

      {/* Request Parameters */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-bold text-white">Request Parameters</h3>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
              <div className="mb-2 flex items-center">
                <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">REQUIRED</span>
                <code className="ml-2 text-orange-400">stars</code>
              </div>
              <p className="text-sm text-slate-400">
                <strong>Integer</strong> – Difficulty level/computational intensity
              </p>
            </div>

            <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
              <div className="mb-2 flex items-center">
                <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">REQUIRED</span>
                <code className="ml-2 text-orange-400">address</code>
              </div>
              <p className="text-sm text-slate-400">
                <strong>String</strong> – Target address for the computation
              </p>
            </div>

            <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
              <div className="mb-2 flex items-center">
                <span className="rounded bg-slate-600 px-2 py-1 text-xs font-bold text-white">OPTIONAL</span>
                <code className="ml-2 text-orange-400">seed</code>
              </div>
              <p className="text-sm text-slate-400">
                <strong>String</strong> – Optional seed value for deterministic results
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-bold text-white">Authentication</h3>

          <p className="mb-4 text-slate-300">
            This endpoint requires a valid API Key sent in the{' '}
            <code className="rounded bg-slate-800 px-2 py-1 text-orange-400">X-Caos-Key</code> header:
          </p>

          <div className="rounded-lg bg-slate-900/50 p-4">
            <code className="block font-mono text-sm text-yellow-400">X-Caos-Key: YOUR_API_KEY</code>
          </div>

          <div className="mt-4 rounded-lg border border-blue-600 bg-blue-900/20 p-4">
            <p className="text-sm text-blue-400">
              💡 <strong>Tip:</strong> Generate your API key from the dashboard after logging in.
            </p>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-bold text-white">Example Request</h3>

          <div className="rounded-lg bg-slate-900/50 p-4">
            <p className="mb-2 text-sm font-medium text-slate-300">JSON Body:</p>
            <pre className="overflow-x-auto rounded bg-slate-800 p-3 font-mono text-sm text-blue-400">
              {`{
  "stars": 3,
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "seed": "optional_seed_value"
}`}
            </pre>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-bold text-white">Example Response</h3>

          <div className="rounded-lg bg-slate-900/50 p-4">
            <p className="mb-2 text-sm font-medium text-slate-300">Success Response:</p>
            <pre className="overflow-x-auto rounded bg-slate-800 p-3 font-mono text-sm text-green-400">
              {`{
  "status": 200,
  "message": "Request sent successfully to mining pool",
  "miningPoolData": {
    "minerreg": "unique_miner_registration_id",
    "timestamp": "2025-07-15T12:00:00Z"
  },
  "requestId": "req_1234567890abcdef"
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Response Flow */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-8 backdrop-blur-sm">
        <div className="mb-6 flex items-center">
          <FaCog className="mr-3 h-6 w-6 text-orange-400" />
          <h2 className="text-2xl font-bold text-white">Response Flow</h2>
        </div>

        <p className="mb-6 text-slate-300">When you make a request, the system processes it through these steps:</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4 text-center">
            <div className="mb-3 text-2xl">🔐</div>
            <h4 className="mb-2 font-semibold text-orange-400">Validate</h4>
            <p className="text-sm text-slate-400">API key validation and user extraction</p>
          </div>

          <div className="flex items-center justify-center">
            <FaArrowRight className="h-5 w-5 text-slate-500" />
          </div>

          <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4 text-center">
            <div className="mb-3 text-2xl">📤</div>
            <h4 className="mb-2 font-semibold text-orange-400">Forward</h4>
            <p className="text-sm text-slate-400">Request sent to mining pool network</p>
          </div>

          <div className="flex items-center justify-center">
            <FaArrowRight className="h-5 w-5 text-slate-500" />
          </div>

          <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4 text-center">
            <div className="mb-3 text-2xl">⚡</div>
            <h4 className="mb-2 font-semibold text-orange-400">Process</h4>
            <p className="text-sm text-slate-400">Computation performed asynchronously</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-green-600 bg-green-900/20 p-4">
          <div className="flex items-center">
            <FaCheckCircle className="mr-2 h-5 w-5 text-green-400" />
            <p className="text-sm text-green-400">
              <strong>Result Delivery:</strong> Results are delivered via webhook (if configured) or can be queried
              later
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Endpoints;
