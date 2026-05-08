import { motion } from 'framer-motion';

export type PaymentMethod = 'btc' | 'usdt';

interface PaymentMethodTabsProps {
  value: PaymentMethod;
  // eslint-disable-next-line no-unused-vars
  onChange: (next: PaymentMethod) => void;
}

interface TabConfig {
  id: PaymentMethod;
  label: string;
  hint: string;
}

const TABS: readonly TabConfig[] = [
  { id: 'btc', label: 'BTC', hint: 'Bitcoin' },
  { id: 'usdt', label: 'USDT', hint: 'Stablecoin' },
] as const;

export function PaymentMethodTabs({ value, onChange }: PaymentMethodTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Payment method"
      className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5"
    >
      {TABS.map(tab => {
        const isActive = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative rounded-lg px-4 py-2.5 text-left transition-colors ${
              isActive
                ? 'border border-action-primary/40 bg-action-primary/10'
                : 'border border-transparent text-white/45 hover:text-white/70'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="payment-method-active-pill"
                className="pointer-events-none absolute inset-0 -z-0 rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex flex-col gap-0.5">
              <span
                className={`text-base font-semibold ${isActive ? 'text-white' : 'text-white/55'}`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {tab.label}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider ${
                  isActive ? 'text-action-primary/80' : 'text-white/25'
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {tab.hint}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
