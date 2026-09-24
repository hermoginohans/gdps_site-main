import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Headphones, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Percent, 
  Calculator,
  MessageCircle,
  Award,
  Zap,
  DollarSign
} from 'lucide-react';
import { PARTNERSHIP_TIERS } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';
import { useRouter } from '../context/RouterContext';

type TabKey = 'affiliate' | 'streamer' | 'reseller' | 'website';

export const PartnershipPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { currentPath } = useRouter();
  const requestedTab = new URLSearchParams(currentPath.split('?')[1] || '').get('tab');
  const initialTab: TabKey = requestedTab === 'streamer' || requestedTab === 'reseller' || requestedTab === 'website' ? requestedTab : 'affiliate';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  useEffect(() => setActiveTab(initialTab), [initialTab]);

  // Reseller profit margin calculator state
  const [monthlySalesInput, setMonthlySalesInput] = useState(75000);
  const estimatedProfit = Math.round(monthlySalesInput * 0.08); // approx 8% average margin

  // Website inquiry modal state
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#1F1538] via-[#141026] to-[#1F1538] border border-brand-gold/40 relative overflow-hidden text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
          <Award className="w-3.5 h-3.5" /> Official GPDS Business Network
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white">
          Partner & Grow with <span className="text-gradient-gold">GPDS Game Shop</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Join thousands of streamers, affiliates, and digital shop owners earning consistent revenue backed by our direct-to-server top-up infrastructure.
        </p>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('affiliate')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'affiliate'
                ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                : 'bg-brand-card hover:bg-brand-cardLight text-gray-400 hover:text-white border border-brand-cardBorder'
            }`}
          >
            <Percent className="w-4 h-4" /> Affiliate (2%)
          </button>

          <button
            onClick={() => setActiveTab('streamer')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'streamer'
                ? 'bg-brand-cyan text-brand-dark shadow-cyan-glow'
                : 'bg-brand-card hover:bg-brand-cardLight text-gray-400 hover:text-white border border-brand-cardBorder'
            }`}
          >
            <Headphones className="w-4 h-4" /> Streamer Program
          </button>

          <button
            onClick={() => setActiveTab('reseller')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'reseller'
                ? 'bg-brand-purple text-white shadow-purple-glow'
                : 'bg-brand-card hover:bg-brand-cardLight text-gray-400 hover:text-white border border-brand-cardBorder'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Become a Reseller
          </button>

          <button
            onClick={() => setActiveTab('website')}
            className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'website'
                ? 'bg-green-500 text-brand-dark shadow-md'
                : 'bg-brand-card hover:bg-brand-cardLight text-gray-400 hover:text-white border border-brand-cardBorder'
            }`}
          >
            <Globe className="w-4 h-4" /> Create Your Website (₱50K)
          </button>
        </div>
      </div>

      {/* TAB 1: AFFILIATE PROGRAM */}
      {activeTab === 'affiliate' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
                Earn 2% Lifetime Commission on Every Order
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Share your personalized GPDS affiliate link with your squad, Facebook groups, or Discord servers. Whenever anyone completes an order, you receive 2% automated commission directly to your wallet.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Zero upfront fees, zero inventory risk',
                  'Automated payout every 15th & 30th of the month via GCash or Maya',
                  'Real-time conversion tracking dashboard',
                  'Support for all games: MLBB, HoK, Valorant, Steam, Roblox'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="https://www.facebook.com/GPDSgameShopPH"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-brand-gold text-brand-dark font-display font-black text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center gap-2"
                >
                  Apply via Facebook <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-4">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold" /> Estimated Earnings Example
              </h3>
              <div className="p-4 rounded-2xl bg-[#0E0A1C] border border-brand-cardBorder space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>If 50 friends buy 1,000 MLBB Diamonds:</span>
                  <span className="text-white font-bold">₱45,750 sales</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Affiliate Commission Rate:</span>
                  <span className="text-brand-gold font-bold">2.0%</span>
                </div>
                <div className="pt-2 border-t border-brand-cardBorder flex justify-between font-bold text-sm text-white">
                  <span>Your Passive Earnings:</span>
                  <span className="text-brand-gold font-black">{formatPrice(915)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STREAMER PROGRAM */}
      {activeTab === 'streamer' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-brand-cyan font-bold text-xs uppercase tracking-wider">
                <Headphones className="w-4 h-4" /> For Content Creators & Casters
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
                Streamer Code + Monthly Milestone Bonuses
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Provide your viewers with an exclusive discount code (1% OFF) while you earn 2% commission on all transactions, plus monthly cash milestone bonuses up to ₱50,000 for top performing streams!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-brand-card border border-brand-cardBorder text-center">
                  <div className="text-lg font-display font-black text-brand-cyan">₱5,000</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Tier 1 Bonus (₱250k vol)</div>
                </div>
                <div className="p-4 rounded-2xl bg-brand-card border border-brand-cardBorder text-center">
                  <div className="text-lg font-display font-black text-brand-cyan">₱15,000</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Tier 2 Bonus (₱500k vol)</div>
                </div>
                <div className="p-4 rounded-2xl bg-brand-card border border-brand-cardBorder text-center">
                  <div className="text-lg font-display font-black text-brand-cyan">₱50,000</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">VIP Legend Bonus (₱1M+ vol)</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-4">
              <h3 className="font-display font-bold text-base text-white">Streamer Perks</h3>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  <span>Custom Vanity Code (e.g. YOURNAME)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  <span>Live Stream Overlays & Twitch/FB Banners provided</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  <span>Monthly Diamond Giveaways sponsored by GPDS</span>
                </li>
              </ul>
              <a
                href="https://wa.me/639774541147?text=Hi%20GPDS!%20I%20am%20a%20streamer%20interested%20in%20the%20Streamer%20Partnership"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-brand-cyan text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all"
              >
                Inquire on WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RESELLER PROGRAM */}
      {activeTab === 'reseller' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
              Reseller Wholesale Tiers
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Access the lowest diamond and token pricing in the Philippines with tiered wholesale rates.
            </p>
          </div>

          {/* Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTNERSHIP_TIERS.map(tier => (
              <div
                key={tier.tier}
                className="rounded-3xl bg-brand-card border border-brand-cardBorder p-6 space-y-4 relative group hover:border-brand-purple/60 transition-all"
              >
                <div className={`text-xs font-black uppercase px-3 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white inline-block shadow-sm`}>
                  {tier.tier}
                </div>
                <div>
                  <div className="text-2xl font-display font-black text-white">{tier.discountMargin}</div>
                  <div className="text-xs text-gray-400 mt-1">Monthly Top-Up: {tier.monthlyVolume}</div>
                </div>

                <div className="pt-4 border-t border-brand-cardBorder space-y-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-purple" />
                    <span>{tier.support}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-purple" />
                    <span>{tier.apiAccess}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Profit Margin Calculator */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141026] border border-brand-purple/40 max-w-2xl mx-auto space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-purple" /> Interactive Reseller Profit Calculator
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex justify-between">
                <span>Estimated Monthly Top-Up Volume:</span>
                <span className="font-bold text-brand-purple">{formatPrice(monthlySalesInput)}</span>
              </label>
              <input
                type="range"
                min={20000}
                max={300000}
                step={5000}
                value={monthlySalesInput}
                onChange={e => setMonthlySalesInput(Number(e.target.value))}
                className="w-full accent-brand-purple cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-brand-card border border-brand-cardBorder flex items-center justify-between">
              <span className="text-xs text-gray-400">Estimated Monthly Profit (@ 8% avg):</span>
              <span className="text-xl font-display font-black text-brand-purple">
                {formatPrice(estimatedProfit)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CREATE YOUR OWN WEBSITE (₱50,000 PACKAGE) */}
      {activeTab === 'website' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/30">
                <Globe className="w-3.5 h-3.5" /> Turnkey Business Opportunity
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-black text-white">
                Launch Your Own Game Top-Up Shop for ₱50,000
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Get a fully branded gaming shop just like GPDS. Includes custom domain, VIP reseller rates, administrator dashboard, automated payment gateway integration, and managed hosting.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-gray-300">
                {[
                  'Your Brand Name & Custom .com Domain',
                  'Admin Management Dashboard',
                  'VIP Reseller Wholesale Pricing Connected',
                  'GCash, Maya, & QRPH Payment Gateways',
                  'Direct Server Top-Up APIs (1-5 min)',
                  'Basic Search Engine Optimization (SEO)',
                  'Complete Setup, Hosting & Security SSL'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-card border border-brand-cardBorder">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-brand-card border border-green-500/40 space-y-5 shadow-2xl">
              <div className="text-center pb-3 border-b border-brand-cardBorder">
                <span className="text-xs font-bold text-gray-400 uppercase">Package Investment</span>
                <div className="text-3xl font-display font-black text-green-400 mt-1">₱50,000</div>
                <span className="text-xs text-gray-400">One-time turnkey deployment</span>
              </div>

              {inquirySent ? (
                <div className="p-6 text-center space-y-3 bg-green-500/10 rounded-2xl border border-green-500/30">
                  <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
                  <h4 className="font-bold text-white text-base">Inquiry Received!</h4>
                  <p className="text-xs text-gray-300">
                    Our partnership team will message you within 24 hours to schedule your demo consultation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-300 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Juan dela Cruz"
                      value={inquiryName}
                      onChange={e => setInquiryName(e.target.value)}
                      className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-green-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-300 block mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 09171234567"
                      value={inquiryPhone}
                      onChange={e => setInquiryPhone(e.target.value)}
                      className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-green-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-green-500 hover:bg-green-400 text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-2"
                  >
                    Request Demo & Consultation
                  </button>
                </form>
              )}

              <div className="text-[11px] text-gray-400 text-center">
                Want to speak immediately? Call WhatsApp: <a href="https://wa.me/639774541147" className="text-green-400 font-bold underline">+63 977 454 1147</a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
