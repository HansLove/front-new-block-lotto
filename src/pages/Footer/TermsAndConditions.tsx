export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-surface-base px-6 py-12 text-white">
      <div className="flex justify-around border-b border-white/[0.07]">
        <a href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Block Lotto</span>
          <img className="h-12 w-auto" src="/images/logo-light.png" alt="Block Lotto" />
        </a>
        <h1 className="mb-6 flex items-center gap-3 pb-4 text-4xl font-bold">Terms and Conditions</h1>
      </div>
      <div className="mx-auto max-w-4xl space-y-8 pt-5 text-lg leading-relaxed text-white/35">
        <p>
          These Terms and Conditions govern your use of the CaosEngine platform, operated by Caos Enterprises. By
          accessing or using any part of this site, you agree to be bound by these terms.
        </p>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">1. Platform Purpose</h2>
          <p>
            CaosEngine provides tools and services related to randomness generation, entropy visualization, decision
            simulation, and algorithmic experimentation. The content is intended for educational, experimental, and
            entertainment purposes only.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">2. Mathematical Integrity</h2>
          <p>
            All calculations and simulations executed within CaosEngine are based on rigorously tested mathematical
            algorithms and deterministic logic. We guarantee the internal consistency and computational accuracy of our
            mathematical operations.
          </p>
          <p className="mt-2">
            However, while the platform ensures the correctness of its algorithms and entropy generation models, users
            must understand that the **interpretation and application** of the generated results are their sole
            responsibility. CaosEngine does not offer legal, financial, or professional advice.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">3. Acceptable Use</h2>
          <p>
            You may not use CaosEngine to transmit, store, or display any unlawful, harmful, or misleading content. You
            agree not to exploit the system to interfere with other users, extract unauthorized data, or overload our
            infrastructure.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">4. API and Integrations</h2>
          <p>
            Any use of CaosEngine through automated systems (e.g., bots, scrapers, or API clients) must comply with our
            guidelines. Commercial or large-scale integrations require explicit written permission from the CaosEngine
            team.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">5. Intellectual Property</h2>
          <p>
            All code, visualizations, and system logic are the intellectual property of Caos Enterprises, unless stated
            otherwise. You may not copy, redistribute, or reverse-engineer any component without prior authorization.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">6. Data Privacy and Storage</h2>
          <p>
            CaosEngine does not collect personal information unless explicitly provided by the user. All entropy or
            randomness inputs are anonymized and processed without persistent user tracking. Please review our{' '}
            <a href="/PrivacyPolicy" className="text-action-primary hover:underline">
              Privacy Policy
            </a>{' '}
            for full details.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">7. Limitation of Liability</h2>
          <p>
            Under no circumstances shall CaosEngine or its team be held liable for any damages arising from the use or
            inability to use the platform. Use of the platform is entirely at your own risk.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">8. Modifications</h2>
          <p>
            We reserve the right to update or modify these terms at any time without prior notice. Continued use of the
            platform after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <p className="mt-10 text-sm text-white/25">Last updated: June 16, 2025.</p>
      </div>
    </div>
  );
}
