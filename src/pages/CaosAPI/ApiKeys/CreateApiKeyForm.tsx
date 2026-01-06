import { KeyIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { API_URL } from '@/utils/Rutes';

import OneTimeKeyModal from './OneTimeKeyModal';
import { type ApiKey } from './types';

interface ApiKeyFormData {
  name: string;
  webhook: string;
}

interface CreateApiKeyFormProps {
  onApiKeyCreated: (newApiKey: ApiKey) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export default function CreateApiKeyForm({ onApiKeyCreated, onError, onSuccess }: CreateApiKeyFormProps) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState<{ key: string; name: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ApiKeyFormData>({
    defaultValues: {
      name: '',
      webhook: '',
    },
  });

  const onSubmit = async (data: ApiKeyFormData) => {
    try {
      onError(''); // Clear previous errors
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}api/v1/caos/generate-key`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Store key data and show modal
      setNewApiKey({
        key: response.data.key.key,
        name: response.data.key.name,
      });
      setShowKeyModal(true);

      onApiKeyCreated(response.data.key);
      onSuccess('API Key created successfully');
      reset();
    } catch (error: any) {
      onError(error.response?.data?.message || 'Error creating API Key');
    }
  };

  const handleModalClose = () => {
    setShowKeyModal(false);
    setNewApiKey(null);
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-6 backdrop-blur-sm">
      <h2 className="mb-6 flex items-center text-xl font-semibold text-white">
        <div className="mr-3 rounded-full bg-gradient-to-r from-red-500 to-orange-600 p-2">
          <KeyIcon className="h-5 w-5 text-white" />
        </div>
        Create new API Key
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
              Application name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Application name is required',
                minLength: {
                  value: 2,
                  message: 'Application name must be at least 2 characters',
                },
                onChange: () => clearErrors('name'),
              })}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="My Application"
              disabled={isSubmitting}
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="webhook" className="mb-2 block text-sm font-medium text-slate-300">
              Webhook URL
            </label>
            <input
              id="webhook"
              type="url"
              {...register('webhook', {
                required: 'Webhook URL is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please enter a valid URL',
                },
                onChange: () => clearErrors('webhook'),
              })}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="https://api.myapp.com/webhook"
              disabled={isSubmitting}
            />
            {errors.webhook && <p className="mt-1 text-sm text-red-400">{errors.webhook.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-red-700 hover:to-orange-700 hover:shadow-red-500/25 disabled:cursor-not-allowed disabled:from-red-800 disabled:to-orange-800 md:w-auto"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Creating...
            </div>
          ) : (
            'Create API Key'
          )}
        </button>
      </form>

      {/* One Time Key Modal */}
      {newApiKey && (
        <OneTimeKeyModal
          isOpen={showKeyModal}
          apiKey={newApiKey.key}
          keyName={newApiKey.name}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
