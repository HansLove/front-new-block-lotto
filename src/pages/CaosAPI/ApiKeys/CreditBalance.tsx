import { BanknotesIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface CreditBalanceProps {
  onError: (error: string) => void;
  onDepositClick: () => void;
}

interface UserBalance {
  credits: number;
  totalEarned: number;
  totalSpent: number;
  lastUpdated: string;
}

export default function CreditBalance({ onError, onDepositClick }: CreditBalanceProps) {
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - replace with actual API call
      const mockBalance: UserBalance = {
        credits: 1000,
        totalEarned: 1000,
        totalSpent: 0,
        lastUpdated: new Date().toISOString(),
      };

      setBalance(mockBalance);
    } catch (error: any) {
      onError('Error loading credit balance');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCredits = (credits: number) => {
    return new Intl.NumberFormat('en-US').format(credits);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-surface-elevated p-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-3 w-16 animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  }

  if (!balance) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-surface-elevated p-6">
      <div className="mb-4 flex items-center space-x-3">
        <div className="rounded-full bg-action-primary p-2">
          <BanknotesIcon className="h-6 w-6 text-black" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Credit Balance</h2>
          <p className="text-sm text-white/35">Your available credits for API usage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Current Balance */}
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-5 w-5 text-lotto-green-400" />
            <span className="text-sm font-medium text-white/45">Available</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{formatCredits(balance.credits)}</span>
            <span className="ml-1 text-sm text-white/25">credits</span>
          </div>
        </div>

        {/* Total Earned */}
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-lotto-green-500/20">
              <span className="text-xs font-bold text-lotto-green-400">+</span>
            </div>
            <span className="text-sm font-medium text-white/45">Earned</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{formatCredits(balance.totalEarned)}</span>
            <span className="ml-1 text-sm text-white/25">credits</span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-action-primary/20">
              <span className="text-xs font-bold text-action-primary">-</span>
            </div>
            <span className="text-sm font-medium text-white/45">Spent</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{formatCredits(balance.totalSpent)}</span>
            <span className="ml-1 text-sm text-white/25">credits</span>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-4">
        <span className="text-xs text-white/25">Last updated: {formatDate(balance.lastUpdated)}</span>
        <button
          onClick={fetchBalance}
          className="text-xs text-action-primary transition-colors duration-200 hover:text-action-hover"
        >
          Refresh
        </button>
      </div>

      {/* Make Deposit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={onDepositClick}
          className="rounded-lg bg-action-primary px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-action-hover"
        >
          Make Deposit
        </button>
      </div>
    </div>
  );
}
