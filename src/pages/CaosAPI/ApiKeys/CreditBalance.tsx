import { BanknotesIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface CreditBalanceProps {
  onError: (error: string) => void;
  onDepositClick: () => void; // Nuevo prop para manejar el clic en el botón de depósito
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
        credits: 1000, // Default free credits for new users
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
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-700"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
            <div className="h-3 w-16 animate-pulse rounded bg-slate-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!balance) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center space-x-3">
        <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 p-2">
          <BanknotesIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white dark:text-gray-900">Credit Balance</h2>
          <p className="text-sm text-slate-400 dark:text-slate-600">Your available credits for API usage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Current Balance */}
        <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-slate-300 dark:text-slate-700">Available</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white dark:text-gray-900">{formatCredits(balance.credits)}</span>
            <span className="ml-1 text-sm text-slate-400">credits</span>
          </div>
        </div>

        {/* Total Earned */}
        <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
              <span className="text-xs font-bold text-white">+</span>
            </div>
            <span className="text-sm font-medium text-slate-300 dark:text-slate-700">Earned</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white dark:text-gray-900">
              {formatCredits(balance.totalEarned)}
            </span>
            <span className="ml-1 text-sm text-slate-400">credits</span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-lg border border-slate-600 bg-slate-800/40 p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
              <span className="text-xs font-bold text-white">-</span>
            </div>
            <span className="text-sm font-medium text-slate-300 dark:text-slate-700">Spent</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white dark:text-gray-900">
              {formatCredits(balance.totalSpent)}
            </span>
            <span className="ml-1 text-sm text-slate-400">credits</span>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-4">
        <span className="text-xs text-slate-500">Last updated: {formatDate(balance.lastUpdated)}</span>
        <button
          onClick={fetchBalance}
          className="text-xs text-orange-400 transition-colors duration-200 hover:text-orange-300"
        >
          Refresh
        </button>
      </div>

      {/* Make Deposit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={onDepositClick} // Usar el nuevo prop
          className="rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-orange-600 hover:to-red-700"
        >
          Make Deposit
        </button>
      </div>
    </div>
  );
}
