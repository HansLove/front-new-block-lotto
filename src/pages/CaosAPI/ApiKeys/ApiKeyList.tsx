import {
  CheckIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  KeyIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import ConfirmationModal from '@/components/modals/ConfirmationModal';

import { useListApiKeys } from './hooks/useListApiKeys';
import { type ApiKey } from './types';

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  isLoadingKeys: boolean;
  onApiKeysChange: (apiKeys: ApiKey[]) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export default function ApiKeyList({ apiKeys, isLoadingKeys, onApiKeysChange, onError, onSuccess }: ApiKeyListProps) {
  const {
    editingKey,
    copiedWebhooks,
    expandedKeys,
    isLoading,
    deletingKey,
    isDeleting,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleUpdateWebhook,
    handleDeleteApiKey,
    confirmDelete,
    toggleKeyExpansion,
    copyWebhookToClipboard,
    startEdit,
    cancelEdit,
    formatDate,
  } = useListApiKeys({ apiKeys, onApiKeysChange, onError, onSuccess });

  return (
    <div className="rounded-xl border border-white/10 bg-surface-elevated">
      <div className="border-b border-white/[0.07] p-6">
        <h2 className="text-xl font-semibold text-white">Your API Keys</h2>
      </div>

      <div className="p-6">
        {isLoadingKeys && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-action-primary/20 border-t-action-primary" />
              <span className="text-white/35">Loading API Keys...</span>
            </div>
          </div>
        )}

        {!isLoadingKeys && apiKeys.length === 0 && (
          <div className="py-8 text-center">
            <KeyIcon className="mx-auto mb-3 h-12 w-12 text-white/15" />
            <p className="text-white/35">You don&apos;t have any API Keys created yet</p>
            <p className="text-sm text-white/25">Create your first API Key using the form above</p>
          </div>
        )}

        {!isLoadingKeys && apiKeys.length > 0 && (
          <div className="space-y-4">
            {apiKeys.map(key => (
              <div
                key={key._id}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05]"
              >
                {/* Header con nombre y toggle */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleKeyExpansion(key._id)}
                    className="-m-2 flex min-w-0 flex-1 items-center space-x-3 rounded-lg p-2 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <ChevronRightIcon
                      className={`h-5 w-5 flex-shrink-0 text-white/25 transition-transform duration-300 ease-in-out ${
                        expandedKeys.has(key._id) ? 'rotate-90' : 'rotate-0'
                      }`}
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                      <h3 className="truncate text-lg font-medium text-white">{key.name}</h3>
                      <span className="flex-shrink-0 self-start rounded-full border border-lotto-green-500/30 bg-lotto-green-500/10 px-3 py-1 text-xs font-medium text-lotto-green-400 sm:self-center">
                        Active
                      </span>
                    </div>
                  </button>

                  {/* Acciones siempre visibles */}
                  <div className="flex flex-shrink-0 items-center gap-1">
                    {editingKey !== key._id && (
                      <button
                        onClick={() => startEdit(key)}
                        className="p-2 text-white/25 transition-colors hover:text-action-primary"
                        title="Edit webhook"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteApiKey(key._id)}
                      disabled={isLoading || isDeleting}
                      className="p-2 text-white/25 transition-colors hover:text-red-400 disabled:opacity-50"
                      title="Delete API Key"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Contenido expandible con animacion */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedKeys.has(key._id) ? 'mt-4 max-h-96 opacity-100' : 'mt-0 max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-4 pl-4 pr-2 sm:pl-8">
                    {/* Webhook */}
                    <div className="mb-3">
                      <div className="mb-1 block text-xs font-medium text-white/25">Webhook</div>
                      {editingKey === key._id ? (
                        <form
                          onSubmit={handleSubmit(handleUpdateWebhook)}
                          className="flex flex-col items-start gap-2 sm:flex-row sm:items-center"
                        >
                          <div className="w-full sm:max-w-lg sm:flex-1">
                            <input
                              id={`webhook-${key._id}`}
                              type="url"
                              {...register('webhook', {
                                required: 'Webhook URL is required',
                                pattern: {
                                  value: /^https?:\/\/.+/,
                                  message: 'Please enter a valid URL',
                                },
                              })}
                              className="w-full rounded border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-action-primary/50 focus:ring-1 focus:ring-action-primary/20"
                              placeholder="https://example.com/webhook"
                              disabled={isSubmitting || isLoading}
                            />
                            {errors.webhook && <p className="mt-1 text-xs text-red-400">{errors.webhook.message}</p>}
                          </div>
                          <div className="flex w-full items-center gap-2 sm:w-auto">
                            <button
                              type="submit"
                              disabled={isLoading || isSubmitting}
                              className="flex-1 rounded-lg bg-action-primary px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-action-hover disabled:opacity-50 sm:flex-none"
                            >
                              {isSubmitting || isLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="mr-1 h-3 w-3 animate-spin rounded-full border border-black border-t-transparent" />
                                  Saving...
                                </div>
                              ) : (
                                'Save'
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/45 transition-colors hover:border-white/20 hover:text-white/70 sm:flex-none"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                          <code className="w-full truncate break-all rounded border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-sm text-white/60 sm:max-w-lg sm:flex-1">
                            {key.webhook}
                          </code>
                          <button
                            onClick={() => copyWebhookToClipboard(key.webhook, `${key._id}-webhook`)}
                            className="self-start p-2 text-white/25 transition-colors hover:text-white sm:self-center"
                            title="Copy webhook"
                          >
                            {copiedWebhooks.has(`${key._id}-webhook`) ? (
                              <CheckIcon className="h-4 w-4 text-lotto-green-400" />
                            ) : (
                              <ClipboardDocumentIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Metadatos */}
                    <div className="flex flex-col gap-2 border-t border-white/[0.05] pt-2 text-xs text-white/25 sm:flex-row sm:items-center sm:gap-4">
                      <span>Created: {formatDate(key.createdAt)}</span>
                      {key.lastUsed && <span>Last used: {formatDate(key.lastUsed)}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmacion para eliminar API Key */}
      <ConfirmationModal
        isOpen={deletingKey !== null}
        onClose={confirmDelete}
        title="Delete API Key"
        message={`Are you sure you want to delete the API Key "${deletingKey?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
