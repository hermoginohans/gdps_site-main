import { useEffect, useState } from 'react';
import { apiRequest } from '../../context/AuthContext';

const defaults = { name: '', slug: '', vendor: 'manual', category: 'E-Wallet', currency_code: 'PHP', account_number: '', description: '', admin_type: 'no-admin', admin_fee: 0, ordering: 0, is_active: false, requires_approval: true };
type Method = typeof defaults & { id: number };

export function AdminPaymentMethods() {
  const [methods, setMethods] = useState<Method[]>([]);
  const [form, setForm] = useState(defaults);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const reload = async () => {
    setLoading(true);
    try { setMethods((await apiRequest('/api/admin/payment-methods')).methods); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload().catch(() => setError('Unable to load payment methods.')); }, []);
  return <section className="admin-panel space-y-5">
    <div className="admin-panel-heading"><h2>Payment methods</h2><button disabled={busy} className="account-gold-button" onClick={() => { setEditingId(null); setForm(defaults); setOpen(true); setMessage(''); setError(''); }}>Add payment method</button></div>
    <p>Manage payment method records. Adding a method does not enable payment collection or change demo checkout.</p>
    {open && <form className="grid sm:grid-cols-2 gap-4" onSubmit={async event => {
      event.preventDefault(); setBusy(true); setError(''); setMessage('');
      try {
        await apiRequest('/sanctum/csrf-cookie');
        await apiRequest(editingId === null ? '/api/admin/payment-methods' : `/api/admin/payment-methods/${editingId}`, { method: editingId === null ? 'POST' : 'PUT', body: JSON.stringify(form) });
        setOpen(false); setForm(defaults); setMessage(editingId === null ? 'Payment method added.' : 'Payment method updated.'); setEditingId(null);
        await reload();
      } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to save payment method.'); }
      finally { setBusy(false); }
    }}>
      {(['name', 'slug', 'vendor', 'category', 'currency_code', 'account_number'] as const).map(field => <label className="text-sm" key={field}>
        {{ name: 'Name', slug: 'Slug (example: gcash-manual)', vendor: 'Provider (example: manual or xendit)', category: 'Category', currency_code: 'Currency code', account_number: 'Account number (optional)' }[field]}
        <input className="admin-modal-input w-full" required={field !== 'account_number'} maxLength={field === 'currency_code' ? 3 : field === 'vendor' ? 50 : field === 'category' ? 100 : 150} value={form[field]} onChange={event => setForm(current => ({ ...current, [field]: field === 'currency_code' ? event.target.value.toUpperCase() : event.target.value }))} />
      </label>)}
      <label>Fee type<select className="admin-modal-input w-full" value={form.admin_type} onChange={event => setForm(current => ({ ...current, admin_type: event.target.value, admin_fee: 0 }))}><option value="no-admin">No fee</option><option value="nominal">Fixed amount</option><option value="percentage">Percentage</option></select></label>
      <label>Fee<input className="admin-modal-input w-full" type="number" min="0" max={form.admin_type === 'percentage' ? 100 : 1000000} step="0.01" required disabled={form.admin_type === 'no-admin'} value={form.admin_fee} onChange={event => setForm(current => ({ ...current, admin_fee: Number(event.target.value) }))} /></label>
      <label>Display order<input className="admin-modal-input w-full" type="number" min="0" max="100000" required value={form.ordering} onChange={event => setForm(current => ({ ...current, ordering: Number(event.target.value) }))} /></label>
      <label className="sm:col-span-2">Description / instructions<textarea className="admin-modal-input w-full" maxLength={5000} value={form.description} onChange={event => setForm(current => ({ ...current, description: event.target.value }))} /></label>
      <label><input type="checkbox" checked={form.is_active} onChange={event => setForm(current => ({ ...current, is_active: event.target.checked }))} /> Active</label>
      <label><input type="checkbox" checked={form.requires_approval} onChange={event => setForm(current => ({ ...current, requires_approval: event.target.checked }))} /> Requires approval</label>
      <div className="flex gap-3"><button className="account-gold-button" disabled={busy}>{busy ? 'Saving…' : 'Save payment method'}</button><button type="button" disabled={busy} onClick={() => { setOpen(false); setForm(defaults); }}>Cancel</button></div>
    </form>}
    {error && <p role="alert">{error}</p>}<p role="status">{message}</p>
    {loading ? <p>Loading payment methods…</p> : <div className="admin-table-scroll"><table><thead><tr>{['Name', 'Slug', 'Provider', 'Currency', 'Fee', 'Status', 'Actions'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{methods.map(method => <tr key={method.id}><td>{method.name}</td><td>{method.slug}</td><td>{method.vendor}</td><td>{method.currency_code}</td><td>{method.admin_type === 'no-admin' ? 'None' : `${method.admin_fee} ${method.admin_type === 'percentage' ? '%' : method.currency_code}`}</td><td>{method.is_active ? 'Active' : 'Inactive'}</td><td><div className="flex gap-3">
<button disabled={busy} className="admin-text-link" onClick={() => {
  setEditingId(method.id); setForm({ name: method.name, slug: method.slug, vendor: method.vendor, category: method.category ?? '', currency_code: method.currency_code ?? 'PHP', account_number: method.account_number ?? '', description: method.description ?? '', admin_type: method.admin_type, admin_fee: Number(method.admin_fee), ordering: method.ordering ?? 0, is_active: !!method.is_active, requires_approval: !!method.requires_approval });
  setOpen(true); setError(''); setMessage(''); window.scrollTo({ top: 0, behavior: 'smooth' });
}}>Edit</button>
<button disabled={busy || open} className="admin-text-link" onClick={async () => {
  setBusy(true); setError(''); setMessage('');
  try { await apiRequest('/sanctum/csrf-cookie'); const result = await apiRequest(`/api/admin/payment-methods/${method.id}/status`, { method: 'PATCH', body: JSON.stringify({ is_active: !method.is_active }) }); setMessage(result.message); await reload(); }
  catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to change status.'); }
  finally { setBusy(false); }
}}>{method.is_active ? 'Deactivate' : 'Activate'}</button>
</div></td></tr>)}</tbody></table>{!methods.length && <p>No payment methods yet.</p>}</div>}
  </section>;
}
