import { useEffect, useState } from 'react';
import { apiRequest } from '../../context/AuthContext';
import { Promotion, PromotionDialog } from './PromotionalPopup';

const blank: Promotion = { enabled: false, title: '', message: '', image_url: '', button_label: '', button_url: '' };
export function AdminPromotion() {
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(false);
  const load = () => {
    setLoading(true); setError('');
    apiRequest('/api/admin/promotion').then(data => setForm({ ...blank, ...data.promotion })).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);
  return <section className="admin-panel"><h2>Promotional popup</h2><p>Appears on the homepage. Once dismissed, it stays hidden for that browser tab until you save a new version.</p>
    {loading ? <p>Loading settings…</p> : <form className="space-y-4 mt-5" onSubmit={async event => {
      event.preventDefault(); setSaving(true); setMessage(''); setError('');
      try { const data = await apiRequest('/api/admin/promotion', { method: 'PUT', body: JSON.stringify(form) }); setForm({ ...blank, ...data.promotion }); setMessage(data.message); }
      catch (e) { setError(e instanceof Error ? e.message : 'Unable to save.'); }
      finally { setSaving(false); }
    }}>
      <label className="flex gap-3"><input type="checkbox" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} />Enable promotional popup</label>
      {(['title', 'message', 'image_url', 'button_label', 'button_url'] as const).map(key => <label key={key} className="block text-sm">{{ title: 'Title', message: 'Message', image_url: 'Image URL (HTTPS, optional)', button_label: 'Button text (optional)', button_url: 'Button destination (full HTTPS URL)' }[key]}
        {key === 'message' ? <textarea className="admin-modal-input w-full mt-2" maxLength={1000} value={form[key] ?? ''} onChange={e => setForm({ ...form, [key]: e.target.value })} /> : <input className="admin-modal-input w-full mt-2" type={key.endsWith('_url') ? 'url' : 'text'} required={key === 'title' || (key === 'button_url' && !!form.button_label) || (key === 'button_label' && !!form.button_url)} maxLength={key === 'title' ? 120 : key === 'button_label' ? 50 : 2000} value={form[key] ?? ''} onChange={e => setForm({ ...form, [key]: e.target.value })} />}
      </label>)}
      <div className="flex gap-3"><button className="admin-glass-create" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save popup'}</button><button type="button" disabled={!form.title} onClick={() => setPreview(true)}>Preview</button></div>
    </form>}{error && <p role="alert">{error} <button type="button" onClick={load}>Reload settings</button></p>}{message && <p role="status">{message}</p>}{preview && <PromotionDialog promotion={form} onClose={() => setPreview(false)} />}
  </section>;
}
