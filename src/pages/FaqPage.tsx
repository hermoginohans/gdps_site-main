import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { FAQS } from '../data/mockData';

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const toggleIndex = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter(i => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  const filteredFaqs = FAQS.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
          <HelpCircle className="w-3.5 h-3.5" /> Help Center & Knowledge Base
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
          Find answers about top-up delivery times, accepted Philippine payment gateways, and account security.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-brand-gold absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search questions (e.g. GCash, delivery time, password, refund)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-brand-card border border-brand-cardBorder focus:border-brand-gold rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none shadow-sm"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className="rounded-2xl bg-brand-card border border-brand-cardBorder overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-base text-white hover:text-brand-gold transition-colors"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-brand-gold shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-gray-300 leading-relaxed border-t border-brand-cardBorder/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No FAQs found matching "{searchQuery}". Try asking our live agent on WhatsApp.
          </div>
        )}
      </div>

      {/* Still need help callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1D1635] via-[#141026] to-[#1D1635] border border-brand-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="font-display font-bold text-lg text-white">Still have questions?</h3>
          <p className="text-xs text-gray-400 mt-0.5">Our support agents are live 6:00 AM – 4:00 AM PHT.</p>
        </div>
        <a
          href="https://wa.me/639774541147"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <MessageCircle className="w-4 h-4" /> Message Support
        </a>
      </div>

    </div>
  );
};
