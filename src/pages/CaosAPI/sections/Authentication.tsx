import { FaCode, FaKey, FaLock, FaShieldAlt } from 'react-icons/fa';

const Authentication = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
          <FaShieldAlt className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-bold text-transparent">
          Authentication
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-slate-300">
          Secure your API requests with encrypted authentication tokens
        </p>
      </div>

      {/* Overview */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-8 backdrop-blur-sm">
        <div className="mb-6 flex items-center">
          <div className="mr-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-3">
            <FaKey className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">API Key Required</h2>
            <p className="text-slate-400">All requests must include a valid API key for authentication</p>
          </div>
        </div>

        <p className="text-slate-300">
          All requests to the Caos Engine API must be authenticated using an API Key. You can generate an API Key from
          your dashboard after logging into your account.
        </p>
      </div>

      {/* Header Format */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center">
            <FaCode className="mr-3 h-5 w-5 text-orange-400" />
            <h3 className="text-xl font-bold text-white">Header Format</h3>
          </div>

          <p className="mb-4 text-slate-300">
            Include your API Key in the{' '}
            <code className="rounded bg-slate-800 px-2 py-1 text-orange-400">X-Caos-Key</code> header:
          </p>

          <div className="rounded-lg bg-slate-900/50 p-4">
            <p className="mb-2 text-sm font-medium text-slate-400">Header:</p>
            <code className="block rounded bg-slate-800 p-3 font-mono text-sm text-green-400">
              X-Caos-Key: YOUR_API_KEY
            </code>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center">
            <FaLock className="mr-3 h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Security</h3>
          </div>

          <p className="mb-4 text-slate-300">
            The API Key is an encrypted token that contains your email and authentication secret.
          </p>

          <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
            <p className="text-sm text-slate-400">
              ⚠️ If your API Key is missing or invalid, the server will respond with a{' '}
              <code className="text-red-400">401 Unauthorized</code> error.
            </p>
          </div>
        </div>
      </div>

      {/* Example Request */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-bold text-white">Example Request</h2>

        <div className="rounded-lg bg-slate-900/50 p-6">
          <p className="mb-4 text-sm font-medium text-slate-300">cURL Example:</p>
          <pre className="overflow-x-auto rounded bg-slate-800 p-4 font-mono text-sm text-blue-400">
            {`curl -H "X-Caos-Key: 6seGLn1C4a..." \\
     -X POST \\
     -H "Content-Type: application/json" \\
     -d '{"stars": 3, "address": "your_address"}' \\
     https://api.caosengine.com/v1/energy/request`}
          </pre>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
            <h4 className="mb-2 font-semibold text-orange-400">Header</h4>
            <p className="text-sm text-slate-400">X-Caos-Key with your API token</p>
          </div>
          <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
            <h4 className="mb-2 font-semibold text-orange-400">Method</h4>
            <p className="text-sm text-slate-400">POST request with JSON body</p>
          </div>
          <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4">
            <h4 className="mb-2 font-semibold text-orange-400">Content-Type</h4>
            <p className="text-sm text-slate-400">application/json required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
