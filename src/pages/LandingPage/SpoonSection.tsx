import { motion } from 'framer-motion';

export function SpoonSection() {
  return (
    <motion.section
      className="border-t border-gray-200/80 bg-gray-50/60 py-16 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-lotto-green-600">
          Mining pool
        </p>
        <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Powered by Spoon
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Our mining pool runs around the clock. Mini proof of work for the community—every day, all day. Transparent, verifiable, and built for the long run.
        </p>
        <motion.a
          href="https://spoon.energy/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-lotto-green-500 bg-white px-6 py-3 font-semibold text-lotto-green-700 transition-colors hover:bg-lotto-green-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          spoon.energy
          <span className="text-lotto-green-500" aria-hidden>→</span>
        </motion.a>
      </div>
    </motion.section>
  );
}
