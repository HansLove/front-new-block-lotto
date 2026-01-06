import { FaBug, FaExclamationTriangle, FaServer, FaShieldAlt } from 'react-icons/fa';

const ErrorCodes = () => {
  const errorCodes = [
    {
      code: 400,
      error: 'Bad Request',
      description: 'Missing required fields: stars or address parameters.',
      icon: '❌',
      color: 'border-red-600 bg-red-900/20',
      textColor: 'text-red-400',
    },
    {
      code: 401,
      error: 'Unauthorized',
      description: 'Missing X-Caos-Key header, invalid API key, or user not identified.',
      icon: '🔐',
      color: 'border-orange-600 bg-orange-900/20',
      textColor: 'text-orange-400',
    },
    {
      code: 403,
      error: 'Forbidden',
      description: 'You do not have permission to access this resource.',
      icon: '🚫',
      color: 'border-yellow-600 bg-yellow-900/20',
      textColor: 'text-yellow-400',
    },
    {
      code: 500,
      error: 'Internal Server Error',
      description: 'Database error or internal system failure.',
      icon: '⚡',
      color: 'border-purple-600 bg-purple-900/20',
      textColor: 'text-purple-400',
    },
    {
      code: 502,
      error: 'Bad Gateway',
      description: 'Failed to communicate with Mining Pool network.',
      icon: '🌐',
      color: 'border-blue-600 bg-blue-900/20',
      textColor: 'text-blue-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg">
          <FaBug className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-bold text-transparent">
          Error Codes
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-slate-300">
          Standard HTTP status codes and their meanings in the Caos Engine API
        </p>
      </div>

      {/* Overview */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-8 backdrop-blur-sm">
        <div className="mb-6 flex items-center">
          <div className="mr-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3">
            <FaExclamationTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">HTTP Status Codes</h2>
            <p className="text-slate-400">Standard responses for API request outcomes</p>
          </div>
        </div>

        <p className="text-slate-300">
          Caos Engine API uses standard HTTP status codes to indicate the success or failure of a request. All error
          responses include a descriptive message in the response body to help with debugging and resolution.
        </p>
      </div>

      {/* Error Codes Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {errorCodes.map(error => (
          <div
            key={error.code}
            className={`rounded-xl border p-6 backdrop-blur-sm transition-all duration-200 hover:scale-105 ${error.color}`}
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 text-2xl">{error.icon}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-2xl font-bold ${error.textColor}`}>{error.code}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{error.error}</h3>
              </div>
            </div>

            <p className="text-sm text-slate-300">{error.description}</p>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center">
            <FaShieldAlt className="mr-3 h-5 w-5 text-green-400" />
            <h3 className="text-xl font-bold text-white">Best Practices</h3>
          </div>

          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start">
              <span className="mr-2 text-green-400">✓</span>
              Always check the response status code before processing data
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">✓</span>
              Implement proper error handling for all status codes
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">✓</span>
              Log error messages for debugging and monitoring
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">✓</span>
              Retry requests for 5xx server errors with exponential backoff
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center">
            <FaServer className="mr-3 h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Error Response Format</h3>
          </div>

          <div className="rounded-lg bg-slate-900/50 p-4">
            <p className="mb-2 text-sm font-medium text-slate-300">Standard Error Response:</p>
            <pre className="overflow-x-auto rounded bg-slate-800 p-3 font-mono text-sm text-red-400">
              {`{
  "error": {
    "code": 401,
    "message": "Invalid API key",
    "details": "The provided X-Caos-Key header is invalid"
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorCodes;
