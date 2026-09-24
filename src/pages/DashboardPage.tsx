import { DemoOrders } from '../components/common/DemoOrders';
import { AccountRecords } from '../components/common/AccountRecords';
import React, { useState } from 'react';
import { User, Clock, Gift, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useRouter } from '../context/RouterContext';
import { Wallet, History, Video, Users, Gavel } from 'lucide-react';
import { DashboardOverview } from '../components/common/DashboardOverview';
import { DashboardGiftCards } from '../components/common/DashboardGiftCards';
import { DashboardAuction } from '../components/common/DashboardAuction';
import { DashboardPartnerRegistration } from '../components/common/DashboardPartnerRegistration';
import { DashboardWallet } from '../components/common/DashboardWallet';
import './DashboardPage.css';
import { SAMPLE_ORDERS } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { formatPrice } = useCurrency();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings' | 'balance-history' | 'balance-topup' | 'gift-cards' | 'affiliate' | 'streamer' | 'auction'>('profile');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <User className="w-12 h-12 text-brand-gold mx-auto" />
        <h2 className="text-2xl font-display font-black text-white">Please Sign In</h2>
        <p className="text-xs text-gray-400">Log in to manage your account and view past orders.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-brand-gold text-brand-dark font-extrabold text-xs uppercase rounded-xl shadow-gold-glow"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Overview Header Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#21163B] via-[#141026] to-[#21163B] border border-brand-gold/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-gold shadow-gold-glow"
            />
            <div className="absolute -bottom-1 -right-1 bg-brand-gold text-brand-dark font-black text-[10px] px-2 py-0.5 rounded-full border border-brand-dark shadow">
              VIP
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white">{user.name}</h1>
              <span className="text-[10px] font-extrabold text-brand-gold bg-brand-gold/15 px-2.5 py-0.5 rounded-full border border-brand-gold/30 uppercase">
                {user.vipTier}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-4 text-xs text-gray-300 mt-2">
              <span>Loyalty Balance: <strong className="text-brand-gold font-bold">{user.loyaltyPoints.toLocaleString()} GPDS pts</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">{user.isAdmin && <button onClick={() => navigate('/admin')} className="account-gold-button">Admin</button>}
          <button
            onClick={() => navigate('/games')}
            className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider shadow-gold-glow"
          >
            Quick Top-Up
          </button>
          <button
            onClick={() => logout()}
            className="px-4 py-3 rounded-xl bg-brand-card hover:bg-red-500/10 border border-brand-cardBorder hover:border-red-500/40 text-red-400 text-xs font-bold uppercase transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
      <nav className="dashboard-navigation" aria-label="Account navigation">
        {([
          { id: 'profile', label: 'My Account', icon: User },
          { id: 'settings', label: 'Security', icon: ShieldCheck },
          { id: 'orders', label: 'Order History', icon: Clock },
          { id: 'balance-history', label: 'Balance History', icon: History },
          { id: 'balance-topup', label: 'Balance Top Up', icon: Wallet },
          { id: 'gift-cards', label: 'Gift Cards', icon: Gift },
          { id: 'affiliate', label: 'Affiliate', icon: Users },
          { id: 'streamer', label: 'Streamer', icon: Video },
          { id: 'auction', label: 'Auction', icon: Gavel },
        ] as const).map(tab => <button type="button" key={tab.id} aria-current={activeTab === tab.id ? 'page' : undefined} onClick={() => { setActiveTab(tab.id); }}><tab.icon aria-hidden="true" />{tab.label}</button>)}
      </nav>
      <div className="min-w-0">{activeTab === 'orders' && <DemoOrders />}
      {activeTab === 'auction' && <DashboardAuction />}
      {activeTab === 'gift-cards' && <DashboardGiftCards />}
      {(activeTab === 'affiliate' || activeTab === 'streamer') && <DashboardPartnerRegistration program={activeTab} />}
      {activeTab === 'balance-topup' && <DashboardWallet />}
      {activeTab === 'balance-history' && <AccountRecords wallet />}
      {activeTab === 'profile' && <DashboardOverview user={user} onTopUp={() => setActiveTab('balance-topup')} onBalanceHistory={() => setActiveTab('balance-history')} />}
      {activeTab === 'orders' && <AccountRecords />}
      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <section className="dashboard-wallet-card space-y-5">
          <h2 className="text-xl font-display font-bold text-white">Security</h2>
          <p className="text-sm text-gray-300">Signed in as <strong className="break-all">{user.email}</strong></p>
          <p className="text-sm text-gray-400">Password changes and two-factor authentication are not available in the dashboard yet. Contact support for help with your account.</p>
          <button type="button" onClick={() => navigate('/contact')} className="px-5 py-3 bg-brand-gold text-brand-dark font-bold rounded-xl">Contact support</button>
        </section>
      )}
      </div>
      </div>


    </div>
  );
};
