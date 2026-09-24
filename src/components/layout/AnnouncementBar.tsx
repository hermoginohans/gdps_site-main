import React, { useState } from 'react';
import { Zap, ShieldCheck, Flame, X, Sparkles } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { navigate } = useRouter();

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#1E1238] via-[#2A1D4E] to-[#1E1238] border-b border-brand-gold/30 text-xs py-2 px-4 text-brand-text overflow-hidden z-40">
      {/* Animated subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent animate-pulse-slow pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="flex items-center gap-1.5 bg-brand-gold/20 text-brand-gold font-bold px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wider border border-brand-gold/30">
            <Flame className="w-3.5 h-3.5 text-brand-gold animate-bounce" /> Hot Promo
          </span>
          <span className="text-gray-300 font-medium hidden sm:inline">
            Get up to <strong className="text-brand-gold">25% OFF</strong> on Mobile Legends & Honor of Kings! Use code <code className="bg-black/40 px-1.5 py-0.5 rounded text-brand-gold font-mono font-bold">GPDSFIRST50</code>
          </span>
          <span className="text-gray-300 font-medium sm:hidden">
            Save up to 25% on MLBB & HoK with code <code className="bg-black/40 px-1 py-0.5 rounded text-brand-gold font-bold">GPDSFIRST50</code>
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-gray-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
            <span className="text-gray-300">Gateway Status:</span>
            <span className="text-brand-green font-semibold">100% Operational (1-5 min)</span>
          </div>

          <button
            onClick={() => navigate('/vouchers')}
            className="hidden lg:flex items-center gap-1 text-brand-gold hover:text-brand-goldLight font-semibold text-[11px] underline underline-offset-2 transition-colors"
          >
            <Sparkles className="w-3 h-3" /> View All Promos
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
