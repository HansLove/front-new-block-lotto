import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import type { LiveActivityFeedItem } from '@/services/lotto';

function resultLabel(item: LiveActivityFeedItem): string {
  if (item.energyType === 'HIGH') return 'Plus Ultra';
  return 'Standard round';
}

export interface LiveAttemptFeedProps {
  items: LiveActivityFeedItem[];
  className?: string;
}

export function LiveAttemptFeed({ items, className = '' }: LiveAttemptFeedProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current && items.length > 0) {
      listRef.current.scrollTop = 0;
    }
  }, [items]);

  return (
    <div
      className={`flex flex-col rounded-2xl border border-white/[0.07] bg-[#0d0d12] ${className}`}
    >
      <div className="border-b border-white/[0.06] px-4 py-3">
        <h3 className="text-sm font-medium text-white">Live attempts</h3>
        <p className="text-[10px] text-white/30">Your recent proof-of-work rounds (tip + nonce)</p>
      </div>
      <div
        ref={listRef}
        className="max-h-[min(320px,50vh)] overflow-y-auto overscroll-contain px-2 py-2"
      >
        {items.length === 0 ? (
          <p className="px-2 py-8 text-center text-xs text-white/30">No attempts yet</p>
        ) : (
          <AnimatePresence initial={false}>
            {items.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-1.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 last:mb-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] tabular-nums text-white/35">
                    {new Date(item.attemptedAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide ${
                      item.energyType === 'HIGH'
                        ? 'bg-amber-500/15 text-amber-400/90'
                        : 'bg-white/[0.06] text-white/40'
                    }`}
                  >
                    {resultLabel(item)}
                  </span>
                </div>
                <div
                  className="mt-1.5 font-mono text-[11px] text-white/55"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span className="text-white/25">nonce</span>{' '}
                  <span className="text-white/70">{item.nonce.slice(0, 14)}</span>
                  {item.nonce.length > 14 ? '…' : ''}
                </div>
                <div
                  className="mt-0.5 font-mono text-[10px] text-white/35"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span className="text-white/20">tip</span> {item.hashShort || '—'}… · h{' '}
                  {item.blockHeight}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
