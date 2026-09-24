import { useState } from 'react';

const denominations = [
  { value: 100, price: 100 }, { value: 200, price: 200 },
  { value: 500, price: 500 }, { value: 1000, price: 1000 },
  { value: 2000, price: 2007.22 }, { value: 3000, price: 3000 },
  { value: 5000, price: 5000 }, { value: 10000, price: 10000 },
];
const pesos = (value: number) => `₱${value.toLocaleString('en-PH', { maximumFractionDigits: 2 })}`;

export function DashboardGiftCards() {
  const [tab, setTab] = useState<'buy' | 'redeem'>('buy');
  const [selected, setSelected] = useState<number | null>(null);
  const [gift, setGift] = useState(false);
  const [payment, setPayment] = useState('');
  const [code, setCode] = useState('');

  return <section className="dashboard-gift-cards" aria-labelledby="gift-card-title">
    <h2 id="gift-card-title">GPDS Gift Card</h2>
    <div className="gift-card-tabs" aria-label="Gift card options">
      <button type="button" aria-pressed={tab === 'buy'} onClick={() => setTab('buy')}>Buy Gift Card</button>
      <button type="button" aria-pressed={tab === 'redeem'} onClick={() => setTab('redeem')}>Redeem a Code</button>
    </div>
    {tab === 'buy' ? <div className="space-y-6">
      <fieldset>
        <legend className="gift-card-heading">Select denomination</legend>
        <div className="gift-denominations">{denominations.map(item => <label key={item.value} className={`gift-denomination${selected === item.value ? ' is-selected' : ''}`}>
          <input type="radio" name="gift-denomination" value={item.value} checked={selected === item.value} onChange={() => setSelected(item.value)} />
          <span>{item.value} PHP</span><strong>{pesos(item.price)}</strong>
        </label>)}</div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm text-gray-200"><input type="checkbox" checked={gift} onChange={event => setGift(event.target.checked)} className="accent-yellow-400" />Send this as a gift to someone else</label>
      {gift && <div className="space-y-4">
        <label className="block text-sm text-gray-300">Recipient email<input type="email" autoComplete="off" placeholder="recipient@example.com" className="dashboard-wallet-input mt-2" /></label>
        <label className="block text-sm text-gray-300">Personal message (optional)<textarea rows={3} maxLength={500} className="dashboard-wallet-input mt-2" placeholder="Write a message for your recipient" /></label>
      </div>}
      <label className="block"><span className="sr-only">Select payment</span><select className="dashboard-wallet-input gift-payment-select" value={payment} onChange={event => setPayment(event.target.value)}><option value="">Select Payment</option>{['GCash', 'Maya', 'QRPH InstaPay', 'GrabPay', 'Visa / Mastercard', 'PayPal', 'USDT'].map(method => <option key={method}>{method}</option>)}</select></label>
      <button type="button" disabled className="gift-card-submit" aria-describedby="gift-purchase-status">Buy Gift Card</button>
      <p id="gift-purchase-status" className="text-xs text-gray-400 leading-relaxed">Gift card purchases are not available yet. No payment will be collected.</p>
    </div> : <div className="space-y-6">
      <h3 className="gift-card-heading">Redeem your gift card</h3>
      <p className="text-sm text-gray-400">Enter your GPDS gift card code below.</p>
      <label className="block text-sm text-gray-300">Gift card code<input type="text" value={code} onChange={event => setCode(event.target.value)} autoComplete="off" spellCheck={false} placeholder="Enter your code" className="dashboard-wallet-input mt-2" /></label>
      <button type="button" disabled className="gift-card-submit" aria-describedby="gift-redeem-status">Redeem Code</button>
      <p id="gift-redeem-status" className="text-xs text-gray-400">Gift card redemption is not available yet. Your code has not been submitted.</p>
    </div>}
  </section>;
}
