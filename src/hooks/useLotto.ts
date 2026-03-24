import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import {
  type AttemptsPagination,
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

export interface HighEnergyQueueInfo {
  status: 'assigned' | 'queued';
  queuePosition: number;
}

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
  ) => Promise<{ attempts: LottoAttempt[]; pagination: AttemptsPagination } | null>;
  requestHighEntropyAttempt: (ticket: LottoTicket) => Promise<InstanceHighModeResponse>;
  /** True while a HIGH energy request is active (assigned or queued) for a ticket. */
  highEntropyPending: Record<string, boolean>;
  /** Queue info per ticket (null when not queued/assigned). */
  highEntropyQueued: Record<string, HighEnergyQueueInfo | null>;
}
/* eslint-enable no-unused-vars */

export const useLotto = (options?: UseLottoOptions): UseLottoReturn => {
  const onPaymentLifecycleRef = useRef(options?.onPaymentLifecycle ?? null);
  onPaymentLifecycleRef.current = options?.onPaymentLifecycle ?? null;

  // Kept in a ref so the socket effect (deps: []) always calls the latest version
  const refreshSilentRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const [tickets, setTickets] = useState<LottoTicket[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highEntropyPending, setHighEntropyPending] = useState<Record<string, boolean>>({});
  const [highEntropyQueued, setHighEntropyQueued] = useState<Record<string, HighEnergyQueueInfo | null>>({});
  const highEnergyTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

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
      // Clear HIGH energy pending/queued state when a HIGH attempt completes
      if (data.attempt.stars === 5) {
        setHighEntropyPending(prev => ({ ...prev, [data.ticketId]: false }));
        setHighEntropyQueued(prev => ({ ...prev, [data.ticketId]: null }));
        const timeoutId = highEnergyTimeoutsRef.current[data.ticketId];
        if (timeoutId) {
          clearTimeout(timeoutId);
          delete highEnergyTimeoutsRef.current[data.ticketId];
        }
      }
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
      refreshSilentRef.current();
    });

    socketInstance.on('lotto:payment_waiting', (data: { orderId: string }) => {
      console.log('[useLotto] Payment waiting:', data);
      onPaymentLifecycleRef.current?.({ orderId: data.orderId, status: 'waiting' });
    });

    socketInstance.on('lotto:payment_confirming', (data: { orderId: string }) => {
      console.log('[useLotto] Payment confirming:', data);
      onPaymentLifecycleRef.current?.({ orderId: data.orderId, status: 'confirming' });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      for (const timeoutId of Object.values(highEnergyTimeoutsRef.current)) {
        clearTimeout(timeoutId);
      }
      highEnergyTimeoutsRef.current = {};
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
    } catch (err: unknown) {
      console.error('[useLotto] Error loading data:', err);
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.error ?? 'Failed to load lotto data')
        : 'Failed to load lotto data';
      setError(message);
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

  const fetchAndMergeTickets = useCallback(async () => {
    const [ticketsData, statsData] = await Promise.all([fetchUserTickets(), fetchSystemStats()]);
    setTickets(prev => mergeTicketsPreservingOrder(prev, ticketsData));
    setStats(statsData.stats);
  }, [mergeTicketsPreservingOrder]);

  // Silent refresh: update data in background without loading spinner (smooth, no reload)
  const lastSilentRefreshRef = useRef<number>(0);
  const REFRESH_THROTTLE_MS = 5000; // min 5s between silent refreshes

  const refreshSilent = useCallback(async () => {
    const now = Date.now();
    if (now - lastSilentRefreshRef.current < REFRESH_THROTTLE_MS) return;
    lastSilentRefreshRef.current = now;
    try {
      await fetchAndMergeTickets();
    } catch (err: unknown) {
      console.error('[useLotto] Silent refresh failed:', err);
    }
  }, [fetchAndMergeTickets]);
  refreshSilentRef.current = refreshSilent;

  /** Silent refresh without throttle (e.g. after Plus Ultra) so UI updates immediately. */
  const refreshTicketsSilent = useCallback(async () => {
    try {
      await fetchAndMergeTickets();
    } catch (err: unknown) {
      console.error('[useLotto] Silent refresh failed:', err);
    }
  }, [fetchAndMergeTickets]);

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
    } catch (err: unknown) {
      console.error('[useLotto] Error fetching ticket detail:', err);
      return null;
    }
  }, []);

  const getTicketAttempts = useCallback(
    async (ticketId: string, limit = 50, skip = 0): Promise<{ attempts: LottoAttempt[]; pagination: AttemptsPagination } | null> => {
      try {
        return await fetchTicketAttempts(ticketId, limit, skip);
      } catch (err: unknown) {
        console.error('[useLotto] Error fetching ticket attempts:', err);
        return null;
      }
    },
    []
  );

  const HIGH_ENERGY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

  /**
   * Request high entropy for a ticket (Plus Ultra). Backend responds 202 immediately
   * with assigned/queued status; result arrives later via lotto:attempt socket event.
   */
  const requestHighEntropyAttempt = useCallback(async (ticket: LottoTicket): Promise<InstanceHighModeResponse> => {
    setHighEntropyPending(prev => ({ ...prev, [ticket.id]: true }));
    setHighEntropyQueued(prev => ({ ...prev, [ticket.id]: null }));

    try {
      const result = await requestInstanceHighMode(ticket.id);
      setHighEntropyQueued(prev => ({
        ...prev,
        [ticket.id]: { status: result.status, queuePosition: result.queuePosition },
      }));

      // Safety timeout: clear pending state if no result arrives within 10 minutes
      const existingTimeout = highEnergyTimeoutsRef.current[ticket.id];
      if (existingTimeout) clearTimeout(existingTimeout);
      highEnergyTimeoutsRef.current[ticket.id] = setTimeout(() => {
        setHighEntropyPending(prev => ({ ...prev, [ticket.id]: false }));
        setHighEntropyQueued(prev => ({ ...prev, [ticket.id]: null }));
        delete highEnergyTimeoutsRef.current[ticket.id];
      }, HIGH_ENERGY_TIMEOUT_MS);

      return result;
    } catch (err: unknown) {
      setHighEntropyPending(prev => ({ ...prev, [ticket.id]: false }));
      setHighEntropyQueued(prev => ({ ...prev, [ticket.id]: null }));
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
    highEntropyQueued,
  };
};
