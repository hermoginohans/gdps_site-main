import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Smile, 
  MessageCircle, 
  Clock, 
  ArrowUpRight, 
  CreditCard
} from 'lucide-react';
import { Link } from '../../context/RouterContext';
import { assetUrl } from '../../utils/assets';

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const partnerPrograms = [
  { mark: 'MC', name: 'MC3rd', detail: 'Esports Cafe', url: 'https://www.facebook.com/MC3DEsportsCafe' },
  { mark: 'KD', name: 'KDM Esports Cafe', detail: 'Esports Cafe', url: 'https://www.facebook.com/kadilimanesports/' },
  { mark: '11', name: 'OneOne', detail: 'Gaming Platform', url: 'https://games.oneone.com/' }
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0914] border-t border-brand-cardBorder relative text-gray-400 text-sm overflow-hidden pt-16 pb-24 md:pb-12">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-brand-cardBorder">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-brand-card/50 border border-brand-cardBorder">
            <div className="w-11 h-11 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold shrink-0 border border-brand-gold/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Instant Delivery</div>
              <div className="text-xs text-gray-400">1 to 5 minutes automated</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-brand-card/50 border border-brand-cardBorder">
            <div className="w-11 h-11 rounded-xl bg-brand-green/15 flex items-center justify-center text-brand-green shrink-0 border border-brand-green/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">100% Secure Checkout</div>
              <div className="text-xs text-gray-400">No game password needed</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-brand-card/50 border border-brand-cardBorder">
            <div className="w-11 h-11 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-purple shrink-0 border border-brand-purple/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Dedicated Support</div>
              <div className="text-xs text-gray-400">6:00 AM – 4:00 AM PHT</div>
            </div>
          </div>
        </div>

        {/* Main Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="inline-block group" aria-label="GPDS GAME SHOP Home">
              <img 
                src={assetUrl("/gpds_logo.png")} 
                alt="GPDS GAME SHOP" 
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(240,192,48,0.2)]" 
              />
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              GPDS Game Shop is the premier digital top-up destination in the Philippines. Founded in 2018 by Angelo "bhadzki" Leoncio.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.facebook.com/GPDSgameShopPH" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-brand-card border border-brand-cardBorder flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-gold transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a 
                href="https://wa.me/639774541147" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-brand-card border border-brand-cardBorder flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-400 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: GPDS Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-brand-cardBorder pb-2">
              GPDS
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-brand-gold transition-colors">Blog & Patch Notes</Link></li>
              <li><Link to="/faqs" className="hover:text-brand-gold transition-colors">Help Center & FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact Support</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies-policy" className="hover:text-brand-gold transition-colors">Cookies Policy</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-brand-cardBorder pb-2">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/games" className="hover:text-brand-gold transition-colors">All Game Top-Ups</Link></li>
              <li><Link to="/games/mobile-legends" className="hover:text-brand-gold transition-colors">Mobile Legends PH</Link></li>
              <li><Link to="/games/honor-of-kings" className="hover:text-brand-gold transition-colors">Honor of Kings</Link></li>
              <li><Link to="/auction" className="hover:text-brand-gold transition-colors">Account Auctions</Link></li>
              <li><Link to="/payment" className="hover:text-brand-gold transition-colors">Track Your Order</Link></li>
              <li><Link to="/vouchers" className="hover:text-brand-gold transition-colors">Promo Vouchers</Link></li>
              <li><Link to="/shop" className="hover:text-brand-gold transition-colors">Merchandise & Gear</Link></li>
            </ul>
          </div>

          {/* Col 4: Partnership */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-brand-cardBorder pb-2">
              Partnership
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/partnership" className="hover:text-brand-gold transition-colors">Become a Reseller</Link></li>
              <li><Link to="/partnership" className="hover:text-brand-gold transition-colors">Affiliate Program (2%)</Link></li>
              <li><Link to="/partnership" className="hover:text-brand-gold transition-colors">Streamer Program</Link></li>
              <li><Link to="/partnership" className="hover:text-brand-gold transition-colors">Create Your Own Website</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 5: Support Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-brand-cardBorder pb-2">
              Help & Support
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <span className="block text-gray-500 font-semibold uppercase text-[10px]">WhatsApp Live Chat</span>
                <a href="https://wa.me/639774541147" target="_blank" rel="noreferrer" className="text-brand-gold hover:underline flex items-center gap-1 font-semibold">
                  +63 977 454 1147 <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div>
                <span className="block text-gray-500 font-semibold uppercase text-[10px]">Facebook Messenger</span>
                <a href="https://www.facebook.com/GPDSgameShopPH" target="_blank" rel="noreferrer" className="text-brand-gold hover:underline flex items-center gap-1 font-semibold">
                  @GPDSgameShopPH <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div>
                <span className="block text-gray-500 font-semibold uppercase text-[10px]">Operating Hours</span>
                <span className="text-white font-medium">6:00 AM – 4:00 AM PHT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Network */}
        <div className="border-y border-brand-cardBorder py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-gold">Partner network</div>
              <h3 className="mt-1 font-display text-xl font-black text-white">Built for the gaming community</h3>
            </div>
            <Link to="/partnership" className="text-xs font-bold text-brand-gold hover:text-brand-goldLight transition-colors">
              Explore partnership programs <ArrowUpRight className="inline-block ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {partnerPrograms.map((partner) => (
              <a
                key={partner.mark}
                href={partner.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl bg-brand-card/60 border border-brand-cardBorder px-3 py-3 hover:border-brand-gold/60 transition-colors"
              >
                <div className="h-10 w-10 shrink-0 rounded-lg border border-brand-gold/30 bg-brand-gold/10 flex items-center justify-center font-display font-black text-xs text-brand-gold">
                  {partner.mark}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-white">{partner.name}</div>
                  <div className="mt-0.5 text-[10px] text-gray-500">{partner.detail}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Accepted Payment Methods Strip */}
        <div className="py-6 border-t border-brand-cardBorder flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Supported Payment Methods:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {['GCash', 'Maya', 'GrabPay', 'QRPH', 'Visa', 'Mastercard', 'PayPal', 'USDT (TRC20)'].map(pm => (
              <span 
                key={pm}
                className="px-2.5 py-1 rounded-lg bg-brand-card border border-brand-cardBorder text-gray-300 font-semibold text-[11px]"
              >
                {pm}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-brand-cardBorder/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center md:text-left">
          <div>
            © 2018 - 2026 GPDS GAME SHOP. All rights reserved. Registered Digital Entertainment Services.
          </div>
          <div>
            Built with next-gen esports design standards.
          </div>
        </div>
      </div>
    </footer>
  );
};
