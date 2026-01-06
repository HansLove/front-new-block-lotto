import { BoltIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { ContactModal } from './contact/ContactModal';

export const Footer = () => {
  const [displayContactModal, setDisplayContactModal] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-white border-t border-gray-200">
      <div className="relative z-10 mx-auto px-4 pt-16 pb-8 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
        <div className="row-gap-8 mb-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" aria-label="Go home" title="Block Lotto" className="group mb-8 inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lotto-blue-500 text-xl font-bold text-white">
                B
              </div>
              <span className="text-xl font-bold text-gray-900">Block-Lotto</span>
            </a>
            <div className="lg:max-w-md">
              <p className="mb-6 text-base leading-relaxed text-gray-600">
                The first transparent, high-frequency lottery system active on the blockchain. Decentralized luck, powered by math.
              </p>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-lotto-green-200 bg-lotto-green-50 px-4 py-2 text-sm text-lotto-green-700">
                <BoltIcon className="h-4 w-4" />
                Transparent & Fair
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="mb-6 text-xl font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/lotto"
                  className="inline-block text-gray-600 transition-colors duration-300 hover:text-lotto-green-600"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="inline-block text-gray-600 transition-colors duration-300 hover:text-lotto-green-600"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#transparency"
                  className="inline-block text-gray-600 transition-colors duration-300 hover:text-lotto-green-600"
                >
                  Transparency
                </a>
              </li>
              <li>
                <a
                  href="/FAQ"
                  className="inline-block text-gray-600 transition-colors duration-300 hover:text-lotto-green-600"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact section */}
          <div className="space-y-6">
            <h3 className="mb-6 text-xl font-semibold text-gray-900">Get in Touch</h3>

            {/* Contact buttons */}
            <div className="space-y-4">
              <button
                onClick={() => setDisplayContactModal(true)}
                className="group inline-flex w-full items-center gap-3 rounded-xl bg-lotto-green-500 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-lotto-green-600 hover:shadow-xl"
              >
                <EnvelopeIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                Contact Us
              </button>

              <a
                href="https://wa.me/+1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center gap-3 rounded-xl border border-lotto-green-300 bg-lotto-green-50 px-6 py-3 font-medium text-lotto-green-700 transition-all duration-300 hover:scale-105 hover:border-lotto-green-400 hover:bg-lotto-green-100"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                WhatsApp
              </a>

              <a
                href="tel:+1234567890"
                className="group inline-flex w-full items-center gap-3 rounded-xl border border-lotto-blue-300 bg-lotto-blue-50 px-6 py-3 font-medium text-lotto-blue-700 transition-all duration-300 hover:scale-105 hover:border-lotto-blue-400 hover:bg-lotto-blue-100"
              >
                <PhoneIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Call Us
              </a>
            </div>

            {/* Email */}
            <div className="border-t border-gray-200 pt-4">
              <p className="mb-2 text-sm font-medium text-gray-500">Email:</p>
              <a
                href="mailto:support@blocklotto.com"
                aria-label="Our email"
                title="Our email"
                className="inline-block text-sm text-lotto-green-600 transition-colors duration-300 hover:text-lotto-green-700"
              >
                support@blocklotto.com
              </a>
            </div>

            {displayContactModal && <ContactModal onClose={() => setDisplayContactModal(false)} />}
          </div>

          {/* Quote section */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lotto-green-100 ring-2 ring-lotto-green-200">
                  <BoltIcon className="h-5 w-5 text-lotto-green-600" />
                </div>
                <div>
                  <p className="mb-3 text-sm leading-relaxed text-gray-700">"The thing with chaos is…it's fair"</p>
                  <p className="text-xs italic text-gray-500">- The Joker, Batman The Dark Knight</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col-reverse justify-between border-t border-gray-200 pb-12 pt-8 lg:flex-row">
          <p className="mt-4 text-sm text-gray-500 lg:mt-0">
            Block Lotto © Copyright 2025 All rights reserved. Built with transparency.
          </p>
          <ul className="mb-3 flex flex-col space-y-3 sm:flex-row sm:space-x-8 sm:space-y-0 lg:mb-0">
            <li>
              <a
                href="/FAQ"
                className="inline-block text-sm text-gray-600 transition-colors duration-300 hover:text-lotto-green-600"
              >
                F.A.Q
              </a>
            </li>
            <li>
              <a
                href="/PrivacyPolicy"
                className="inline-block text-sm text-gray-600 transition-colors duration-300 hover:text-lotto-green-600"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/TermsAndConditions"
                className="inline-block text-sm text-gray-600 transition-colors duration-300 hover:text-lotto-green-600"
              >
                Terms &amp; Conditions
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
