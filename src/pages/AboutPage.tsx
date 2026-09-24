import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Award, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  Heart 
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { assetUrl } from '../utils/assets';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  const milestones = [
    { year: '2018', title: 'Founded by Angelo "bhadzki" Leoncio', description: 'Started as a trusted Facebook community top-up group for Filipino ranked MLBB grinders.' },
    { year: '2020', title: 'First 100,000 Gamers Served', description: 'Introduced automated direct-server APIs for Mobile Legends diamonds and Garena shells.' },
    { year: '2022', title: 'Official Esports Sponsorships', description: 'Partnered with amateur and semi-pro MPL teams, casters, and grassroots gaming leagues.' },
    { year: '2024', title: 'Global Server & Regional Expansion', description: 'Extended operations across Southeast Asia and international servers with 24/7 dedicated gamer support.' },
    { year: '2026', title: 'GPDS 2.0 Next-Gen Platform', description: 'Redesigned from scratch with live auction marketplace, instant QRPH top-ups, and partner APIs.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center pb-1">
          <img 
            src={assetUrl("/gpds_logo.png")} 
            alt="GPDS GAME SHOP" 
            className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_4px_20px_rgba(240,192,48,0.3)]" 
          />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
          <Award className="w-3.5 h-3.5" /> Established 2018 • Trusted Gaming Top-Up
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white">
          About <span className="text-gradient-gold">GPDS GAME SHOP</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          Founded by Angelo "bhadzki" Leoncio, GPDS Game Shop is a registered digital currency platform delivering authentic in-game items, vouchers, and accounts to over 500,000 gamers worldwide.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Speed & Reliability</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Direct server connections credit your diamonds, tokens, and passes within 1 to 5 minutes so you never miss an event draw or seasonal skin sale.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-green-500/15 text-green-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Guaranteed Safe (No Login)</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            We only require your public Game User ID and Zone ID. We never ask for passwords or private credentials. Your account is 100% secure.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Gamer-First Support</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Our customer care team operates 22 hours daily (6am - 4am PHT) on WhatsApp and Facebook to resolve any transaction inquiry immediately.
          </p>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="p-8 sm:p-12 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-8">
        <h2 className="text-2xl font-display font-black text-white text-center">
          Our Journey Since 2018
        </h2>

        <div className="space-y-6 max-w-2xl mx-auto">
          {milestones.map((m, idx) => (
            <div key={m.year} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-dark font-display font-black text-sm flex items-center justify-center shrink-0 shadow-gold-glow">
                  {m.year}
                </div>
                {idx < milestones.length - 1 && <div className="w-0.5 h-12 bg-brand-cardBorder" />}
              </div>

              <div className="pt-1">
                <h4 className="font-display font-bold text-base text-white">{m.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Founder Message */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1C1635] to-[#120E22] border border-brand-gold/30 flex flex-col sm:flex-row items-center gap-6">
        <img
          src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80"
          alt="Angelo bhadzki Leoncio"
          className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-gold shadow-gold-glow shrink-0"
        />
        <div className="space-y-2 text-center sm:text-left">
          <blockquote className="text-sm text-gray-300 italic leading-relaxed">
            "When we started GPDS in 2018, gamers had to pay hefty credit card fees or risk getting scammed in unverified social media groups. We built GPDS to give every Filipino and international gamer cheap, instant, and 100% legitimate top-ups with zero hassle."
          </blockquote>
          <div>
            <div className="font-display font-bold text-white text-base">Angelo "bhadzki" Leoncio</div>
            <div className="text-xs text-brand-gold font-medium">Founder & CEO, GPDS Game Shop</div>
          </div>
        </div>
      </div>

    </div>
  );
};
