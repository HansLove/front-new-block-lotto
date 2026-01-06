export default function PrivacyPolicy() {
  const LAST_UPDATED = 'August 17, 2025';

  return (
    <div className="min-h-screen bg-[#0F0F1B] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 pb-6 pt-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="flex items-center gap-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <span className="sr-only">Block Lotto</span>

            {/* Logo that adapts to color scheme */}
            <picture>
              <source srcSet="/images/logo-light.png" media="(prefers-color-scheme: dark)" />
              <img className="h-10 w-auto" src="/images/logo.png" alt="Block Lotto" />
            </picture>
          </a>

          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <span aria-hidden>🔒</span> Privacy Policy
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* TOC */}
          <nav aria-label="Table of contents" className="self-start lg:sticky lg:top-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-sm font-semibold text-white/80">On this page</p>
              <ul className="space-y-2 text-sm text-gray-300">
                {[
                  ['intro', 'Introduction'],
                  ['collection', '1. Data We Collect'],
                  ['technical', '2. Technical & Usage Data'],
                  ['blockchain', '3. Blockchain & Randomization Data'],
                  ['use', '4. How We Use Data'],
                  ['legal', '5. Legal Basis (GDPR-like)'],
                  ['sharing', '6. Sharing & Processors'],
                  ['cookies', '7. Cookies & Analytics'],
                  ['security', '8. Security'],
                  ['retention', '9. Data Retention'],
                  ['rights', '10. Your Rights'],
                  ['children', '11. Children'],
                  ['intl', '12. International Transfers'],
                  ['changes', '13. Changes to this Policy'],
                  ['contact', '14. Contact'],
                ].map(([id, label]) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="rounded hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Content */}
          <article className="max-w-3xl space-y-10 text-[17px] leading-relaxed text-gray-200">
            <section id="intro" aria-labelledby="intro-title" className="scroll-mt-24">
              <h2 id="intro-title" className="text-xl font-semibold text-white">
                Introduction
              </h2>
              <p>
                At <strong>Block Lotto</strong>, we respect your privacy. This policy explains what we collect, how we
                use it, and the choices you have. It covers our web properties, APIs (including
                Randomization-as-a-Service), and operational dashboards related to mining and gaming utilities.
              </p>
              <p className="mt-3 text-sm text-gray-400">
                Last updated: <time dateTime="2025-08-17">{LAST_UPDATED}</time>
              </p>
            </section>

            <section id="collection" aria-labelledby="collection-title" className="scroll-mt-24">
              <h2 id="collection-title" className="text-xl font-semibold text-white">
                1. Data We Collect
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Voluntary data</strong> you provide (e.g., contact forms, account registration, support
                  requests).
                </li>
                <li>
                  <strong>Operational data</strong> necessary to deliver features (e.g., API keys you create, service
                  configuration).
                </li>
                <li>
                  <strong>Payment/billing info</strong> processed by our payment providers (we do not store full card
                  details).
                </li>
              </ul>
              <p className="mt-3">
                We avoid collecting personally identifying information unless you actively submit it for a specific
                purpose.
              </p>
            </section>

            <section id="technical" aria-labelledby="technical-title" className="scroll-mt-24">
              <h2 id="technical-title" className="text-xl font-semibold text-white">
                2. Technical &amp; Usage Data
              </h2>
              <p>We may log non-identifiable data for reliability and performance:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Browser/OS, device type, viewport size, language, and time zone.</li>
                <li>Pages viewed, session duration, referrers, and interaction events.</li>
                <li>Diagnostics (errors, latency, API status) to troubleshoot issues.</li>
                <li>IP address may appear transiently in server logs for abuse prevention and rate-limiting.</li>
              </ul>
            </section>

            <section id="blockchain" aria-labelledby="blockchain-title" className="scroll-mt-24">
              <h2 id="blockchain-title" className="text-xl font-semibold text-white">
                3. Blockchain &amp; Randomization Data
              </h2>
              <p>Certain products interact with public blockchains and/or capture randomness artifacts:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Blockchain</strong>: public addresses, transaction hashes, block headers, Merkle roots, and
                  consensus metadata used to verify proofs and generate/validate entropy.
                </li>
                <li>
                  <strong>Randomization</strong>: seeds, request IDs, timing sources, and verification material required
                  to reproduce and audit randomness quality.
                </li>
              </ul>
              <p className="mt-2">
                Public chain data is, by nature, public. We link such data to your account only when needed to deliver
                the service you requested.
              </p>
            </section>

            <section id="use" aria-labelledby="use-title" className="scroll-mt-24">
              <h2 id="use-title" className="text-xl font-semibold text-white">
                4. How We Use Data
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>Provide and improve core features (RaaS, mining dashboards, verification APIs).</li>
                <li>Ensure security, prevent fraud/abuse, and enforce rate limits.</li>
                <li>Comply with legal obligations and respond to lawful requests.</li>
                <li>Communicate about service updates, incidents, or support matters.</li>
              </ul>
              <p className="mt-2 font-semibold">
                We do <u>not</u> sell or rent your personal information.
              </p>
            </section>

            <section id="legal" aria-labelledby="legal-title" className="scroll-mt-24">
              <h2 id="legal-title" className="text-xl font-semibold text-white">
                5. Legal Basis (GDPR-like)
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Contract</strong>: To deliver the features you requested.
                </li>
                <li>
                  <strong>Legitimate interests</strong>: Security, diagnostics, and product improvement.
                </li>
                <li>
                  <strong>Consent</strong>: Where required (e.g., optional analytics/cookies, marketing).
                </li>
                <li>
                  <strong>Legal obligation</strong>: Record-keeping, compliance, fraud prevention.
                </li>
              </ul>
            </section>

            <section id="sharing" aria-labelledby="sharing-title" className="scroll-mt-24">
              <h2 id="sharing-title" className="text-xl font-semibold text-white">
                6. Sharing &amp; Processors
              </h2>
              <p>
                We may use vetted service providers (e.g., hosting, analytics, payments) acting as processors under
                confidentiality and data protection terms. We do not permit them to use your data for their own
                purposes.
              </p>
            </section>

            <section id="cookies" aria-labelledby="cookies-title" className="scroll-mt-24">
              <h2 id="cookies-title" className="text-xl font-semibold text-white">
                7. Cookies &amp; Analytics
              </h2>
              <p>
                We use essential cookies for authentication, session integrity, and security. Optional analytics
                cookies, if enabled, help us understand usage trends. Where required, we display a consent banner and
                honor your choice.
              </p>
            </section>

            <section id="security" aria-labelledby="security-title" className="scroll-mt-24">
              <h2 id="security-title" className="text-xl font-semibold text-white">
                8. Security
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>Transport encryption (HTTPS/TLS), hardened infrastructure, and access controls.</li>
                <li>Secrets management and least-privilege principles.</li>
                <li>Monitoring, auditing, and incident response playbooks.</li>
              </ul>
              <p className="mt-2 text-gray-300">
                No method is 100% secure, but we continuously improve our safeguards.
              </p>
            </section>

            <section id="retention" aria-labelledby="retention-title" className="scroll-mt-24">
              <h2 id="retention-title" className="text-xl font-semibold text-white">
                9. Data Retention
              </h2>
              <p>
                We retain data only as long as necessary for the purpose collected, to comply with legal obligations,
                resolve disputes, and enforce agreements. Operational logs are rotated and minimized wherever feasible.
              </p>
            </section>

            <section id="rights" aria-labelledby="rights-title" className="scroll-mt-24">
              <h2 id="rights-title" className="text-xl font-semibold text-white">
                10. Your Rights
              </h2>
              <p>
                Depending on your location, you may have rights to access, correct, delete, or port your data, and to
                object or restrict certain processing. You can also withdraw consent for optional features at any time.
              </p>
              <p className="mt-2">
                To exercise rights, contact us (see{' '}
                <a href="#contact" className="underline underline-offset-4">
                  Contact
                </a>
                ). We will verify your request and respond as required by applicable law.
              </p>
            </section>

            <section id="children" aria-labelledby="children-title" className="scroll-mt-24">
              <h2 id="children-title" className="text-xl font-semibold text-white">
                11. Children
              </h2>
              <p>
                Our services are not directed to children. If you believe a child provided us data, contact us to remove
                it.
              </p>
            </section>

            <section id="intl" aria-labelledby="intl-title" className="scroll-mt-24">
              <h2 id="intl-title" className="text-xl font-semibold text-white">
                12. International Transfers
              </h2>
              <p>
                We may process data in countries outside your own. Where required, we use appropriate safeguards (e.g.,
                contractual clauses) to protect your information.
              </p>
            </section>

            <section id="changes" aria-labelledby="changes-title" className="scroll-mt-24">
              <h2 id="changes-title" className="text-xl font-semibold text-white">
                13. Changes to this Policy
              </h2>
              <p>
                We may update this policy to reflect changes in our services or laws. We will post the new date above
                and, for material changes, provide additional notice.
              </p>
            </section>

            <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24">
              <h2 id="contact-title" className="text-xl font-semibold text-white">
                14. Contact
              </h2>
              <p>
                Questions or requests:{' '}
                <a className="underline underline-offset-4" href="mailto:privacy@caosengine.com">
                  privacy@caosengine.com
                </a>
              </p>
            </section>

            <p className="pt-4 text-sm text-gray-500">
              This summary is not legal advice. For compliance in a specific jurisdiction, consult your counsel.
            </p>
          </article>
        </div>
      </main>

      {/* schema.org JSON-LD for Privacy Policy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'PrivacyPolicy',
            name: 'Block Lotto Privacy Policy',
            url: 'https://caosengine.com/privacy',
            dateModified: '2025-08-17',
            publisher: {
              '@type': 'Organization',
              name: 'Block Lotto',
              url: 'https://caosengine.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://caosengine.com/images/logo.png',
              },
            },
          }),
        }}
      />
    </div>
  );
}
