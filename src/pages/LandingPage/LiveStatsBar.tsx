import { useEffect, useState } from 'react';

import { motion, useMotionValueEvent, useSpring } from 'framer-motion';

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 80, damping: 35 });
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  useMotionValueEvent(spring, 'change', (v) => setDisplay(Math.floor(v)));
  return (
    <motion.span
      key={display}
      initial={{ opacity: 0.7, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      {display.toLocaleString()}
    </motion.span>
  );
}

function useSimulatedGrowth(initial: number, ratePerSecond: number) {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      setValue(Math.floor(initial + elapsed * ratePerSecond));
    }, 800);
    return () => clearInterval(interval);
  }, [initial, ratePerSecond]);
  return value;
}

export function LiveStatsBar() {
  const blocksMined = useSimulatedGrowth(184_927, 0.4);
  const roundsToday = useSimulatedGrowth(12_847, 1.2);
  const activeRounds = useSimulatedGrowth(3, 0.01);

  return (
    <motion.section
      className="border-y border-gray-200/80 bg-gradient-to-r from-gray-50 to-white py-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 sm:gap-x-16">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tabular-nums text-lotto-green-600 sm:text-3xl">
            <AnimatedNumber value={blocksMined} />
          </span>
          <span className="text-sm font-medium text-gray-500">blocks mined</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tabular-nums text-lotto-green-600 sm:text-3xl">
            <AnimatedNumber value={roundsToday} />
          </span>
          <span className="text-sm font-medium text-gray-500">rounds today</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lotto-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lotto-green-500" />
          </span>
          <span className="font-mono text-lg font-semibold tabular-nums text-gray-800">
            <AnimatedNumber value={Math.max(1, Math.floor(activeRounds))} />
          </span>
          <span className="text-sm font-medium text-gray-500">live now</span>
        </div>
      </div>
    </motion.section>
  );
}
