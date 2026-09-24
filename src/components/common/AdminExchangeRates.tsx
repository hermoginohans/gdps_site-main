import { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencyCode } from '../../types';

export function AdminExchangeRates() {
  const { rates, rateDate, checkedAt, refreshing, rateError, refreshRates } = useCurrency();
  const [amount, setAmount] = useState('1000');
  const [from, setFrom] = useState<CurrencyCode>('PHP');
  const [to, setTo] = useState<CurrencyCode>('USD');
  const numericAmount = Number(amount);
  const valid = amount.trim() !== '' && Number.isFinite(numericAmount) && numericAmount >= 0;
  const format = (value: number, currency: CurrencyCode) => new Intl.NumberFormat('en-PH', { style: 'currency', currency }).format(value);
  const currencies = Object.values(rates);
  return <div className="space-y-5">
    <section className="admin-panel">
      <div className="admin-panel-heading"><div><h2>Storefront exchange rates</h2><p>Base currency: Philippine peso (PHP).</p></div><span className="admin-preview-badge">{rateDate ? (rateError ? 'Last loaded rate' : 'Daily reference rates') : 'Configured fallback'}</span></div>
      <p className="mt-4">Automatically fetched from <a className="admin-text-link" href="https://frankfurter.dev/" target="_blank" rel="noopener noreferrer">Frankfurter</a> on page load and checked every hour. These daily reference rates are used for storefront price display, not payment-provider settlement.</p>
      <div className="admin-table-scroll mt-5"><table><thead><tr><th>Currency</th><th>Code</th><th>For 1 PHP</th><th>Equivalent in PHP</th><th>Source</th><th>Rate date</th></tr></thead><tbody>{currencies.map(rate => <tr key={rate.code}><td>{rate.name}</td><td>{rate.code}</td><td>{rate.rateToPhp.toLocaleString('en-PH', { maximumFractionDigits: 6 })} {rate.code}</td><td>{(1 / rate.rateToPhp).toLocaleString('en-PH', { maximumFractionDigits: 6 })} PHP per {rate.code}</td><td>{rate.code === 'PHP' ? 'Base currency' : rateDate ? 'Frankfurter' : 'Configured fallback'}</td><td>{rate.code === 'PHP' ? 'Base currency' : rate.date || 'Fallback snapshot'}</td></tr>)}</tbody></table></div>
      <div className="mt-4 flex flex-wrap gap-4 items-center"><p>Rate date: {rateDate || 'Not loaded'} · Last successful check: {checkedAt ? new Date(checkedAt).toLocaleString() : 'Not yet'}</p><button type="button" className="admin-text-link" disabled={refreshing} onClick={() => void refreshRates()}>{refreshing ? 'Refreshing…' : 'Refresh rates'}</button></div>
      {rateError && <p className="mt-3 text-amber-300" role="status">{rateError}</p>}
    </section>
    <section className="admin-panel"><h2>Conversion preview</h2><p>Check how the currently displayed rates convert an amount.</p><div className="grid sm:grid-cols-3 gap-4 mt-5">
      <label className="text-sm">Amount<input className="admin-modal-input" type="number" min="0" step="any" value={amount} onChange={event => setAmount(event.target.value)} /></label>
      <label className="text-sm">From<select className="admin-modal-input" value={from} onChange={event => setFrom(event.target.value as CurrencyCode)}>{currencies.map(rate => <option key={rate.code}>{rate.code}</option>)}</select></label>
      <label className="text-sm">To<select className="admin-modal-input" value={to} onChange={event => setTo(event.target.value as CurrencyCode)}>{currencies.map(rate => <option key={rate.code}>{rate.code}</option>)}</select></label>
    </div><p className="mt-5" role="status">{valid ? `${format(numericAmount, from)} = ${format(numericAmount / rates[from].rateToPhp * rates[to].rateToPhp, to)}` : 'Enter a valid, non-negative amount.'}</p></section>
  </div>;
}
