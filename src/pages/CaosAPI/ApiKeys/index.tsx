import { DepositModal } from '@taloon/nowpayments-components';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

import { useDepositModal } from '@/pages/CaosAPI/ApiKeys/hooks/useDepositModal';
import { API_URL } from '@/utils/Rutes';

import ApiKeyList from './ApiKeyList';
import CreateApiKeyForm from './CreateApiKeyForm';
import CreditBalance from './CreditBalance';
import PaymentHistory from './PaymentHistory';
import { type ApiKey } from './types';

export default function ApiKeys() {
  const { isModalOpen, openModal, closeModal, onSubmit, onSuccess } = useDepositModal();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar API Keys al montar el componente
  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Limpiar mensajes después de 3 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchApiKeys = async () => {
    try {
      setIsLoadingKeys(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}api/v1/caos/list-keys`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApiKeys(response.data.keys || []);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error loading API Keys');
    } finally {
      setIsLoadingKeys(false);
    }
  };

  const handleApiKeyCreated = (newApiKey: ApiKey) => {
    setApiKeys([...apiKeys, newApiKey]);
  };

  const handleApiKeysChange = (updatedApiKeys: ApiKey[]) => {
    setApiKeys(updatedApiKeys);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSuccess = (successMessage: string) => {
    setSuccess(successMessage);
  };

  return (
    <div className="min-h-screen bg-surface-base py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-white">API Keys</h1>
          <p className="text-lg text-white/35">Manage your API keys and credits to integrate with our services</p>
        </div>

        <DepositModal
          isOpen={isModalOpen}
          onClose={closeModal}
          shouldNotifyByEmail={false}
          onSubmit={async form => await onSubmit(form)}
          onSuccess={response => onSuccess(response)}
          onError={error => {
            if (error instanceof AxiosError) {
              return error.response?.data.error.message || 'Deposit failed due to a network error.';
            }
          }}
        />

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-lotto-green-500/30 bg-lotto-green-500/10 p-4">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* Credit Balance Section */}
        <div className="mb-8">
          <CreditBalance onError={handleError} onDepositClick={openModal} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - API Management */}
          <div className="space-y-8 lg:col-span-2">
            {/* Formulario de creación */}
            <CreateApiKeyForm onApiKeyCreated={handleApiKeyCreated} onError={handleError} onSuccess={handleSuccess} />

            {/* Lista de API Keys */}
            <ApiKeyList
              apiKeys={apiKeys}
              isLoadingKeys={isLoadingKeys}
              onApiKeysChange={handleApiKeysChange}
              onError={handleError}
              onSuccess={handleSuccess}
            />
          </div>

          {/* Right Column - Payment History */}
          <div className="lg:col-span-1">
            <PaymentHistory onError={handleError} />
          </div>
        </div>
      </div>
    </div>
  );
}
