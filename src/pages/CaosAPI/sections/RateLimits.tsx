const RateLimits = () => {
  return (
    <section className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-white mb-4">Rate Limits</h1>

      <p className="text-gray-300">
        To ensure fair usage and prevent abuse, Caos Engine API enforces rate
        limits based on the plan associated with your API Key.
      </p>

      <h2 className="text-xl font-semibold text-white mt-6">Default Limits</h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2">
        <li>
          <strong>Free Tier:</strong> 100 requests per day
        </li>
        <li>
          <strong>Premium Tier:</strong> 10,000 requests per day
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-6">
        Rate Limit Headers
      </h2>
      <p className="text-gray-400">
        Each response includes headers that allow you to monitor your remaining
        quota:
      </p>

      <pre className="bg-slate-800 text-yellow-300 p-4 rounded text-sm overflow-x-auto">
        X-RateLimit-Limit: 100 X-RateLimit-Remaining: 42 X-RateLimit-Reset:
        1718847600
      </pre>

      <p className="text-gray-400 mt-4">
        <strong>X-RateLimit-Reset</strong> is a Unix timestamp indicating when
        your quota will reset.
      </p>

      <h2 className="text-xl font-semibold text-white mt-6">
        Exceeding Limits
      </h2>
      <p className="text-gray-400">
        If you exceed your quota, the API will return a{" "}
        <code className="text-white">429 Too Many Requests</code> error. You
        should back off and wait until the limit resets before retrying.
      </p>
    </section>
  );
};

export default RateLimits;
