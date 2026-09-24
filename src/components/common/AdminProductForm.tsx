import { useEffect, useState } from 'react';
import { apiRequest } from '../../context/AuthContext';
import { useCatalog } from '../../context/CatalogContext';
export function AdminProductForm() {
  const { products, reload } = useCatalog();
  const [packages, setPackages] = useState<{ id: string; name: string; price: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('new');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [apiSlug, setApiSlug] = useState('');
  const [loadingApiProduct, setLoadingApiProduct] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', category: 'Games', picture: '', price: '', description: '', gift: false });

  const resetForm = () => {
    setSelectedId('new');
    setPackages([]);
    setApiSlug('');
    setForm({ name: '', slug: '', category: 'Games', picture: '', price: '', description: '', gift: false });
  };

  useEffect(() => {
    if (selectedId === 'new') return;
    const product = products.find(item => String(item.id) === selectedId);
    setPackages((product?.packages || []).map(item => ({ ...item, price: String(item.price) })));
    setApiSlug('');
    if (product) setForm({ name: product.name, slug: product.slug, category: product.category, picture: product.picture, price: String(product.minPrice), description: product.description, gift: product.isGiftCard });
  }, [products, selectedId]);

  useEffect(() => {
    if (!apiSlug || selectedId !== 'new') return;
    let cancelled = false;
    setLoadingApiProduct(true);
    apiRequest(`/api/products/${encodeURIComponent(apiSlug)}`)
      .then(data => {
        if (cancelled || !data.product) return;
        const product = data.product;
        setPackages((product.packages || []).map((item: { id: string; name: string; price: number }) => ({ ...item, price: String(item.price) })));
        setForm({ name: product.name, slug: product.slug, category: product.category, picture: product.picture, price: String(product.minPrice ?? ''), description: product.description, gift: Boolean(product.isGiftCard) });
      })
      .catch(error => { if (!cancelled) setMessage(error instanceof Error ? error.message : 'Could not load API game.'); })
      .finally(() => { if (!cancelled) setLoadingApiProduct(false); });
    return () => { cancelled = true; };
  }, [apiSlug, selectedId]);

  const update = (field: string, value: string | boolean) => setForm(current => ({ ...current, [field]: value }));
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await apiRequest('/sanctum/csrf-cookie');
      await apiRequest(selectedId === 'new' ? '/api/admin/products' : `/api/admin/products/${selectedId}`, { method: selectedId === 'new' ? 'POST' : 'PUT', body: JSON.stringify({ name: form.name, slug: form.slug, category: form.category, picture: form.picture, description: form.description, minPrice: packages.length ? Math.min(...packages.map(item => Number(item.price))) : Number(form.price), maxPrice: packages.length ? Math.max(...packages.map(item => Number(item.price))) : Number(form.price), packages: packages.map(item => ({ ...item, price: Number(item.price) })), isGiftCard: form.gift }) });
      await reload();
      setMessage(selectedId === 'new' ? 'Game added to the database.' : 'Game updated in the database.');
      if (selectedId === 'new') resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save game.');
    } finally {
      setBusy(false);
    }
  };

  return <div className="admin-panel" style={{ marginBottom: 20 }}><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><label className="text-sm font-bold text-gray-300">Saved games<select value={selectedId} onChange={event => { setSelectedId(event.target.value); setOpen(true); setMessage(''); }} className="dashboard-wallet-input mt-2 min-w-64"><option value="new">Select a saved game</option>{products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label><div className="flex items-center gap-4"><button type="button" className="admin-text-link" onClick={() => { resetForm(); setOpen(true); setMessage(''); }}>＋ Add new game</button><button type="button" className="admin-text-link" onClick={() => setOpen(!open)}>{open ? 'Close editor' : 'Edit selected game'}</button></div></div>{open && <form className="space-y-4 mt-5" onSubmit={submit}><div className="grid sm:grid-cols-2 gap-4">{[{ name: 'name', label: 'Game name' }, { name: 'slug', label: 'URL slug (e.g. new-game)' }, { name: 'category', label: 'Category (e.g. Games)' }, { name: 'picture', label: 'Image URL or /games/filename.webp' }].map(field => <label key={field.name} className="text-sm">{field.label}<input required value={form[field.name as keyof typeof form] as string} onChange={event => update(field.name, event.target.value)} maxLength={field.name === 'picture' ? 2000 : 200} className="dashboard-wallet-input mt-2" /></label>)}</div>{packages.length === 0 && <label className="block text-sm">Starting price (PHP)<input required value={form.price} onChange={event => update('price', event.target.value)} type="number" min="0.01" max="1000000" step="0.01" className="dashboard-wallet-input mt-2" /></label>}<fieldset className="space-y-3"><legend className="font-bold">Game packages</legend><p className="text-sm text-gray-400">Add denominations or passes. The starting price is calculated from your lowest-priced package.</p>{packages.map((item, index) => <div key={item.id} className="grid sm:grid-cols-[1fr_160px_auto] gap-3 items-end"><label className="text-sm">Package name<input required maxLength={200} className="dashboard-wallet-input mt-2" value={item.name} placeholder="86 Diamonds" onChange={event => setPackages(current => current.map((row, i) => i === index ? { ...row, name: event.target.value } : row))} /></label><label className="text-sm">Price (PHP)<input required type="number" min="0.01" max="1000000" step="0.01" className="dashboard-wallet-input mt-2" value={item.price} onChange={event => setPackages(current => current.map((row, i) => i === index ? { ...row, price: event.target.value } : row))} /></label><button type="button" className="admin-text-link py-3" aria-label={`Remove package ${index + 1}`} onClick={() => setPackages(current => current.filter((_, i) => i !== index))}>Remove</button></div>)}<button type="button" disabled={packages.length >= 200} className="admin-text-link" onClick={() => setPackages(current => [...current, { id: crypto.randomUUID(), name: "", price: "" }])}>+ Add package</button></fieldset><label className="block text-sm">Description<textarea required value={form.description} onChange={event => update('description', event.target.value)} maxLength={10000} className="dashboard-wallet-input mt-2" /></label><label className="flex gap-2 text-sm"><input checked={form.gift} onChange={event => update('gift', event.target.checked)} type="checkbox" />Gift card</label><div className="flex gap-3"><button type="button" onClick={() => { resetForm(); setOpen(true); }} className="admin-text-link">Clear / add new</button><button disabled={busy} className="account-gold-button">{busy ? 'Saving…' : selectedId === 'new' ? 'Add game' : 'Save game changes'}</button></div></form>}<p role="status" className="text-sm mt-3">{message}</p></div>;
}
