import axios from 'axios';

import { getAuthHeaders } from '@/utils/apiClient';
import { API_URL } from '@/utils/Rutes';

export interface BtcPaymentResult {
  paymentId: string;
  checkoutLink: string;
  amount: string;
  currency: string;
  expirationTime: number;
}

interface BtcPaymentResponse {
  success: boolean;
  payment: BtcPaymentResult;
}

export const submitBtcPayment = async (args: { orderId: string }): Promise<BtcPaymentResult> => {
  const response = await axios.post<BtcPaymentResponse>(
    `${API_URL}lotto/pay-btc`,
    { orderId: args.orderId },
    getAuthHeaders()
  );
  return response.data.payment;
};
