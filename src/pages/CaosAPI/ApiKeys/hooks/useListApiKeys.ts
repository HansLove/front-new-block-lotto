import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { API_URL } from '@/utils/Rutes';

import { type ApiKey } from '../types';

interface ApiKeyFormData {
  webhook: string;
}

interface UseListApiKeysProps {
  apiKeys: ApiKey[];
  onApiKeysChange: (apiKeys: ApiKey[]) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export function useListApiKeys({ apiKeys, onApiKeysChange, onError, onSuccess }: UseListApiKeysProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [copiedWebhooks, setCopiedWebhooks] = useState<Set<string>>(new Set());
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [deletingKey, setDeletingKey] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ApiKeyFormData>({});
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const handleUpdateWebhook = async (data: ApiKeyFormData) => {
    if (!editingKey) return;

    try {
      setIsLoading(true);
      onError(''); // Clear previous errors
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}api/v1/caos/update-key/${editingKey}`,
        { webhook: data.webhook },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedApiKeys = apiKeys.map(key => (key._id === editingKey ? { ...key, webhook: data.webhook } : key));
      onApiKeysChange(updatedApiKeys);
      setEditingKey(null);
      reset();
      onSuccess('Webhook updated successfully');
    } catch (error: any) {
      onError(error.response?.data?.message || 'Error updating webhook');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    const keyToDelete = apiKeys.find(key => key._id === keyId);
    if (!keyToDelete) return;

    setDeletingKey({ id: keyId, name: keyToDelete.name });
  };

  const confirmDelete = async (confirmed: boolean) => {
    if (!confirmed || !deletingKey) {
      setDeletingKey(null);
      setIsDeleting(false);
      return;
    }

    try {
      setIsDeleting(true);
      onError(''); // Clear previous errors
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}api/v1/caos/delete-key/${deletingKey.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedApiKeys = apiKeys.filter(key => key._id !== deletingKey.id);
      onApiKeysChange(updatedApiKeys);
      onSuccess('API Key deleted successfully');
    } catch (error: any) {
      onError(error.response?.data?.message || 'Error deleting API Key');
    } finally {
      setIsDeleting(false);
      setDeletingKey(null);
    }
  };

  const toggleKeyExpansion = (keyId: string) => {
    const newExpandedKeys = new Set(expandedKeys);
    if (newExpandedKeys.has(keyId)) {
      newExpandedKeys.delete(keyId);
    } else {
      newExpandedKeys.add(keyId);
    }
    setExpandedKeys(newExpandedKeys);
  };

  const copyWebhookToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      const newCopiedWebhooks = new Set(copiedWebhooks);
      newCopiedWebhooks.add(keyId);
      setCopiedWebhooks(newCopiedWebhooks);

      setTimeout(() => {
        setCopiedWebhooks(prev => {
          const updated = new Set(prev);
          updated.delete(keyId);
          return updated;
        });
      }, 2000);
    } catch (error) {
      onError('Error copying to clipboard');
    }
  };

  const startEdit = (key: ApiKey) => {
    setEditingKey(key._id);
    setValue('webhook', key.webhook);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    reset();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return {
    // States
    editingKey,
    copiedWebhooks,
    expandedKeys,
    isLoading,
    deletingKey,
    isDeleting,

    // Form
    register,
    handleSubmit,
    errors,
    isSubmitting,

    // Methods
    handleUpdateWebhook,
    handleDeleteApiKey,
    confirmDelete,
    toggleKeyExpansion,
    copyWebhookToClipboard,
    startEdit,
    cancelEdit,
    formatDate,
  };
}
