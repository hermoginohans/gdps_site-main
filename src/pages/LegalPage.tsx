import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, Cookie } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const LegalPage: React.FC<{ initialTab?: 'terms' | 'privacy' | 'cookies' }> = ({ initialTab = 'terms' }) => {
  const { currentPath } = useRouter();

  const getInitialTab = (): 'terms' | 'privacy' | 'cookies' => {
    if (currentPath.includes('privacy')) return 'privacy';
    if (currentPath.includes('cookies')) return 'cookies';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'cookies'>(getInitialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
          <ShieldCheck className="w-3.5 h-3.5" /> Trust & Compliance
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
          Policies & Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Last updated: September 2026 • GPDS GAME SHOP
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 border-b border-brand-cardBorder pb-4">
        {[
          { id: 'terms', label: 'Terms & Conditions', icon: FileText },
          { id: 'privacy', label: 'Privacy Policy', icon: Lock },
          { id: 'cookies', label: 'Cookies Policy', icon: Cookie },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                  : 'bg-brand-card hover:bg-brand-cardLight text-gray-400 hover:text-white border border-brand-cardBorder'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Container */}
      <div className="p-6 sm:p-10 rounded-3xl bg-brand-card border border-brand-cardBorder text-gray-300 text-xs sm:text-sm leading-relaxed space-y-6">
        
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white">1. General Terms</h2>
            <p>
              By accessing and placing orders at GPDS Game Shop (gpdsgameshop.com), you agree to be bound by these terms. We provide digital game top-ups, game cards, digital currency reloads, and account escrow facilitation.
            </p>

            <h2 className="text-xl font-display font-bold text-white pt-2">2. Order Fulfillment & User ID Accuracy</h2>
            <p>
              Orders are credited directly to the User ID, Zone ID, Server ID, or Riot ID supplied by the customer. Customers are strictly responsible for verifying their account identification before confirming checkout. Due to the irreversible nature of digital currency injection, GPDS cannot recall currency delivered to an incorrectly provided User ID.
            </p>

            <h2 className="text-xl font-display font-bold text-white pt-2">3. 10x Money-Back Guarantee & Refunds</h2>
            <p>
              If an order fails to be delivered due to an internal gateway outage or system malfunction verified by GPDS support, you are entitled to a 100% full refund to your original payment method or credit wallet, plus commercial guarantee compensation.
            </p>

            <h2 className="text-xl font-display font-bold text-white pt-2">4. Non-Affiliation Disclaimer</h2>
            <p>
              GPDS Game Shop is an independent third-party distributor and reseller of digital entertainment products. Mobile Legends: Bang Bang, Honor of Kings, Valorant, Riot Games, Tencent, and Moonton are registered trademarks of their respective copyright holders.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white">1. Data We Collect</h2>
            <p>
              GPDS Game Shop collects minimal customer information necessary solely to deliver digital game top-ups: your Game User ID / Zone ID, email address for transaction receipts, and phone number for SMS notifications or customer support.
            </p>

            <h2 className="text-xl font-display font-bold text-white pt-2">2. Password Safety</h2>
            <p>
              We NEVER request, store, or transmit your game account passwords, OTPs (one-time pins), or social media credentials. Direct top-ups work entirely through public server user identification.
            </p>

            <h2 className="text-xl font-display font-bold text-white pt-2">3. Payment Information</h2>
            <p>
              All payment transactions are encrypted with 256-bit TLS security and handled by PCI-DSS certified payment processors (GCash, Maya, QRPH InstaPay, Visa/Mastercard gateways). GPDS does not store credit card numbers or wallet PINs.
            </p>
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white">1. Use of Cookies</h2>
            <p>
              GPDS Game Shop uses essential local storage cookies to remember your preferred currency selection (PHP, USD), active shopping cart items, and saved gamer accounts for 1-click autofill convenience.
            </p>

            <h2 className="text-xl font-display font-bold text-white pt-2">2. Managing Preferences</h2>
            <p>
              You can clear your browser storage or disable cookies at any time in your browser settings. Essential cookies are required to preserve your cart during checkout.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
