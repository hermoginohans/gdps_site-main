import { useAccountData } from '../../context/AccountData';
import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Link } from '../../context/RouterContext';

export function DashboardWallet({ history = false }: { history?: boolean }) {
  const { data, error } = useAccountData();
  const [payment, setPayment] = useState('');
  const [amount, setAmount] = useState('');
  return <div className="space-y-5">
    <h2 className="text-2xl font-display font-bold text-brand-gold">{history ? 'Balance History' : 'GPDS Balance Top-Up'}</h2>
    <section className="dashboard-wallet-card">
      <h3>GPDS account</h3>
      <p className="text-sm text-gray-400 mt-6">Current balance amount</p>
      <p className="text-3xl font-bold text-white mt-3">{data ? `₱${(data.balanceCentavos / 100).toFixed(2)}` : '…'}</p>
      <p className="text-xs text-gray-400 mt-3">{error || 'Loyalty points are separate from your cash balance.'}</p>
    </section>
    {history ? <section className="dashboard-wallet-card"><Wallet className="text-brand-gold mb-4" /><h3>Balance history is not available yet</h3><p className="text-sm text-gray-400 mt-4">Deposits and wallet purchases will appear here when wallet payments are available.</p></section> :
      <section className="dashboard-wallet-card">
        <h3>Top-up via online payment</h3>
        <div className="mt-6 space-y-5">
          <label className="block text-sm text-gray-300">Select payment
            <select value={payment} onChange={event => setPayment(event.target.value)} className="dashboard-wallet-input mt-2"><option value="">Select a payment method</option>{['GCash', 'Maya', 'QRPH InstaPay', 'GrabPay', 'Visa / Mastercard', 'PayPal', 'USDT'].map(method => <option key={method}>{method}</option>)}</select>
          </label>
          <label className="block text-sm text-gray-300" htmlFor="wallet-amount">Top-up amount (PHP)</label>
          <div className="flex flex-col sm:flex-row gap-3"><input id="wallet-amount" type="number" min="100" step="0.01" placeholder="100.00" value={amount} onChange={event => setAmount(event.target.value)} className="dashboard-wallet-input" aria-describedby="wallet-minimum wallet-unavailable" /><button type="button" disabled className="px-7 py-3 rounded-xl bg-brand-gold text-brand-dark font-bold opacity-50 cursor-not-allowed whitespace-nowrap">Top Up</button></div>
          <p id="wallet-minimum" className="text-xs text-gray-400">Top-up amount minimum: ₱100</p>
          <p id="wallet-unavailable" className="text-sm text-gray-400">Balance top-ups are not available yet. No payment will be collected.</p>
          <Link to="/contact" className="inline-block text-brand-gold text-sm hover:underline">Contact support</Link>
        </div>
      </section>}
  </div>;
}
