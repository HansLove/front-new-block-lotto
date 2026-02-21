import { AnimatePresence, motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export type PaymentLifecycleStatus = 'idle' | 'waiting' | 'confirming' | 'confirmed';

interface PaymentStatusPipelineProps {
  status: PaymentLifecycleStatus;
}

type NodeState = 'inactive' | 'active' | 'done';

const STAGES = [
  {
    key: 'broadcast',
    label: 'Broadcast',
    activeDot: '#fbbf24',
    activePulse: 'rgba(251,191,36,0.18)',
  },
  {
    key: 'confirming',
    label: 'Confirming',
    activeDot: '#2dd4bf',
    activePulse: 'rgba(45,212,191,0.15)',
  },
  {
    key: 'complete',
    label: 'Complete',
    activeDot: '#4ade80',
    activePulse: 'rgba(74,222,128,0.12)',
  },
] as const;

const STATUS_MESSAGES: Record<Exclude<PaymentLifecycleStatus, 'idle'>, string> = {
  waiting: 'Payment received · Awaiting blockchain detection',
  confirming: 'Detected on-chain · Gathering confirmations',
  confirmed: 'Confirmed · Activating your ticket',
};

function resolveNodeState(index: number, status: PaymentLifecycleStatus): NodeState {
  switch (status) {
    case 'idle':
      return 'inactive';
    case 'waiting':
      return index === 0 ? 'active' : 'inactive';
    case 'confirming':
      if (index === 0) return 'done';
      if (index === 1) return 'active';
      return 'inactive';
    case 'confirmed':
      return 'done';
  }
}

function isLineFilled(lineIndex: number, status: PaymentLifecycleStatus): boolean {
  if (status === 'confirming' && lineIndex === 0) return true;
  if (status === 'confirmed') return true;
  return false;
}

export function PaymentStatusPipeline({ status }: PaymentStatusPipelineProps) {
  const stageStates = STAGES.map((_, i) => ({
    nodeState: resolveNodeState(i, status),
    isConnectorFilled: isLineFilled(i, status),
  }));

  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          key="pipeline"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="mb-5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-4"
        >
          {/* Node + connector row */}
          <div className="mb-3 flex items-center">
            {STAGES.map((stage, i) => {
              const { nodeState, isConnectorFilled } = stageStates[i];
              const isActive = nodeState === 'active';
              const isDone = nodeState === 'done';

              return (
                <div key={stage.key} className="flex flex-1 items-center">
                  {/* Node */}
                  <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                    {isActive && (
                      <>
                        <motion.div
                          className="absolute h-5 w-5 rounded-full"
                          style={{ backgroundColor: stage.activePulse }}
                          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0.15, 0.6] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: stage.activeDot }}
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </>
                    )}
                    {isDone && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                        className="h-2 w-2 rounded-full bg-lotto-green-500/60"
                      />
                    )}
                    {!isActive && !isDone && <div className="h-2 w-2 rounded-full border border-white/15" />}
                  </div>

                  {/* Connector */}
                  {i < STAGES.length - 1 && (
                    <div className="mx-1.5 mt-px h-px flex-1 overflow-hidden bg-white/[0.08]">
                      <motion.div
                        className="h-full bg-lotto-green-500/35"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isConnectorFilled ? 1 : 0 }}
                        style={{ transformOrigin: 'left' }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Labels */}
          <div className="mb-3 flex">
            {STAGES.map((stage, i) => {
              const { nodeState } = stageStates[i];
              return (
                <div key={stage.key} className="flex flex-1">
                  <span
                    className={`text-[9px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                      nodeState === 'active'
                        ? 'text-white/65'
                        : nodeState === 'done'
                          ? 'text-white/30'
                          : 'text-white/18'
                    }`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Status message */}
          <p className="text-[11px] text-white/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {STATUS_MESSAGES[status]}
          </p>
          {(status === 'waiting' || status === 'confirming') && (
            <p className="mt-1 text-[10px] text-white/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Typically 2–5 minutes.
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface PaymentWarningBannerProps {
  status: PaymentLifecycleStatus;
}

export function PaymentWarningBanner({ status }: PaymentWarningBannerProps) {
  const isVisible = status === 'waiting' || status === 'confirming';
  const isUrgent = status === 'confirming';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="warning"
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.2 }}
          className={`flex items-start gap-2.5 overflow-hidden rounded-lg border px-3.5 py-2.5 ${
            isUrgent ? 'border-amber-500/25 bg-amber-500/10' : 'border-amber-500/15 bg-amber-500/[0.06]'
          }`}
        >
          <Zap className={`mt-0.5 h-3 w-3 shrink-0 ${isUrgent ? 'text-amber-400/80' : 'text-amber-400/50'}`} />
          <p className={`text-xs leading-relaxed ${isUrgent ? 'text-amber-300/70' : 'text-amber-400/50'}`}>
            {isUrgent
              ? 'Payment detected on blockchain. Do not close this window — your ticket is being activated.'
              : 'Payment received. Keep this window open while we wait for blockchain detection.'}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
