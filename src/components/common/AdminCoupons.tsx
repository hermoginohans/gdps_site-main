import { useEffect, useState } from 'react';
import { apiRequest } from '../../context/AuthContext';
type Coupon = { id: number; name: string; code: string; disc_type: string; nominal: number; minimum_spend: number; maximum: number; used: number; start_date: string; end_date: string; is_active: boolean | number; product_type: string };
const blank = { name: '', code: '', disc_type: 'percentage', nominal: 10, minimum_spend: 0, maximum: 100, start_date: '', end_date: '', is_active: true };
export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState(blank);
  const [id, setId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const reload = async () => setCoupons((await apiRequest('/api/admin/coupons')).coupons);
  useEffect(() => { reload().catch(() => setMessage('Unable to load coupons.')); }, []);
  return <section className="admin-panel space-y-5"><h2>Coupons</h2><p>New coupons apply to all games. Dates use server time (UTC). Fixed discounts and minimum spend are in PHP. Demo checkout does not consume uses.</p>
    <form className="grid sm:grid-cols-2 gap-4" onSubmit={async event => {
      event.preventDefault(); setBusy(true); setMessage('');
      try { await apiRequest(id ? `/api/admin/coupons/${id}` : '/api/admin/coupons', { method: id ? 'PUT' : 'POST', body: JSON.stringify(form) }); await reload(); setForm(blank); setId(null); setMessage('Coupon saved.'); }
      catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save coupon.'); }
      finally { setBusy(false); }
    }}>
      {(['name', 'code', 'nominal', 'minimum_spend', 'maximum', 'start_date', 'end_date'] as const).map(key => <label key={key} className="text-sm">{{name:'Name',code:'Code (up to 10 characters)',nominal:'Discount value',minimum_spend:'Minimum spend (PHP)',maximum:'Total usage limit',start_date:'Starts (UTC)',end_date:'Expires (UTC)'}[key]}<input required className="admin-modal-input w-full" type={key.endsWith('_date') ? 'datetime-local' : ['nominal', 'minimum_spend', 'maximum'].includes(key) ? 'number' : 'text'} step={key === 'maximum' ? 1 : 'any'} min={key === 'minimum_spend' ? 0 : 1} maxLength={key === 'code' ? 10 : 255} value={form[key]} onChange={event => setForm(current => ({ ...current, [key]: ['nominal', 'minimum_spend', 'maximum'].includes(key) ? Number(event.target.value) : event.target.value }))} /></label>)}
      <label>Discount type<select className="admin-modal-input w-full" value={form.disc_type} onChange={event => setForm(current => ({ ...current, disc_type: event.target.value }))}><option value="percentage">Percentage</option><option value="nominal">Fixed PHP amount</option></select></label>
      <label><input type="checkbox" checked={form.is_active} onChange={event => setForm(current => ({ ...current, is_active: event.target.checked }))} /> Active</label>
      <div className="flex gap-3"><button disabled={busy} className="account-gold-button">{busy ? 'Saving…' : id ? 'Save changes' : 'Create coupon'}</button><button type="button" onClick={() => { setId(null); setForm(blank); }}>Clear</button></div>
    </form><p role="status">{message}</p>
    <div className="admin-table-scroll"><table><thead><tr>{['Code', 'Discount', 'Used / limit', 'Scope', 'Expires (UTC)', 'Active', 'Action'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{coupons.map(coupon => <tr key={coupon.id}><td>{coupon.code || '(no code)'}</td><td>{coupon.nominal}{coupon.disc_type === 'percentage' ? '%' : ' PHP'}</td><td>{coupon.used} / {coupon.maximum}</td><td>{coupon.product_type}</td><td>{coupon.end_date}</td><td>{coupon.is_active ? 'Yes' : 'No'}</td><td><button onClick={() => { setId(coupon.id); setForm({ name: coupon.name, code: coupon.code || '', disc_type: coupon.disc_type, nominal: coupon.nominal, minimum_spend: coupon.minimum_spend, maximum: coupon.maximum, start_date: coupon.start_date.replace(' ', 'T').slice(0,16), end_date: coupon.end_date.replace(' ', 'T').slice(0,16), is_active: !!coupon.is_active }); }}>Edit</button></td></tr>)}</tbody></table></div>
  </section>;
}
