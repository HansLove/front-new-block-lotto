export default function Loader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07070a]"
      role="status"
      aria-label="Loading"
    >
      {/* Soft glowing orb — no spin, just breath */}
      <div className="relative mb-8 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/40 to-lotto-green-500/30 blur-2xl animate-loader-glow"
          style={{ willChange: 'transform, opacity' }}
        />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm sm:h-16 sm:w-16">
          <span
            className="text-xl font-semibold text-white/90 sm:text-2xl"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            B
          </span>
        </div>
      </div>

      {/* Brand + subtle label */}
      <p className="mb-6 text-sm font-medium tracking-wide text-white/50 sm:text-base">
        Block Lotto
      </p>

      {/* Staggered dots — smooth and minimal */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-amber-400/80 animate-loader-dot"
            style={{
              animationDelay: `${i * 0.16}s`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>

      {/* Thin indeterminate line — optional, very smooth */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden bg-white/[0.06]">
        <div
          className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-amber-500/70 to-transparent animate-loader-line"
          style={{ willChange: 'transform' }}
        />
      </div>
    </div>
  );
}
