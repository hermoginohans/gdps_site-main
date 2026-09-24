import { useAccountData } from '../../context/AccountData';
import { useState } from 'react';
import { Award, History, Inbox, Mail, User } from 'lucide-react';
import { UserProfile } from '../../types';
import './DashboardOverview.css';

interface Props {
  user: UserProfile;
  onTopUp: () => void;
  onBalanceHistory: () => void;
}

export function DashboardOverview({ user, onTopUp, onBalanceHistory }: Props) {
  const { data, error } = useAccountData();
  const [tab, setTab] = useState<'overview' | 'inbox'>('overview');
  return <section className="account-overview" aria-label="My account">
    <div className="account-overview-tabs" role="tablist" aria-label="Account views">
      <button id="account-overview-tab" type="button" role="tab" aria-selected={tab === 'overview'} aria-controls="account-overview-panel" onClick={() => setTab('overview')}>Overview</button>
      <button id="account-inbox-tab" type="button" role="tab" aria-selected={tab === 'inbox'} aria-controls="account-inbox-panel" onClick={() => setTab('inbox')}><Inbox size={15} aria-hidden="true" />Inbox</button>
    </div>
    {tab === 'overview' ? <div id="account-overview-panel" role="tabpanel" aria-labelledby="account-overview-tab" className="account-overview-grid">
      <div className="account-overview-stack">
        <section className="account-overview-card account-welcome">
          <div className="account-welcome-heading"><span className="account-avatar"><User size={27} aria-hidden="true" /></span><div><h2>Hi, {user.name}</h2><p>Welcome back!</p></div><span className="account-status">{user.vipTier || 'Customer'}</span></div>
          <div className="account-contact"><Mail size={14} aria-hidden="true" /><span>{user.email}</span></div>
        </section>
        <section className="account-overview-card">
          <h3 className="account-card-heading">Your GPDS Balance</h3>
          <div className="account-balance-row"><div><strong className="account-unavailable">{data ? `₱${(data.balanceCentavos / 100).toFixed(2)}` : '…'}</strong><p>{error || 'Available wallet balance'}</p></div><button type="button" className="account-history" onClick={onBalanceHistory} aria-label="View balance history"><History size={21} /></button><button type="button" className="account-gold-button" onClick={onTopUp}>Top Up</button></div>
        </section>
        <section className="account-overview-card account-points">
          <div className="account-points-heading"><span className="account-points-icon"><Award size={21} aria-hidden="true" /></span><div><h3>GPDS Points</h3><p>Your loyalty rewards</p></div><span className="account-status">Loyalty</span></div>
          <div className="account-points-total"><strong>{user.loyaltyPoints.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong><p>Available GPDS Points</p></div>
          <div className="account-recent"><h4>Recent activity</h4><p>Points activity is not available yet.</p></div>
        </section>
        <section className="account-overview-card">
          <h3 className="account-card-heading">Transaction Overview</h3>
          <div className="account-transaction-stats">{['Process', 'Expired', 'Success', 'Refunded'].map(status => <div key={status}><strong>{data ? data.orders.filter(order => order.status === ({Process: 'pending', Expired: 'expired', Success: 'completed', Refunded: 'refunded'}[status])).length : '…'}</strong><span>{status}</span></div>)}</div>
          <p className="account-data-note">Based on your latest 100 orders.</p>
        </section>
      </div>
      <section className="account-overview-card account-transaction-history"><h3 className="account-card-heading">The Last 10 Transactions History</h3><div className="account-history-empty"><History size={30} aria-hidden="true" /><h4>{data ? (data.orders.length ? 'Recent orders' : 'No orders yet') : 'Loading…'}</h4>{data?.orders.slice(0, 10).map(order => <p key={order.id}>{order.number} · {order.status} · ₱{(order.amount_centavos / 100).toFixed(2)}</p>)}</div></section>
    </div> : <section id="account-inbox-panel" role="tabpanel" aria-labelledby="account-inbox-tab" className="account-overview-card account-inbox"><Inbox size={34} aria-hidden="true" /><h2>Your inbox</h2><p>Account messages are not available yet.</p></section>}
  </section>;
}
