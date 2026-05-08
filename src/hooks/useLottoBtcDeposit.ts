import axios from 'axios';
import { useCallback, useState } from 'react';

import { type BtcPaymentResult, submitBtcPayment } from '@/services/lottoBtcPayment';
import { createPaymentIntent } from '@/services/lottoPayment';

const PAYMENT_CREATION_FAILURE_MESSAGE = 'Payment creation failed. Please try again.';

export function useLottoBtcDeposit() {
  const [btcAddress, setBtcAddress] = useState('');
  const [paymentData, setPaymentData] = useState<BtcPaymentResult | null>(null);
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
      const payment = await submitBtcPayment({ orderId: newOrderId });

      setPaymentData(payment);
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
  }, [isSubmitting, btcAddress]);

  const resetPayment = useCallback(() => {
    setBtcAddress('');
    setPaymentData(null);
    setOrderId(null);
    setIsPending(false);
    setIsSubmitting(false);
    setError(null);
  }, []);

  return {
    btcAddress,
    paymentData,
    orderId,
    isPending,
    isSubmitting,
    error,
    setBtcAddress,
    submitPayment,
    resetPayment,
  };
}
