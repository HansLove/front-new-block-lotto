import { UserIcon, XMarkIcon } from '@heroicons/react/24/outline';

import Modal from './HeadlessModal';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true} closeOnEscape={true} className="max-w-md">
      {/* Header with close button */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lotto-blue-100">
            <UserIcon className="h-6 w-6 text-lotto-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Login Required</h3>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600">
          You need to be logged in to perform this action. Please sign in to continue.
        </p>
      </div>

      {/* Action button */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-lotto-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-lotto-green-600 focus:outline-none focus:ring-2 focus:ring-lotto-green-500 focus:ring-offset-2"
        >
          Understood
        </button>
      </div>
    </Modal>
  );
}
