import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

import Modal from './HeadlessModal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: (confirmed: boolean) => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onClose(true);
  };

  const handleCancel = () => {
    onClose(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose(false);
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/10',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        };
      case 'warning':
        return {
          iconColor: 'text-action-primary',
          iconBg: 'bg-action-primary/10',
          confirmButton: 'bg-action-primary hover:bg-action-hover text-black focus:ring-action-primary',
        };
      case 'info':
        return {
          iconColor: 'text-action-primary',
          iconBg: 'bg-action-primary/10',
          confirmButton: 'bg-action-primary hover:bg-action-hover text-black focus:ring-action-primary',
        };
      default:
        return {
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/10',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
      className="max-w-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
        <div className="flex items-center space-x-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}>
            <ExclamationTriangleIcon className={`h-6 w-6 ${styles.iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>

        {!isLoading && (
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-white/25 transition-colors hover:bg-white/[0.08] hover:text-white"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-white/45">{message}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col space-y-2 border-t border-white/[0.07] p-4 sm:flex-row sm:space-x-3 sm:space-y-0">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/45 transition-colors hover:border-white/20 hover:text-white/70 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cancelText}
        </button>

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${styles.confirmButton}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="border-current/30 mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-current" />
              Processing...
            </div>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
}
