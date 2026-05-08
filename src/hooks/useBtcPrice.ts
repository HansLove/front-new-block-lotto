import { useCallback, useEffect, useRef, useState } from 'react';
import { useTimer } from 'react-timer-hook';

const REFRESH_INTERVAL_SECONDS = 10;
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

interface CoinGeckoResponse {
  bitcoin?: { usd?: number };
}

interface UseBtcPriceOptions {
  enabled?: boolean;
}

interface UseBtcPriceReturn {
  priceUsd: number | null;
  secondsUntilRefresh: number;
  isLoading: boolean;
  error: string | null;
  lastUpdatedAt: number | null;
  // eslint-disable-next-line no-unused-vars
  satsForUsd: (usd: number) => number;
}

const buildExpiry = (): Date => {
  const next = new Date();
  next.setSeconds(next.getSeconds() + REFRESH_INTERVAL_SECONDS);
  return next;
};

const isCoinGeckoResponse = (value: unknown): value is CoinGeckoResponse => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { bitcoin?: unknown };
  if (candidate.bitcoin === undefined) return true;
  if (typeof candidate.bitcoin !== 'object' || candidate.bitcoin === null) return false;
  const inner = candidate.bitcoin as { usd?: unknown };
  return inner.usd === undefined || typeof inner.usd === 'number';
};

export function useBtcPrice(options?: UseBtcPriceOptions): UseBtcPriceReturn {
  const enabled = options?.enabled ?? true;

  const [priceUsd, setPriceUsd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const inFlightRef = useRef(false);

  const fetchPrice = useCallback(async (): Promise<void> => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const response = await fetch(COINGECKO_URL);
      if (!response.ok) {
        throw new Error(`useBtcPrice: CoinGecko responded ${response.status}`);
      }
      const payload: unknown = await response.json();
      if (!isCoinGeckoResponse(payload)) {
        throw new Error('useBtcPrice: unexpected CoinGecko payload shape');
      }
      const usd = payload.bitcoin?.usd;
      if (typeof usd !== 'number' || !Number.isFinite(usd) || usd <= 0) {
        throw new Error('useBtcPrice: CoinGecko returned no usable USD price');
      }
      setPriceUsd(usd);
      setLastUpdatedAt(Date.now());
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'useBtcPrice: failed to fetch BTC price';
      setError(message);
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const handleExpire = useCallback(() => {
    void fetchPrice();
  }, [fetchPrice]);

  const { totalSeconds, pause, restart, isRunning } = useTimer({
    expiryTimestamp: buildExpiry(),
    autoStart: enabled,
    interval: 1000,
    onExpire: handleExpire,
  });

  const pauseRef = useRef(pause);
  pauseRef.current = pause;
  const restartRef = useRef(restart);
  restartRef.current = restart;

  useEffect(() => {
    if (enabled) {
      void fetchPrice();
    }
  }, [enabled, fetchPrice]);

  useEffect(() => {
    if (enabled && !isRunning) {
      restartRef.current(buildExpiry(), true);
      return;
    }
    if (!enabled && isRunning) {
      pauseRef.current();
    }
  }, [enabled, isRunning]);

  const satsForUsd = useCallback(
    (usd: number): number => {
      if (priceUsd === null || priceUsd <= 0) return 0;
      return Math.round((usd / priceUsd) * 1e8);
    },
    [priceUsd]
  );

  return {
    priceUsd,
    secondsUntilRefresh: totalSeconds,
    isLoading,
    error,
    lastUpdatedAt,
    satsForUsd,
  };
}
