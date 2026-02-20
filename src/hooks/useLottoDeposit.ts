import { USDTNetwork } from '@taloon/nowpayments-components';
import axios from 'axios';
import { useCallback, useState } from 'react';

import { createPaymentIntent, type LottoPaymentResult, submitLottoPayment } from '@/services/lottoPayment';

const PAYMENT_CREATION_FAILURE_MESSAGE = 'Payment creation failed. Please try again.';

const DEFAULT_CURRENCY = USDTNetwork.USDTMATIC;

export function useLottoDeposit() {
  const [btcAddress, setBtcAddress] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<USDTNetwork>(DEFAULT_CURRENCY);
  const [paymentData, setPaymentData] = useState<LottoPaymentResult | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPayment = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { orderId: newOrderId } = await createPaymentIntent(btcAddress);
      setOrderId(newOrderId);
      const response = await submitLottoPayment({ orderId: newOrderId, cryptoCurrency: selectedCurrency });

      setPaymentData(response.payment);
      setIsPending(true);
    } catch (err: unknown) {
      setOrderId(null);
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message as string | undefined;
        setError(serverMessage ?? PAYMENT_CREATION_FAILURE_MESSAGE);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(PAYMENT_CREATION_FAILURE_MESSAGE);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, btcAddress, selectedCurrency]);

  const resetPayment = useCallback(() => {
    setBtcAddress('');
    setSelectedCurrency(DEFAULT_CURRENCY);
    setPaymentData(null);
    setOrderId(null);
    setIsPending(false);
    setIsSubmitting(false);
    setError(null);
  }, []);

  return {
    btcAddress,
    selectedCurrency,
    paymentData,
    orderId,
    isPending,
    isSubmitting,
    error,
    setBtcAddress,
    selectCurrency: setSelectedCurrency,
    submitPayment,
    resetPayment,
  };
}
