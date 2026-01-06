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

  // Estilos según el tipo
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-400',
          iconBg: 'bg-red-900/20',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-400',
          iconBg: 'bg-yellow-900/20',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        };
      case 'info':
        return {
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-900/20',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        };
      default:
        return {
          iconColor: 'text-red-400',
          iconBg: 'bg-red-900/20',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
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
      {/* Header con botón de cierre */}
      <div className="flex items-center justify-between border-b border-slate-700 p-4">
        <div className="flex items-center space-x-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}>
            <ExclamationTriangleIcon className={`h-6 w-6 ${styles.iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold text-white dark:text-gray-900">{title}</h3>
        </div>

        {!isLoading && (
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">
        <p className="text-slate-300 dark:text-slate-600">{message}</p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col space-y-2 border-t border-slate-700 p-4 sm:flex-row sm:space-x-3 sm:space-y-0">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1 rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cancelText}
        </button>

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-50 ${styles.confirmButton}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
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
