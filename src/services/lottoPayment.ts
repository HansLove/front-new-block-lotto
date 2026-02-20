import axios from 'axios';

import { getAuthHeaders } from '@/utils/apiClient';
import { API_URL } from '@/utils/Rutes';

export interface PaymentIntent {
  orderId: string;
  amountUsd: number;
  validDays: number;
}

export interface LottoPaymentResult {
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  paymentId: string;
  orderId: string;
}

export const createPaymentIntent = async (btcAddress: string): Promise<PaymentIntent> => {
  const response = await axios.post(
    `${API_URL}lotto/payment-intent`,
    { btc_address: btcAddress },
    getAuthHeaders()
  );
  return response.data;
};

export const submitLottoPayment = async (params: {
  orderId: string;
  cryptoCurrency: string;
}): Promise<{ success: boolean; payment: LottoPaymentResult }> => {
  const response = await axios.post(
    `${API_URL}lotto/pay`,
    params,
    getAuthHeaders()
  );
  return response.data;
};
