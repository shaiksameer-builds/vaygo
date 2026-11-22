import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How does renting a bike or car on Vaygo work?',
    answer:
      'Simply choose your city, select your desired vehicle (bike or car), pick your rental dates and duration, and confirm your booking. You can opt for self-drive or driver-assisted options with zero security deposit.',
  },
  {
    question: 'What documents are required to pick up a vehicle?',
    answer:
      'For self-drive rentals, you need a valid original Government Driving License (DL) and an Aadhaar/Passport for identity verification. For driver-assisted rides, only a government photo ID is required.',
  },
  {
    question: 'What is included in the rental price?',
    answer:
      'All rental packages include comprehensive insurance, roadside assistance (RSA 24x7), two sanitized helmets for two-wheelers, and generous free kilometer allowances (up to 901 km included on select vehicles).',
  },
  {
    question: 'How can I become a vehicle host and earn money?',
    answer:
      'Vehicle owners can list their unused bikes, scooters, or cars in less than 5 minutes. You set your availability, choose your daily rates, and earn anywhere between ₹5,000 to ₹40,000+ monthly with complete payment protection.',
  },
  {
    question: 'What is the cancellation policy?',
    answer:
      'Cancel up to 6 hours before your pickup time for a 100% full refund. Cancellations made within 6 hours incur only a nominal convenience fee.',
  },
];

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 px-4 bg-[#0A0A0A] border-t border-white/10 textured-surface" id="faq-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
            <HelpCircle size={14} className="text-white" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-[#A1A1AA] text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            Everything you need to know about peer-to-peer rentals, insurance, and listing your vehicle on Vaygo.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="glass-card rounded-2xl overflow-hidden border border-white/10"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between text-white font-bold text-sm sm:text-base hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-white transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-5 text-[#A1A1AA] text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
