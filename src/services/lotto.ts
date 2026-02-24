import axios from 'axios';

import { getAuthHeaders } from '@/utils/apiClient';
import { API_URL } from '@/utils/Rutes';

export interface LottoTicket {
  id: string;
  ticketId: string;
  btcAddress: string;
  status: 'active' | 'expired' | 'suspended';
  validUntil: string;
  frequencyMinutes: number;
  stars: number;
  /** Total number of attempts (from API nonce_total). */
  nonceTotal: number;
  /** Number of blocks/rounds participated in. */
  totalAttempts: number;
  lastAttemptAt: string | null;
  /** Remaining Plus Ultra (high-frequency) shots for this ticket. */
  plusUltraRemaining?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LottoAttempt {
  id: string;
  blockHeight: number;
  hash: string;
  nonce: string;
  stars: number;
  isBlock: boolean;
  blockHash: string | null;
  merkleRoot: string | null;
  prevHash: string | null;
  bits: string | null;
  timestamp: number | null;
  attemptedAt: string;
  /** HIGH = Bitcoin-powered mining attempt, LOW = standard */
  energyType?: 'HIGH' | 'LOW';
}

export interface SystemStats {
  totalActiveTickets: number;
  totalAttempts: number;
  totalBlocksMined: number;
  lastBlockHeight: number | null;
  difficulty?: string;
}

interface CreateTicketRequest {
  btcAddress: string;
  validDays?: number;
}

function mapInstanceToLottoTicket(row: Record<string, unknown>): LottoTicket {
  return {
    id: String(row.id),
    ticketId: String(row.ticketId ?? row.id),
    btcAddress: String(row.btcAddress ?? row.btc_address ?? ''),
    status: (row.status as LottoTicket['status']) ?? 'active',
    validUntil: (row.validUntil ?? row.expires_at) != null ? String(row.validUntil ?? row.expires_at) : '',
    frequencyMinutes: Number(row.frequencyMinutes ?? 10),
    stars: Number(row.stars ?? 3),
    nonceTotal: Number(row.nonce_total ?? row.nonceTotal ?? 0),
    totalAttempts: Number(row.totalAttempts ?? 0),
    lastAttemptAt: row.lastAttemptAt != null ? String(row.lastAttemptAt) : null,
    plusUltraRemaining: Number(row.plus_ultra_remaining ?? row.plusUltraRemaining ?? 10),
    createdAt: String(row.created_at ?? row.createdAt ?? ''),
    updatedAt: String(row.updated_at ?? row.updatedAt ?? ''),
  };
}

function mapEventToLottoAttempt(row: Record<string, unknown>): LottoAttempt {
  const energyType = row.energy_type as string | undefined;
  const normalizedEnergy: 'HIGH' | 'LOW' =
    energyType === 'HIGH' ? 'HIGH' : 'LOW';
  return {
    id: String(row.id),
    blockHeight: Number(row.block_height ?? row.blockHeight ?? 0),
    hash: String(row.tip_hash ?? row.hash ?? ''),
    nonce: String(row.nonce ?? ''),
    stars: normalizedEnergy === 'HIGH' ? 5 : 3,
    isBlock: false,
    blockHash: null,
    merkleRoot: null,
    prevHash: null,
    bits: null,
    timestamp: null,
    attemptedAt: String(row.created_at ?? row.attemptedAt ?? ''),
    energyType: normalizedEnergy,
  };
}

export const fetchUserTickets = async (): Promise<LottoTicket[]> => {
  const response = await axios.get(`${API_URL}instances`, getAuthHeaders());
  const list = Array.isArray(response.data) ? response.data : [];
  return list.map((row: Record<string, unknown>) => mapInstanceToLottoTicket(row));
};

export const createTicket = async (data: CreateTicketRequest): Promise<LottoTicket> => {
  const response = await axios.post(
    `${API_URL}instances`,
    { btc_address: data.btcAddress, valid_days: data.validDays ?? 30 },
    getAuthHeaders()
  );
  return mapInstanceToLottoTicket(response.data);
};

export const fetchTicketDetail = async (ticketId: string): Promise<LottoTicket> => {
  const tickets = await fetchUserTickets();
  const found = tickets.find((t) => t.id === ticketId || t.ticketId === ticketId);
  if (!found) throw new Error('Ticket not found');
  return found;
};

export const fetchTicketAttempts = async (
  ticketId: string,
  limit = 50,
  skip = 0
): Promise<{ attempts: LottoAttempt[]; pagination: { total: number; limit: number; skip: number; hasMore: boolean } }> => {
  const response = await axios.get(`${API_URL}instances/${ticketId}/events`, {
    ...getAuthHeaders(),
    params: { limit, skip },
  });
  const list = Array.isArray(response.data) ? response.data : [];
  const attempts = list.map((row: Record<string, unknown>) => mapEventToLottoAttempt(row));
  return {
    attempts,
    pagination: { total: attempts.length, limit, skip, hasMore: false },
  };
};

export const fetchSystemStats = async (): Promise<{
  stats: SystemStats;
  recentAttempts?: Array<{
    ticketId: string;
    blockHeight: number;
    hash: string;
    stars: number;
    isBlock: boolean;
    attemptedAt: string;
  }>;
}> => {
  const response = await axios.get(`${API_URL}status/stats`, getAuthHeaders());
  const stats = response.data?.stats ?? response.data;
  return {
    stats: {
      totalActiveTickets: Number(stats?.totalActiveTickets ?? 0),
      totalAttempts: Number(stats?.totalAttempts ?? 0),
      totalBlocksMined: Number(stats?.totalBlocksMined ?? 0),
      lastBlockHeight: stats?.lastBlockHeight != null ? Number(stats.lastBlockHeight) : null,
    },
    recentAttempts: [],
  };
};

/** Response from POST /instances/:id/high (process high mode - Bitcoin mining energy) */
export interface InstanceHighModeResponse {
  message: string;
}

/**
 * Trigger high-entropy (Plus Ultra) for an instance. Backend obtains computational
 * energy from Bitcoin mining and adds the result to total attempts.
 * @param instanceId - Instance/ticket id (e.g. ticket.id)
 * @returns Promise with API success message
 */
export const requestInstanceHighMode = async (
  instanceId: string
): Promise<InstanceHighModeResponse> => {
  const response = await axios.post<InstanceHighModeResponse>(
    `${API_URL}instances/${instanceId}/high`,
    {},
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Redeem a promo code for a free 7-day ticket with 1 Plus Ultra.
 * Requires code and Bitcoin address.
 */
export const redeemPromoCode = async (
  code: string,
  btcAddress: string
): Promise<LottoTicket> => {
  const response = await axios.post(
    `${API_URL}promo/redeem`,
    { code: code.trim(), btc_address: btcAddress.trim() },
    getAuthHeaders()
  );
  return mapInstanceToLottoTicket(response.data);
};
