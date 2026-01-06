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
        return 'text-blue-400 bg-blue-900/30 border-blue-700';
      case 'bonus':
        return 'text-green-400 bg-green-900/30 border-green-700';
      case 'refund':
        return 'text-orange-400 bg-orange-900/30 border-orange-700';
      default:
        return 'text-slate-400 bg-slate-900/30 border-slate-700';
    }
  };

  // const getStatusColor = (status: Payment['status']) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'text-green-400 bg-green-900/20 border-green-700';
  //     case 'pending':
  //       return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
  //     case 'failed':
  //       return 'text-red-400 bg-red-900/20 border-red-700';
  //     default:
  //       return 'text-slate-400 bg-slate-900/20 border-slate-700';
  //   }
  // };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <div className="mb-4">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-700"></div>
          <div className="mt-1 h-4 w-48 animate-pulse rounded bg-slate-700"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 rounded-lg border border-slate-600 bg-slate-800/30 p-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-700"></div>
                <div className="h-3 w-24 animate-pulse rounded bg-slate-700"></div>
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-slate-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white dark:text-gray-900">Payment History</h2>
        <p className="text-sm text-slate-400 dark:text-slate-600">Your credit transactions and purchases</p>
      </div>

      {payments.length === 0 ? (
        <div className="py-8 text-center">
          <CreditCardIcon className="mx-auto mb-3 h-12 w-12 text-slate-600" />
          <p className="text-slate-400">No payment history yet</p>
          <p className="text-sm text-slate-500">Your transactions will appear here</p>
        </div>
      ) : (
        <div className="relative space-y-3">
          {payments.map(payment => (
            <div
              key={payment._id}
              className="rounded-lg border border-slate-600 bg-slate-800/40 p-4 backdrop-blur-sm transition-all duration-200 hover:bg-slate-800/60"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-full border p-2 ${getTypeColor(payment.type)}`}>
                    {getTypeIcon(payment.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white dark:text-gray-900">{payment.description}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-xs text-slate-400">{formatDate(payment.date)}</span>
                      {payment.transactionId && (
                        <span className="font-mono text-xs text-slate-500">#{payment.transactionId.slice(-8)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        payment.type === 'purchase' ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {payment.type === 'purchase' ? '-' : '+'}
                      {formatCredits(payment.amount)}
                    </p>
                    <span className="text-xs text-slate-400">credits</span>
                  </div>
                </div>
                {/* <span
                  className={`rounded-full border text-sm font-medium ${getStatusColor(payment.status)} absolute bottom-2 right-24 px-2 py-1`}
                >
                  {payment.status}
                </span> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {payments.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button className="rounded-lg border border-orange-700 px-4 py-2 text-sm text-orange-400 transition-colors duration-200 hover:bg-orange-900/20 hover:text-orange-300">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
