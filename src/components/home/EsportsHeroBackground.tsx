import React from 'react';

interface EsportsHeroBackgroundProps {
  className?: string;
}

export const EsportsHeroBackground: React.FC<EsportsHeroBackgroundProps> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Dynamic Moving Stage Core Glow & Auroras */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] bg-gradient-to-b from-brand-gold/15 via-brand-cyan/10 to-transparent rounded-full blur-3xl esports-nebula-1 pointer-events-none" />
      
      {/* 2. Sweeping Spotlight Blooms */}
      <div className="absolute -top-20 left-1/4 w-[520px] h-[380px] bg-brand-gold/12 rounded-full blur-[120px] esports-nebula-2 pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[480px] h-[380px] bg-brand-cyan/12 rounded-full blur-[120px] esports-nebula-1 pointer-events-none" />

      {/* 3. Seamless Soft Fade into Page Background */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-b from-transparent to-brand-dark/90 pointer-events-none" />
    </div>
  );
};
