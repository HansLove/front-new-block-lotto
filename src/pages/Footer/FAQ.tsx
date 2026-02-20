import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What is CaosEngine?',
    answer:
      'CaosEngine is a platform for entropy generation, randomness, and tools for secure decision-making, chaos visualization, and algorithmic simulation.',
  },
  {
    question: 'How are random numbers generated?',
    answer:
      'We combine pseudo-random generation methods with simulated events to produce cryptographically strong and visually traceable seeds.',
  },
  {
    question: 'Can I integrate CaosEngine with my systems?',
    answer:
      'Yes, we are working on a public API. In the meantime, you can use the visualized data or integrate via local WebSocket streams.',
  },
  {
    question: 'Do I need to create an account to use it?',
    answer:
      'Not for the basic tools. Some advanced features will require authentication to ensure integrity and control over the chaos environment.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-surface-base px-6 py-12 text-white">
      <div className="flex justify-around border-b border-white/[0.07]">
        <a href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Block Lotto</span>
          <img className="h-12 w-auto" src="/images/logo-light.png" alt="Block Lotto" />
        </a>
        <h1 className="mb-8 pb-4 text-4xl font-bold">Frequently Asked Questions</h1>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 py-5">
        {faqData.map((item, index) => (
          <div key={index} className="rounded-xl border border-white/10">
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-white/[0.04]"
            >
              <span className="text-lg font-semibold">{item.question}</span>
              <span className="text-xl text-white/25">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && <div className="px-6 pb-4 text-white/35">{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
