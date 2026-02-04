import { BoltIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { ContactModal } from './contact/ContactModal';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm0 5.108a3.605 3.605 0 100 7.21 3.605 3.605 0 000-7.21zM12 8.027a4.441 4.441 0 110 8.882 4.441 4.441 0 010-8.882z"
      clipRule="evenodd"
    />
  </svg>
);

export const Footer = () => {
  const [displayContactModal, setDisplayContactModal] = useState(false);

  return (
    <footer className="relative overflow-hidden border-t border-gray-200 bg-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <a href="/" aria-label="Go home" title="Block Lotto" className="mb-4 inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lotto-blue-500 text-xl font-bold text-white">
                B
              </div>
              <span className="text-xl font-bold text-gray-900">Block-Lotto</span>
            </a>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-gray-600">
              The first transparent, high-frequency lottery system active on the blockchain. Decentralized luck, powered
              by math.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-lotto-green-200 bg-lotto-green-50 px-3 py-1.5 text-xs font-medium text-lotto-green-700">
              <BoltIcon className="h-3.5 w-3.5" />
              Transparent & Fair
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/lotto" className="text-gray-600 transition-colors hover:text-lotto-green-600">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 transition-colors hover:text-lotto-green-600">
                  How it works
                </a>
              </li>
              <li>
                <a href="#transparency" className="text-gray-600 transition-colors hover:text-lotto-green-600">
                  Transparency
                </a>
              </li>
              <li>
                <a href="/FAQ" className="text-gray-600 transition-colors hover:text-lotto-green-600">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Get in Touch</h3>
            <div className="space-y-3">
              <button
                onClick={() => setDisplayContactModal(true)}
                className="flex w-full items-center gap-2 rounded-lg bg-lotto-green-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lotto-green-600"
              >
                <EnvelopeIcon className="h-4 w-4" />
                Contact Us
              </button>
              <a
                href="https://wa.me/525580088161"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-lotto-green-300 hover:bg-lotto-green-50 hover:text-lotto-green-700"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="tel:+525580088161"
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-lotto-green-300 hover:bg-lotto-green-50 hover:text-lotto-green-700"
              >
                <PhoneIcon className="h-4 w-4" />
                +52 558 008 8161
              </a>
              <a
                href="https://instagram.com/aarontolentinot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-lotto-green-300 hover:bg-lotto-green-50 hover:text-lotto-green-700"
              >
                <InstagramIcon className="h-4 w-4" />
                Instagram
              </a>
              <a
                href="https://caosenterprises.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-gray-500 transition-colors hover:text-lotto-green-600"
              >
                Caos Enterprises →
              </a>
            </div>
            {displayContactModal && <ContactModal onClose={() => setDisplayContactModal(false)} />}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
          <p className="text-center text-sm text-gray-500 sm:text-left">
            Block Lotto © 2025. Powered by{' '}
            <a
              href="https://caosenterprises.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lotto-green-600 transition-colors hover:text-lotto-green-700"
            >
              Caos Enterprises
            </a>
            .
          </p>
          <ul className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <li>
              <a href="/FAQ" className="text-sm text-gray-600 transition-colors hover:text-lotto-green-600">
                FAQ
              </a>
            </li>
            <li>
              <a href="/PrivacyPolicy" className="text-sm text-gray-600 transition-colors hover:text-lotto-green-600">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/TermsAndConditions" className="text-sm text-gray-600 transition-colors hover:text-lotto-green-600">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
