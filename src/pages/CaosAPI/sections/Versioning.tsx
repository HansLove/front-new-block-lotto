
const Versioning = () => {
  return (
    <section className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-white mb-4">Versioning</h1>

      <p className="text-gray-300">
        The Caos Engine API is versioned to ensure backward compatibility and
        stable integrations. All endpoints are prefixed with a version
        identifier in the URL.
      </p>

      <h2 className="text-xl font-semibold text-white mt-6">Current Version</h2>
      <p className="text-gray-400">
        The current version is:
        <code className="ml-2 text-white font-mono text-sm">v1</code>
      </p>

      <h2 className="text-xl font-semibold text-white mt-6">Base URL</h2>
      <pre className="bg-slate-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
        https://api.caosengine.com/v1
      </pre>

      <h2 className="text-xl font-semibold text-white mt-6">Future Versions</h2>
      <p className="text-gray-400">
        When major changes are introduced, a new version will be released (e.g.,{" "}
        <code>v2</code>), and previous versions will be maintained with a clear
        deprecation timeline.
      </p>

      <p className="text-gray-400 mt-4">
        You will be notified via dashboard and email when a new version becomes
        available.
      </p>

      <h2 className="text-xl font-semibold text-white mt-6">Best Practices</h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2">
        <li>Always specify the version explicitly in your requests.</li>
        <li>Subscribe to updates and changelogs to stay informed.</li>
        <li>
          Avoid relying on undocumented behavior or experimental features.
        </li>
      </ul>
    </section>
  );
};

export default Versioning;
