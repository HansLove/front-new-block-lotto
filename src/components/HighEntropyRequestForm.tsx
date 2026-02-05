import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  CogIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface FormData {
  name: string;
  organization: string;
  email: string;
  telegram: string;
  purpose: string;
  entropyVolume: number;
  duration: string;
  yieldExposure: boolean;
}

interface HighEntropyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const HighEntropyRequestForm = ({ isOpen, onClose }: HighEntropyRequestFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    organization: '',
    email: '',
    telegram: '',
    purpose: '',
    entropyVolume: 1000000,
    duration: 'one-time',
    yieldExposure: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  // Handle escape key and body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  const purposeOptions = [
    { value: 'ai-training', label: 'AI Training', icon: CpuChipIcon },
    { value: 'gaming', label: 'Gaming', icon: GlobeAltIcon },
    { value: 'finance', label: 'Finance & Economics', icon: CurrencyDollarIcon },
    { value: 'research', label: 'Research', icon: AcademicCapIcon },
    { value: 'other', label: 'Other', icon: CogIcon },
  ];

  const durationOptions = [
    { value: 'one-time', label: 'One-time' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];

  const entropyVolumeOptions = [
    { value: 1000000, label: '10⁶ bits (1M)', description: 'Basic simulations' },
    { value: 10000000, label: '10⁷ bits (10M)', description: 'Medium complexity' },
    { value: 100000000, label: '10⁸ bits (100M)', description: 'High complexity' },
    { value: 1000000000, label: '10⁹ bits (1B)', description: 'Enterprise grade' },
    { value: 10000000000, label: '10¹⁰ bits (10B)', description: 'Research level' },
    { value: 100000000000, label: '10¹¹ bits (100B)', description: 'Advanced research' },
    { value: 1000000000000, label: '10¹² bits (1T)', description: 'Maximum entropy' },
  ];

  const generateRequestId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `REQ-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newRequestId = generateRequestId();
    setRequestId(newRequestId);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
            <CheckCircleIcon className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-4 text-2xl font-bold text-white">Request Submitted Successfully!</h3>
          <div className="mb-6 rounded-lg bg-slate-900/50 p-4">
            <p className="mb-2 text-sm text-gray-400">Request ID:</p>
            <p className="font-mono text-xl text-green-400">{requestId}</p>
          </div>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <ClockIcon className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300">Our entropy engineers will review your parameters</span>
            </div>
            <div className="flex items-center gap-3">
              <ClockIcon className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300">You'll receive a response within 24 hours</span>
            </div>
            <div className="flex items-center gap-3">
              <ClockIcon className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300">Custom entropy solution will be prepared</span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                organization: '',
                email: '',
                telegram: '',
                purpose: '',
                entropyVolume: 1000000,
                duration: 'one-time',
                yieldExposure: false,
              });
            }}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-blue-700"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto">
        <div className="rounded-xl border-2 border-blue-500/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-6 shadow-lg md:p-8">
          {/* Header with close button */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex-1 text-center">
              <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">🧠 High Entropy Request</h3>
              <p className="text-sm text-gray-300 md:text-base">
                Request high-entropy randomization tailored to your AI, simulation, or protocol needs
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-700/50 text-gray-300 transition-all duration-200 hover:bg-slate-600/50 hover:text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Organization */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className="w-full rounded-lg bg-slate-900/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Organization</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={e => handleInputChange('organization', e.target.value)}
                  className="w-full rounded-lg bg-slate-900/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Company or institution"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="w-full rounded-lg bg-slate-900/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Telegram</label>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={e => handleInputChange('telegram', e.target.value)}
                  className="w-full rounded-lg bg-slate-900/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="@username"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Purpose *</label>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {purposeOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('purpose', option.value)}
                      className={`flex items-center gap-3 rounded-lg border p-4 transition-all duration-200 ${
                        formData.purpose === option.value
                          ? 'border-blue-500 bg-blue-600/20 text-white'
                          : 'border-slate-600 bg-slate-900/50 text-gray-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Entropy Volume */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Required Entropy Volume *</label>
              <div className="space-y-3">
                {entropyVolumeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('entropyVolume', option.value)}
                    className={`w-full rounded-lg border p-4 text-left transition-all duration-200 ${
                      formData.entropyVolume === option.value
                        ? 'border-purple-500 bg-purple-600/20 text-white'
                        : 'border-slate-600 bg-slate-900/50 text-gray-300 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-gray-400">{option.description}</p>
                      </div>
                      {formData.entropyVolume === option.value && (
                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Desired Duration / Frequency *</label>
              <div className="grid gap-3 md:grid-cols-4">
                {durationOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('duration', option.value)}
                    className={`rounded-lg border p-3 font-medium transition-all duration-200 ${
                      formData.duration === option.value
                        ? 'border-orange-500 bg-orange-600/20 text-white'
                        : 'border-slate-600 bg-slate-900/50 text-gray-300 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Yield Exposure */}
            <div className="rounded-lg border border-slate-600 bg-slate-900/30 p-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="yieldExposure"
                  checked={formData.yieldExposure}
                  onChange={e => handleInputChange('yieldExposure', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="yieldExposure" className="text-sm font-medium text-white">
                  Would you like to measure yield exposure?
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Enable advanced analytics to measure potential yield exposure in your entropy-based simulations
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.purpose}
                className={`w-full rounded-lg px-6 py-4 font-medium transition-all duration-200 ${
                  isSubmitting || !formData.name || !formData.email || !formData.purpose
                    ? 'cursor-not-allowed bg-gray-600 text-gray-300'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <CogIcon className="h-5 w-5 animate-spin" />
                    Submitting Request...
                  </div>
                ) : (
                  'Submit High Entropy Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HighEntropyRequestForm;
