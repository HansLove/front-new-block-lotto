import {
  BoltIcon,
  CpuChipIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

function Aboutcaos() {
  return (
    <div className="bg-dots-bottom w-full bg-slate-950 px-4 pb-40 dark:bg-slate-100">
      <div className="mx-auto px-4 py-16 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8 lg:py-20">
        <div className="max-w-6xl sm:mx-auto sm:text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500">
            <BoltIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-6 font-sans text-5xl font-bold tracking-tight text-red-600 sm:leading-none md:text-6xl">
            Entropy as Currency
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-gradient-to-r from-red-600 to-orange-500"></div>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-300 dark:text-slate-600 sm:px-4 md:text-xl">
            Transform waste energy into measurable value through industrial-grade randomization and simulation
            technologies. Block Lotto harnesses the mathematical purity of entropy to power critical systems across
            energy management, predictive modeling, and resource optimization. Our enterprise solutions convert
            computational waste into verifiable randomness—turning inefficiency into opportunity.
          </p>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">99.7%</div>
              <div className="text-sm text-gray-400 dark:text-slate-500">Energy Efficiency</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-orange-500">10M+</div>
              <div className="text-sm text-gray-400 dark:text-slate-500">Simulations/Hour</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-600">∞</div>
              <div className="text-sm text-gray-400 dark:text-slate-500">Entropy Sources</div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        {/* <!-- Card #1: Waste Energy Management --> */}
        <div className="group overflow-hidden rounded-3xl border border-red-900/50 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl transition-all duration-500 hover:shadow-red-500/20 dark:border-red-300/50 dark:from-slate-100 dark:to-slate-200">
          <div className="relative">
            <div className="px-8 py-8">
              <div className="mb-4 flex items-center">
                <div className="mr-4 rounded-xl bg-red-600/20 p-3">
                  <BoltIcon className="h-8 w-8 text-red-400" />
                </div>
                <div className="text-xl font-bold text-slate-100 dark:text-slate-800">Waste Energy Recovery</div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 dark:text-slate-600">
                Transform computational waste into verifiable entropy through our industrial-grade energy recovery
                systems. Our proprietary algorithms capture and convert excess processing power into high-quality random
                number generation, turning inefficiency into measurable value. Perfect for data centers, mining
                operations, and high-performance computing environments seeking to monetize their computational waste.
              </p>
              <div className="mt-6 flex items-center text-xs text-red-400 dark:text-red-600">
                <ExclamationTriangleIcon className="mr-2 h-4 w-4" />
                <span>Industrial-grade energy conversion</span>
              </div>
            </div>
            <div className="relative transition-transform duration-500 ease-in-out group-hover:-translate-y-1">
              <img
                className="w-full transition-opacity duration-500 group-hover:opacity-0"
                src="/images/card1.png"
                height="200"
                alt="Waste Energy Recovery System"
              />
              <img
                className="absolute left-0 top-0 w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                src="/images/card1h.png"
                height="200"
                alt="Waste Energy Recovery System - Active State"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        {/* <!-- Card #2: High-Quality Simulations --> */}
        <div className="group overflow-hidden rounded-3xl border border-orange-900/50 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl transition-all duration-500 hover:shadow-orange-500/20 dark:border-orange-300/50 dark:from-slate-100 dark:to-slate-200">
          <div className="relative">
            <div className="px-8 py-8">
              <div className="mb-4 flex items-center">
                <div className="mr-4 rounded-xl bg-orange-600/20 p-3">
                  <CpuChipIcon className="h-8 w-8 text-orange-400" />
                </div>
                <div className="text-xl font-bold text-slate-100 dark:text-slate-800">Advanced Simulations</div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 dark:text-slate-600">
                Deploy Monte Carlo simulations, predictive modeling, and stochastic analysis with mathematical
                precision. Our simulation engine processes millions of scenarios per hour using true entropy sources,
                ensuring statistically valid results for financial modeling, risk assessment, and scientific research.
                Enterprise-grade performance with verifiable randomness guarantees.
              </p>
              <div className="mt-6 flex items-center text-xs text-orange-400 dark:text-orange-600">
                <SparklesIcon className="mr-2 h-4 w-4" />
                <span>Mathematical purity guaranteed</span>
              </div>
            </div>
            <div className="relative transition-transform duration-500 ease-in-out group-hover:-translate-y-1">
              <img
                className="w-full transition-opacity duration-500 group-hover:opacity-0"
                src="/images/card2.png"
                height="200"
                alt="Advanced Simulation Engine"
              />
              <img
                className="absolute left-0 top-0 w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                src="/images/card2h.png"
                height="200"
                alt="Advanced Simulation Engine - Active State"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        {/* <!-- Card #3: Entropy as Currency --> */}
        <div className="group overflow-hidden rounded-3xl border border-red-900/50 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl transition-all duration-500 hover:shadow-red-500/20 dark:border-red-300/50 dark:from-slate-100 dark:to-slate-200">
          <div className="relative">
            <div className="px-8 py-8">
              <div className="mb-4 flex items-center">
                <div className="mr-4 rounded-xl bg-red-600/20 p-3">
                  <CurrencyDollarIcon className="h-8 w-8 text-red-400" />
                </div>
                <div className="text-xl font-bold text-slate-100 dark:text-slate-800">Entropy Monetization</div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 dark:text-slate-600">
                Convert entropy into measurable economic value through our proprietary randomization-as-a-service
                platform. Trade computational waste for verifiable randomness, participate in entropy markets, and
                monetize your unused processing power. Our blockchain-verified system ensures fair value exchange while
                maintaining the mathematical integrity of your entropy sources.
              </p>
              <div className="mt-6 flex items-center text-xs text-red-400 dark:text-red-600">
                <CubeTransparentIcon className="mr-2 h-4 w-4" />
                <span>Blockchain-verified transactions</span>
              </div>
            </div>
            <div className="relative transition-transform duration-500 ease-in-out group-hover:-translate-y-1">
              <img
                className="w-full transition-opacity duration-500 group-hover:opacity-0"
                src="/images/card3.png"
                height="200"
                alt="Entropy Monetization Platform"
              />
              <img
                className="absolute left-0 top-0 w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                src="/images/card3h.png"
                height="200"
                alt="Entropy Monetization Platform - Active State"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <div className="mx-auto mt-20 max-w-6xl px-4">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-12 text-center shadow-2xl dark:from-slate-100 dark:to-slate-200">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500">
            <BoltIcon className="h-10 w-10 text-white" />
          </div>
          <h3 className="mb-6 text-4xl font-bold text-slate-100 dark:text-slate-800">
            Ready to Transform Your Waste Energy?
          </h3>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-300 dark:text-slate-600">
            Join leading enterprises who are already converting computational waste into measurable value. Our
            industrial-grade entropy systems and high-quality simulation platforms are ready to power your next
            breakthrough. Contact our energy solutions team to discover how Block Lotto can optimize your infrastructure
            and unlock hidden value in your computational resources.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-red-500/25"
            >
              Contact Energy Solutions
            </a>
            <a
              href="/simulations"
              className="rounded-xl border-2 border-red-600/50 px-8 py-4 text-lg font-semibold text-red-400 transition-all duration-300 hover:bg-red-600/10 dark:text-red-600 dark:hover:bg-red-600/10"
            >
              Explore Simulations
            </a>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 dark:text-red-600">24/7</div>
              <div className="text-sm text-slate-400 dark:text-slate-500">Energy Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 dark:text-orange-600">99.9%</div>
              <div className="text-sm text-slate-400 dark:text-slate-500">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500 dark:text-red-700">∞</div>
              <div className="text-sm text-slate-400 dark:text-slate-500">Scalability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutcaos;
