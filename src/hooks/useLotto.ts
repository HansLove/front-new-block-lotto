import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

import type { EntropyCompleted } from '@/services/entropy';
import {
  fetchSystemStats,
  fetchTicketAttempts,
  fetchTicketDetail,
  fetchUserTickets,
  type InstanceHighModeResponse,
  type LottoAttempt,
  type LottoTicket,
  requestInstanceHighMode,
  type SystemStats,
} from '@/services/lotto';
import { API_URL } from '@/utils/Rutes';

interface LottoAttemptEvent {
  ticketId: string;
  attempt: {
    id: string;
    blockHeight: number;
    hash: string;
    nonce: string;
    stars: number;
    isBlock: boolean;
    attemptedAt: string;
  };
  ticket: {
    totalAttempts: number;
    lastAttemptAt: string;
  };
}

interface BlockMinedEvent {
  ticketId: string;
  attempt: {
    id: string;
    blockHeight: number;
    hash: string;
    blockHash: string | null;
    attemptedAt: string;
  };
  btcAddress: string;
}

interface PaymentLifecycleEvent {
  orderId: string;
  status: 'waiting' | 'confirming';
}

interface UseLottoOptions {
  onPaymentLifecycle?: (event: PaymentLifecycleEvent) => void;
}

/* eslint-disable no-unused-vars -- interface method param names are for typing only */
interface UseLottoReturn {
  tickets: LottoTicket[];
  stats: SystemStats | null;
  socket: ReturnType<typeof io> | null;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
  refreshTickets: () => Promise<void>;
  /** Refresh tickets in background without loading spinner; preserves card order. */
  refreshTicketsSilent: () => Promise<void>;
  /** Add a ticket to the list (e.g. after redeeming a promo code) so it appears immediately. */
  addTicket: (ticket: LottoTicket) => void;
  getTicketDetail: (ticketId: string) => Promise<LottoTicket | null>;
  getTicketAttempts: (
    ticketId: string,
    limit?: number,
    skip?: number
  ) => Promise<{ attempts: LottoAttempt[]; pagination: any } | null>;
  requestHighEntropyAttempt: (ticket: LottoTicket) => Promise<InstanceHighModeResponse>;
  highEntropyPending: Record<string, boolean>;
  highEntropyResults: Record<string, EntropyCompleted | null>;
}
/* eslint-enable no-unused-vars */

export const useLotto = (options?: UseLottoOptions): UseLottoReturn => {
  const onPaymentLifecycleRef = useRef(options?.onPaymentLifecycle ?? null);
  onPaymentLifecycleRef.current = options?.onPaymentLifecycle ?? null;

  const [tickets, setTickets] = useState<LottoTicket[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highEntropyPending, setHighEntropyPending] = useState<Record<string, boolean>>({});
  const [highEntropyResults, setHighEntropyResults] = useState<Record<string, EntropyCompleted | null>>({});

  // Initialize socket connection (server root; backend joins socket to user:${userId} when auth.token is valid)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }
    const socketBase = API_URL.replace(/\/api\/?$/, '') || API_URL;

    const socketInstance = io(socketBase, {
      transports: ['polling', 'websocket'],
      auth: { token },
      query: { token },
    });

    socketInstance.on('connect', () => {
      console.log('[useLotto] Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[useLotto] Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('lotto:attempt', (data: LottoAttemptEvent) => {
      console.log('[useLotto] New attempt received:', data);
      // Update ticket in list
      setTickets(prev =>
        prev.map(ticket =>
          ticket.ticketId === data.ticketId
            ? {
                ...ticket,
                totalAttempts: data.ticket.totalAttempts,
                lastAttemptAt: data.ticket.lastAttemptAt,
              }
            : ticket
        )
      );
    });

    socketInstance.on('lotto:block_mined', (data: BlockMinedEvent) => {
      console.log('[useLotto] BLOCK MINED!', data);
      // Update ticket and show notification
      setTickets(prev =>
        prev.map(ticket =>
          ticket.ticketId === data.ticketId
            ? {
                ...ticket,
                totalAttempts: ticket.totalAttempts + 1,
              }
            : ticket
        )
      );
    });

    socketInstance.on('lotto:ticket_created', (_data: { instanceId: string; btcAddress: string }) => {
      console.log('[useLotto] New ticket created:', _data);
      loadTickets();
    });

    socketInstance.on('lotto:payment_waiting', (data: { orderId: string }) => {
      console.log('[useLotto] Payment waiting:', data);
      onPaymentLifecycleRef.current?.({ orderId: data.orderId, status: 'waiting' });
    });

    socketInstance.on('lotto:payment_confirming', (data: { orderId: string }) => {
      console.log('[useLotto] Payment confirming:', data);
      onPaymentLifecycleRef.current?.({ orderId: data.orderId, status: 'confirming' });
    });

    // Handle entropy:completed events for high entropy requests
    socketInstance.on('entropy:completed', (data: EntropyCompleted) => {
      console.log('[useLotto] High entropy completed:', data);

      // Find the ticket that matches this address
      setTickets(prev =>
        prev.map(ticket => {
          if (ticket.btcAddress === data.address) {
            // Update ticket with new attempt
            setHighEntropyPending(prevPending => ({ ...prevPending, [ticket.ticketId]: false }));
            setHighEntropyResults(prevResults => ({ ...prevResults, [ticket.ticketId]: data }));

            return {
              ...ticket,
              totalAttempts: ticket.totalAttempts + 1,
              lastAttemptAt: new Date().toISOString(),
            };
          }
          return ticket;
        })
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Load initial data (with loading state)
  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const [ticketsData, statsData] = await Promise.all([fetchUserTickets(), fetchSystemStats()]);
      setTickets(ticketsData);
      setStats(statsData.stats);
      setError(null);
    } catch (err: any) {
      console.error('[useLotto] Error loading data:', err);
      setError(err.response?.data?.error || 'Failed to load lotto data');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Merge fresh ticket data into current list preserving order (no card position jump). */
  const mergeTicketsPreservingOrder = useCallback(
    (prev: LottoTicket[], next: LottoTicket[]): LottoTicket[] => {
      const nextById = new Map(next.map(t => [t.id, t]));
      const result: LottoTicket[] = [];
      for (const t of prev) {
        const updated = nextById.get(t.id);
        if (updated) result.push(updated);
        else result.push(t);
      }
      for (const t of next) {
        if (!prev.some(p => p.id === t.id)) result.push(t);
      }
      return result;
    },
    []
  );

  // Silent refresh: update data in background without loading spinner (smooth, no reload)
  const lastSilentRefreshRef = useRef<number>(0);
  const REFRESH_THROTTLE_MS = 5000; // min 5s between silent refreshes

  const refreshSilent = useCallback(async () => {
    const now = Date.now();
    if (now - lastSilentRefreshRef.current < REFRESH_THROTTLE_MS) return;
    lastSilentRefreshRef.current = now;
    try {
      const [ticketsData, statsData] = await Promise.all([fetchUserTickets(), fetchSystemStats()]);
      setTickets(prev => mergeTicketsPreservingOrder(prev, ticketsData));
      setStats(statsData.stats);
    } catch (err: any) {
      console.error('[useLotto] Silent refresh failed:', err);
    }
  }, [mergeTicketsPreservingOrder]);

  /** Silent refresh without throttle (e.g. after Plus Ultra) so UI updates immediately. */
  const refreshTicketsSilent = useCallback(async () => {
    try {
      const [ticketsData, statsData] = await Promise.all([fetchUserTickets(), fetchSystemStats()]);
      setTickets(prev => mergeTicketsPreservingOrder(prev, ticketsData));
      setStats(statsData.stats);
    } catch (err: any) {
      console.error('[useLotto] Silent refresh failed:', err);
    }
  }, [mergeTicketsPreservingOrder]);

  const addTicket = useCallback((ticket: LottoTicket) => {
    setTickets(prev => {
      if (prev.some(t => t.id === ticket.id)) return prev;
      return [...prev, ticket];
    });
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Auto-refresh when user returns to tab (visibility) or on a gentle interval while visible — no reload, no spinner
  useEffect(() => {
    const INTERVAL_MS = 45000; // 45s when tab is visible
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let visibilityTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const clearIntervalAndTimeout = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (visibilityTimeoutId) {
        clearTimeout(visibilityTimeoutId);
        visibilityTimeoutId = null;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        visibilityTimeoutId = setTimeout(() => {
          visibilityTimeoutId = null;
          refreshSilent();
        }, 400);
        if (!intervalId) intervalId = setInterval(refreshSilent, INTERVAL_MS);
      } else {
        clearIntervalAndTimeout();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    if (document.visibilityState === 'visible') {
      intervalId = setInterval(refreshSilent, INTERVAL_MS);
    }
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearIntervalAndTimeout();
    };
  }, [refreshSilent]);

  const refreshTickets = useCallback(() => {
    return loadTickets();
  }, [loadTickets]);

  const getTicketDetail = useCallback(async (ticketId: string): Promise<LottoTicket | null> => {
    try {
      return await fetchTicketDetail(ticketId);
    } catch (err: any) {
      console.error('[useLotto] Error fetching ticket detail:', err);
      return null;
    }
  }, []);

  const getTicketAttempts = useCallback(
    async (ticketId: string, limit = 50, skip = 0): Promise<{ attempts: LottoAttempt[]; pagination: any } | null> => {
      try {
        return await fetchTicketAttempts(ticketId, limit, skip);
      } catch (err: any) {
        console.error('[useLotto] Error fetching ticket attempts:', err);
        return null;
      }
    },
    []
  );

  /**
   * Request high entropy for a ticket (Plus Ultra). Calls backend to get computational
   * energy from Bitcoin mining and add the result to total attempts.
   * @param ticket - The lotto ticket (instance)
   * @returns Promise with API response when the request is accepted
   */
  const requestHighEntropyAttempt = useCallback(async (ticket: LottoTicket): Promise<InstanceHighModeResponse> => {
    setHighEntropyPending(prev => ({ ...prev, [ticket.ticketId]: true }));
    setHighEntropyResults(prev => ({ ...prev, [ticket.ticketId]: null }));

    try {
      const result = await requestInstanceHighMode(ticket.id);
      setHighEntropyPending(prev => ({ ...prev, [ticket.ticketId]: false }));
      return result;
    } catch (err: any) {
      setHighEntropyPending(prev => ({ ...prev, [ticket.ticketId]: false }));
      throw err;
    }
  }, []);

  return {
    tickets,
    stats,
    socket,
    isConnected,
    loading,
    error,
    refreshTickets,
    refreshTicketsSilent,
    addTicket,
    getTicketDetail,
    getTicketAttempts,
    requestHighEntropyAttempt,
    highEntropyPending,
    highEntropyResults,
  };
};
