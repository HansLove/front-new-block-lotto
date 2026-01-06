import { useState } from 'react';
import { FaCheck, FaChevronDown, FaClock, FaKey, FaLink, FaQuestion, FaShieldAlt } from 'react-icons/fa';

const FAQs = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Can I use the API directly from the browser?',
      answer:
        'Technically yes, but it is not recommended. API Keys should be kept secret and never exposed in frontend code. You should proxy your requests through your own backend.',
      icon: FaShieldAlt,
      color: 'text-red-400',
    },
    {
      question: 'How do I regenerate my API Key?',
      answer:
        'Go to your developer dashboard, navigate to the "API Keys" section, and click "Regenerate". Your previous key will be invalidated immediately.',
      icon: FaKey,
      color: 'text-orange-400',
    },
    {
      question: 'What happens if I exceed my rate limit?',
      answer:
        'You will receive a 429 Too Many Requests error. Wait until your quota resets or upgrade to a higher plan.',
      icon: FaClock,
      color: 'text-yellow-400',
    },
    {
      question: 'Is the randomness truly verifiable?',
      answer:
        'Yes. Each random output is generated through a proof-of-work process that is cryptographically verifiable. We are also working on exposing verification endpoints in the future.',
      icon: FaCheck,
      color: 'text-green-400',
    },
    {
      question: 'Can I use Caos Engine for blockchain or smart contracts?',
      answer:
        'While Caos Engine is not a blockchain itself, it is ideal for use as an external randomness oracle. Future integrations with major networks like Ethereum and Solana are planned.',
      icon: FaLink,
      color: 'text-blue-400',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
          <FaQuestion className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-bold text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-slate-300">
          Common questions and answers about the Caos Engine API
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const IconComponent = faq.icon;
          const isOpen = openFAQ === index;

          return (
            <div
              key={index}
              className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm transition-all duration-200 hover:border-slate-600"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className={`rounded-full bg-slate-700/50 p-3 ${faq.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                </div>

                <FaChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="border-t border-slate-700 p-6 pt-4">
                  <p className="leading-relaxed text-slate-300">{faq.answer}</p>
                  {index === 2 && (
                    <div className="mt-3 rounded-lg bg-slate-900/50 p-3">
                      <code className="text-sm text-red-400">429 Too Many Requests</code>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Section */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/30 p-8 text-center backdrop-blur-sm">
        <div className="mb-4 text-4xl">💬</div>
        <h2 className="mb-4 text-2xl font-bold text-white">Still have questions?</h2>
        <p className="mb-6 text-slate-300">Can't find the answer you're looking for? Reach out to our support team.</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25">
            Contact Support
          </button>
          <button className="rounded-lg border border-slate-600 px-6 py-3 font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800/50 hover:text-white">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
