import React, { useState } from 'react';
import { 
  Ticket, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Clock, 
  Gift, 
  ShieldCheck,
  Percent
} from 'lucide-react';
import { VOUCHERS } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';
import { useRouter } from '../context/RouterContext';

export const VouchersPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { navigate } = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#2A1838] via-[#141026] to-[#2A1838] border border-brand-gold/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
            <Gift className="w-3.5 h-3.5" /> Exclusive Gamer Promos
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
            GPDS Promo Codes & Vouchers
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Copy active coupon codes for instant discounts on diamonds, passes, tokens, and gaming gift cards during checkout.
          </p>
        </div>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VOUCHERS.map(v => (
          <div
            key={v.id}
            className="rounded-3xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-brand-gold/10 group relative overflow-hidden"
          >
            {/* Ambient decorative circle */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-gold/5 rounded-full pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                  {v.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  Min spend: <strong className="text-white">{formatPrice(v.minSpendPhp)}</strong>
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-display font-black text-white group-hover:text-brand-gold transition-colors">
                  {v.discountValue}
                </h3>
                <h4 className="font-bold text-sm text-gray-200 mt-1">{v.title}</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{v.description}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Valid until: <strong className="text-gray-300">{v.expiryDate}</strong></span>
              </div>
            </div>

            {/* Bottom code strip & action */}
            <div className="mt-6 pt-4 border-t border-brand-cardBorder flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-[#0E0A1C] border border-brand-cardBorder px-3 py-2 rounded-xl">
                <code className="font-mono font-black text-sm text-brand-gold tracking-wider">
                  {v.code}
                </code>
                <button
                  onClick={() => handleCopy(v.code)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Copy code"
                >
                  {copiedCode === v.code ? (
                    <span className="text-green-400 text-xs flex items-center gap-1 font-semibold">
                      <Check className="w-4 h-4" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  if (v.applicableGames.includes('mobile-legends')) {
                    navigate('/games/mobile-legends');
                  } else {
                    navigate('/games');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-extrabold text-xs uppercase tracking-wider hover:opacity-95 shadow-gold-glow transition-all flex items-center gap-1.5"
              >
                Use Code <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* How To Redeem Guide */}
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-6">
        <h3 className="text-lg sm:text-xl font-display font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-gold" /> How to Redeem Your Voucher Code
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-[#0E0A1C] border border-brand-cardBorder space-y-2">
            <div className="w-8 h-8 rounded-xl bg-brand-gold/20 text-brand-gold font-black flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-sm text-white">Copy Code</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Click the copy button on any coupon above to copy it directly to your clipboard.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E0A1C] border border-brand-cardBorder space-y-2">
            <div className="w-8 h-8 rounded-xl bg-brand-cyan/20 text-brand-cyan font-black flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-sm text-white">Select Game & Package</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Choose your diamond or token pack and meet the minimum spend requirement.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E0A1C] border border-brand-cardBorder space-y-2">
            <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-brand-green font-black flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-sm text-white">Paste at Step 4</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Paste the code into the promo field during checkout and watch your total drop instantly!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
