import { useState } from 'react';

import { createLead, LeadPayload } from '@/services/leads';

import { prettyToast } from '../ui/PrettyToast';

interface ContactModalProps {
  onClose: () => void;
  projectName?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<LeadPayload>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    system: 'CaosEngine',
    systemData: { component: 'footer-modal' },
    marketing: typeof window !== 'undefined' ? { page: window.location.pathname } : { page: '/' },
    metadata: {},
    tags: ['contact'],
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email) {
      prettyToast.error('Missing required fields', 'Please fill first name, last name and email.');
      return;
    }
    if (!emailRx.test(form.email)) {
      prettyToast.error('Invalid email', 'Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    const tid = prettyToast.loading('Sending...', 'Please wait');

    try {
      await createLead(form);
      prettyToast.dismiss(tid);
      prettyToast.success('Request received', 'We’ll reach out within 1 business day.');
      onClose();
      // reset básico
      setForm(s => ({
        ...s,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      }));
    } catch (err: any) {
      prettyToast.dismiss(tid);
      prettyToast.error('Couldn’t send your request', err?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Card */}
      <div className="relative w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-orange-500/30 via-pink-500/25 to-rose-500/30 blur-xl" />
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-950/95 to-neutral-900/90 p-6 shadow-[0_20px_80px_-20px_rgba(0,0,0,.7)] sm:p-8">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500" />
                Contact Caos Engine
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Request a consultation</h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              disabled={submitting}
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                name="firstName"
                placeholder="First name *"
                value={form.firstName}
                onChange={onChange}
                className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-white placeholder-white/40 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500/60"
              />
              <input
                name="lastName"
                placeholder="Last name *"
                value={form.lastName}
                onChange={onChange}
                className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-white placeholder-white/40 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500/60"
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-white placeholder-white/40 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500/60"
            />

            <input
              name="phone"
              placeholder="Phone (optional)"
              value={form.phone || ''}
              onChange={onChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-white placeholder-white/40 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500/60"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 py-3.5 font-medium text-white shadow-lg shadow-rose-900/20 transition hover:from-orange-400 hover:to-rose-400 disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send'}
            </button>

            <p className="text-center text-xs text-white/50">By submitting, you agree to our Terms & Privacy Policy.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

// ------

// import { motion } from 'framer-motion';
// import { useState } from 'react';
// import { toast } from 'react-toastify';

// interface ContactModalProps {
//   closeModal: () => void;
//   projectName?: string;
// }

// const ContactModal: React.FC<ContactModalProps> = ({ closeModal, projectName = 'Caos Engine' }) => {
//   const [username, setUsername] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Función para manejar el envío del formulario
//   const handleSubmit = async () => {
//     if (!username.trim()) {
//       return toast.warn('⚠️ Add your email, Telegram or Instagram.');
//     }

//     setLoading(true);
//     const SEND_FORM = 'telegram/caosengine';
//     console.log(username);
//     try {
//       // const response = await fetch(`${"https://taloon-studio-backoffice-23773ec9ff31.herokuapp.com/"}${SEND_FORM}`, {
//       const response = await fetch(`${'http://localhost:3002/'}${SEND_FORM}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username,
//           message,
//         }),
//       });

//       console.log(response);
//       const data = await response.json();
//       console.log(data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Error sending the message.');
//       }

//       toast.success(`🚀 ¡Sent! ${projectName}!`);
//       setUsername(''); // Limpiar input
//       setTimeout(() => {
//         closeModal(); // Cerrar el modal después de 2 segundos
//       }, 2000);
//     } catch (error) {
//       toast.error('We cannot send the message right now. Try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Función para manejar la tecla "Enter"
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && !loading) {
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md">
//       <motion.div
//         initial={{ opacity: 0, y: 30, scale: 0.98 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.35, ease: 'easeOut' }}
//         className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
//       >
//         {/* Header */}
//         <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
//           {loading ? '⏳ Sending...' : 'Contact Caos Enterprises'}
//         </h2>
//         <p className="mb-6 text-center text-sm text-gray-600">
//           {loading ? 'Processing your request...' : "Leave us your Contact handle and we'll get in touch."}
//         </p>

//         {/* Input field */}
//         <div className="relative w-full">
//           <input
//             type="text"
//             placeholder="Email, Telegram or Instagram"
//             value={username}
//             onChange={e => setUsername(e.target.value)}
//             onKeyDown={handleKeyDown}
//             disabled={loading}
//             className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-red-600"
//           />

//           <input
//             type="text"
//             placeholder="Message"
//             value={message}
//             onChange={e => setMessage(e.target.value)}
//             onKeyDown={handleKeyDown}
//             disabled={loading}
//             className="mt-5 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-red-600"
//           />

//           {username && (
//             <button
//               onClick={() => setUsername('')}
//               className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700 transition hover:bg-gray-300"
//             >
//               ✕
//             </button>
//           )}
//         </div>

//         {/* Action buttons */}
//         <div className="mt-6 flex justify-between">
//           <button
//             onClick={closeModal}
//             disabled={loading}
//             className="rounded-lg bg-gray-100 px-4 py-2 text-gray-800 transition hover:bg-gray-200 disabled:opacity-50"
//           >
//             Maybe Later
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`rounded-lg px-4 py-2 font-semibold text-white transition-all ${
//               loading ? 'cursor-not-allowed bg-gray-400' : 'bg-red-600 hover:bg-red-700'
//             }`}
//           >
//             {loading ? 'Sending...' : 'Send'}
//           </button>
//         </div>

//         {/* Footer */}
//         <p className="mt-6 text-center text-[11px] text-gray-400">Powered by Caos Engine – proof of randomness for Humans.</p>
//       </motion.div>
//     </div>
//   );
// };

// export default ContactModal;
