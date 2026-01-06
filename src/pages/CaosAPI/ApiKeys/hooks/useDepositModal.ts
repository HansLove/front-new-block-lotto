import { DepositFormData, PaymentDetails } from '@taloon/nowpayments-components';
import axios from 'axios';
import { useCallback, useState } from 'react';

import { useAuth } from '@/hooks/useLogInHook';
import { API_URL } from '@/utils/Rutes';

export function useDepositModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error] = useState<string | null>(null);

  const { user } = useAuth();

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onSubmit = useCallback(async (depositModalData: DepositFormData) => {
    const token = localStorage.getItem('token');
    const payload = {
      amount: depositModalData.amount,
      orderId: `caos-api-deposit-${Date.now()}`,
      email: depositModalData.customerEmail || user?.email.toLowerCase() || '',
      cryptoCurrency: depositModalData.selectedCurrency,
      description: `Deposit for ${user?.email.toLocaleLowerCase()} for the value of ${depositModalData.amount} ${depositModalData.selectedCurrency}`,
      currency: 'usd',
    };
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(`${API_URL}api/v1/payment/nowpayments`, payload, options);
    return response.data;
  }, []);

  const onSuccess = useCallback((response: any): PaymentDetails => {
    return {
      address: response.payment.address,
      paymentId: response.payment.order_id,
    };
  }, []);

  return {
    isModalOpen,
    error,
    openModal,
    closeModal,
    onSubmit,
    onSuccess,
  };
}
