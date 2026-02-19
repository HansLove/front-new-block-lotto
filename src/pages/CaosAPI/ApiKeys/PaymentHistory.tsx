import { ClockIcon, CreditCardIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface PaymentHistoryProps {
  onError: (error: string) => void;
}

interface Payment {
  _id: string;
  type: 'purchase' | 'bonus' | 'refund';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  transactionId?: string;
}

export default function PaymentHistory({ onError }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setIsLoading(true);
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - replace with actual API call
      const mockPayments: Payment[] = [
        {
          _id: '1',
          type: 'bonus',
          amount: 1000,
          description: 'Welcome bonus - Free credits',
          status: 'completed',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setPayments(mockPayments);
    } catch (error: any) {
      onError('Error loading payment history');
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

  const getTypeIcon = (type: Payment['type']) => {
    switch (type) {
      case 'purchase':
        return <CreditCardIcon className="h-4 w-4" />;
      case 'bonus':
        return <PlusIcon className="h-4 w-4" />;
      case 'refund':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <CreditCardIcon className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Payment['type']) => {
    switch (type) {
      case 'purchase':
        return 'text-action-primary bg-action-primary/10 border-action-primary/30';
      case 'bonus':
        return 'text-lotto-green-400 bg-lotto-green-500/10 border-lotto-green-500/30';
      case 'refund':
        return 'text-lotto-orange-400 bg-lotto-orange-400/10 border-lotto-orange-400/30';
      default:
        return 'text-white/35 bg-white/[0.04] border-white/10';
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-surface-elevated p-6">
        <div className="mb-4">
          <div className="h-6 w-32 animate-pulse rounded bg-white/[0.06]" />
          <div className="mt-1 h-4 w-48 animate-pulse rounded bg-white/[0.04]" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/[0.06]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-3 w-24 animate-pulse rounded bg-white/[0.04]" />
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-surface-elevated p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Payment History</h2>
        <p className="text-sm text-white/35">Your credit transactions and purchases</p>
      </div>

      {payments.length === 0 ? (
        <div className="py-8 text-center">
          <CreditCardIcon className="mx-auto mb-3 h-12 w-12 text-white/15" />
          <p className="text-white/35">No payment history yet</p>
          <p className="text-sm text-white/25">Your transactions will appear here</p>
        </div>
      ) : (
        <div className="relative space-y-3">
          {payments.map(payment => (
            <div
              key={payment._id}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-full border p-2 ${getTypeColor(payment.type)}`}>
                    {getTypeIcon(payment.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{payment.description}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-xs text-white/25">{formatDate(payment.date)}</span>
                      {payment.transactionId && (
                        <span className="font-mono text-xs text-white/20">#{payment.transactionId.slice(-8)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        payment.type === 'purchase' ? 'text-red-400' : 'text-lotto-green-400'
                      }`}
                    >
                      {payment.type === 'purchase' ? '-' : '+'}
                      {formatCredits(payment.amount)}
                    </p>
                    <span className="text-xs text-white/25">credits</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {payments.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/45 transition-colors hover:border-white/20 hover:text-white/70">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
