import { CheckIcon, ClipboardDocumentIcon, ExclamationTriangleIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import HeadlessModal from '@/components/modals/HeadlessModal';

interface OneTimeKeyModalProps {
  isOpen: boolean;
  apiKey: string;
  keyName: string;
  onClose: () => void;
}

export default function OneTimeKeyModal({ isOpen, apiKey, keyName, onClose }: OneTimeKeyModalProps) {
  const [copied, setCopied] = useState(false);
  const [hasCopied, setHasCopied] = useState(false); // Permanent state for copy action
  const [acknowledged, setAcknowledged] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setHasCopied(true); // Set permanent copy state
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleClose = () => {
    if (hasCopied && acknowledged) {
      onClose();
    }
  };

  const partialKey = `${apiKey.slice(0, 12)}...`;

  return (
    <HeadlessModal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      closeOnEscape={false}
      className="border border-slate-700"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-700 bg-green-900/30">
            <KeyIcon className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-white">API Key Created Successfully</h3>
            <p className="text-sm text-slate-400">{keyName}</p>
          </div>
        </div>

        {/* Warning */}
        <div className="mb-4 flex items-start space-x-3 rounded-lg border border-yellow-700 bg-yellow-900/20 p-3">
          <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-400" />
          <div>
            <p className="text-sm font-medium text-yellow-400">Important Security Notice</p>
            <p className="mt-1 text-xs text-yellow-300">
              This is the only time you&apos;ll be able to see this API key. Make sure to copy and store it securely.
            </p>
          </div>
        </div>

        {/* API Key Display */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium text-slate-400">Your API Key</label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 rounded border border-slate-600 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-300">
              {partialKey}
            </code>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              {copied && (
                <>
                  <CheckIcon className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              )}
              {!copied && (
                <>
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Acknowledgment */}
        <div className="mb-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={e => setAcknowledged(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
            />
            <span className="text-sm text-slate-300">
              I understand this key will not be shown again and I have stored it securely
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            disabled={!hasCopied || !acknowledged}
            className={`rounded px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              hasCopied && acknowledged ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-600 hover:bg-slate-700'
            }`}
          >
            I&apos;ve Secured My Key
          </button>
        </div>
      </div>
    </HeadlessModal>
  );
}
