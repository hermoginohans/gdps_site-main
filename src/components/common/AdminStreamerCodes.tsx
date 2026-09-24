import { useEffect, useState } from 'react';
import { apiRequest } from '../../context/AuthContext';
const blank = { id: 0, code: '', streamer: '', type: 'percent', value: '5', minimum: '0', expires_at: '', active: true };
export function AdminStreamerCodes() {
  const [form, setForm] = useState(blank);
  const [codes, setCodes] = useState<typeof blank[]>([]);
  const [streamers, setStreamers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const load = async () => { const data = await apiRequest('/api/admin/streamer-codes'); setCodes(data.codes); setStreamers(data.streamers); };
  useEffect(() => { void load().catch(e => setMessage(e.message)); }, []);
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      await apiRequest('/sanctum/csrf-cookie');
      await apiRequest('/api/admin/streamer-codes' + (form.id ? '/' + form.id : ''), { method: form.id ? 'PUT' : 'POST', body: JSON.stringify({ ...form, value: Number(form.value), minimum: Number(form.minimum), expires_at: form.expires_at || null, active: Boolean(form.active) }) });
      await load(); setForm(blank); setMessage('Streamer code saved successfully.'); window.setTimeout(() => setMessage(''), 3500);
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not save.'); }
    finally { setBusy(false); }
  }
  return <section className="admin-panel space-y-4"><h2>Streamer codes</h2><p>Discounts apply to saved game packages. Streamer names identify codes; commission tracking is not connected.</p><form onSubmit={save} className="space-y-4"><div className="grid sm:grid-cols-2 gap-4">{(['code', 'value', 'minimum', 'expires_at'] as const).map(field => <label key={field}>{({code: 'Code', streamer: 'Streamer name', value: 'Discount value', minimum: 'Minimum spend (PHP)', expires_at: 'Expiry date (optional)'})[field]}<input className="dashboard-wallet-input mt-2" required={field !== 'expires_at'} type={field === 'expires_at' ? 'date' : field === 'value' || field === 'minimum' ? 'number' : 'text'} min={field === 'minimum' ? 0 : 0.01} step="0.01" value={form[field] ?? ''} onChange={e => setForm({...form, [field]: e.target.value})} /></label>)}<label>Streamer name<select required className="dashboard-wallet-input mt-2" value={form.streamer} onChange={e => setForm({...form, streamer: e.target.value})}><option value="">Select a streamer</option>{form.streamer && !streamers.some(s => s.name === form.streamer) && <option value={form.streamer} disabled>{form.streamer} (previous selection)</option>}{streamers.map(streamer => <option key={streamer.id} value={streamer.name}>{streamer.name} ({streamer.email})</option>)}</select>{!streamers.length && <p className="text-sm text-gray-400 mt-2">No active streamers. Enable Streamer access for an account under Admin → User first.</p>}</label><label>Discount type<select className="dashboard-wallet-input mt-2" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="percent">Percentage</option><option value="fixed">Fixed PHP amount</option></select></label></div><label className="flex gap-2"><input type="checkbox" checked={Boolean(form.active)} onChange={e => setForm({...form, active: e.target.checked})} />Active</label><button disabled={busy} className="account-gold-button">{busy ? 'Saving…' : form.id ? 'Save changes' : 'Add streamer code'}</button><button type="button" className="ml-4" onClick={() => setForm(blank)}>Clear / new</button></form><p role="status">{message}</p><div className="admin-table-scroll"><table><thead><tr><th>Code</th><th>Streamer</th><th>Discount</th><th>Status</th><th>Action</th></tr></thead><tbody>{codes.map(code => <tr key={code.id}><td>{code.code}</td><td>{code.streamer}</td><td>{code.value}{code.type === 'percent' ? '%' : ' PHP'}</td><td>{code.active ? 'Enabled' : 'Disabled'}{code.expires_at && ` · Expires ${code.expires_at}`}</td><td><button className="admin-text-link" onClick={() => setForm({...code, active: Boolean(code.active)})}>Edit</button></td></tr>)}</tbody></table>{!codes.length && <p>No streamer codes yet.</p>}</div></section>;
}
