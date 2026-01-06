const Libraries = () => {
  return (
    <section className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-white mb-4">Client Libraries</h1>

      <p className="text-gray-300">
        You can access Caos Engine API using any HTTP client in the language of
        your choice. Below are examples using some of the most popular tools.
      </p>

      <h2 className="text-xl font-semibold text-white mt-6">
        Using fetch (JavaScript)
      </h2>
      <pre className="bg-slate-800 text-blue-300 p-4 rounded text-sm overflow-x-auto">
        {`fetch("https://api.caosengine.com/random?type=sha256&length=32", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY"
  }
})
.then(res => res.json())
.then(data => console.log(data));`}
      </pre>

      <h2 className="text-xl font-semibold text-white mt-6">
        Using axios (JavaScript)
      </h2>
      <pre className="bg-slate-800 text-blue-300 p-4 rounded text-sm overflow-x-auto">
        {`import axios from "axios";

axios.get("https://api.caosengine.com/random", {
  params: { type: "sha256", length: 32 },
  headers: { Authorization: "Bearer YOUR_API_KEY" }
}).then(response => {
  console.log(response.data);
});`}
      </pre>

      <h2 className="text-xl font-semibold text-white mt-6">
        Using curl (Terminal)
      </h2>
      <pre className="bg-slate-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
        {`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.caosengine.com/random?type=sha256&length=32`}
      </pre>

      <p className="text-gray-400 mt-4">
        We are currently working on official SDKs for JavaScript, Python and Go.
        Stay tuned!
      </p>
    </section>
  );
};

export default Libraries;
