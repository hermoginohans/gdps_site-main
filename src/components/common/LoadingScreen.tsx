import React from 'react';
import { Gamepad2, LoaderCircle } from 'lucide-react';
import { assetUrl } from '../../utils/assets';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-dark text-white flex items-center justify-center">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 esports-perspective-grid opacity-25" />
      <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-brand-gold/30 to-transparent" />
      <div className="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-brand-gold/20 animate-ping" />
          <div className="absolute inset-3 rounded-full border border-dashed border-brand-cyan/50 animate-hud-rotate" />
          <div className="absolute inset-7 rounded-full border border-brand-gold/50 animate-hud-rotate-rev" />
          <div className="absolute inset-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/40 shadow-gold-glow flex items-center justify-center animate-pulse-slow">
            <Gamepad2 className="h-9 w-9 text-brand-gold" />
          </div>
        </div>

        <div className="space-y-3">
          <img
            src={assetUrl('/gpds_logo.png')}
            alt="GPDS GAME SHOP"
            className="mx-auto h-10 w-auto object-contain drop-shadow-[0_4px_16px_rgba(240,192,48,0.35)]"
          />
          <p className="font-display text-[11px] uppercase tracking-[0.35em] text-brand-cyan/80">
            Entering the arena
          </p>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
          <LoaderCircle className="h-4 w-4 animate-spin text-brand-gold" />
          <span>Syncing player profile</span>
        </div>

        <div className="h-1 w-48 overflow-hidden rounded-full bg-brand-cardBorder">
          <div className="h-full w-1/2 animate-[loading-progress_1.4s_ease-in-out_infinite] bg-gradient-to-r from-brand-cyan via-brand-gold to-brand-goldLight" />
        </div>
      </div>
    </div>
  );
};
