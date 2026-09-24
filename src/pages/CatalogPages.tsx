import { useEffect, useRef, useState } from 'react';
import { Banknote, Building2, CreditCard, QrCode, Smartphone, WalletCards } from 'lucide-react';
import { apiRequest } from '../context/AuthContext';
import { OfficialProduct } from '../data/officialData';
import { useCatalog } from '../context/CatalogContext';
import { Link, useRouter } from '../context/RouterContext';
import { MorePackages, PackageFilters, usePackageBrowser } from '../components/common/PackageBrowser';

function ProductDescription({ description }: { description: string }) {
  if (!description.trim()) return null;
  return <details className="text-sm text-gray-300">
    <summary className="cursor-pointer text-brand-gold">Read description</summary>
    <p className="mt-3 whitespace-pre-line max-h-64 overflow-y-auto">{description}</p>
  </details>;
}

function PackageSelector({ product }: { product: OfficialProduct }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string; vendor: string; description: string | null }[]>([]);
  const [step, setStep] = useState<'select' | 'checkout' | 'complete'>('select');
  const [account, setAccount] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState('GCash');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [quote, setQuote] = useState<{code: string; subtotalCentavos: number; discountCentavos: number} | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [reference, setReference] = useState('');
  const checkoutHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { checkoutHeading.current?.focus(); }, [step]);
  useEffect(() => {
    apiRequest('/api/payment-methods')
      .then(data => setPaymentMethods(data.methods ?? []))
      .catch(() => setPaymentMethods([]));
  }, []);
  const packages = product.packages ?? [];
  const packageBrowser = usePackageBrowser(packages);
  const selected = packages.find(item => item.id === selectedId && item.stock !== 0);
  const price = (value: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
  const subtotal = couponApplied && quote ? quote.subtotalCentavos : Math.round((selected?.price ?? 0) * 100);
  const discount = couponApplied && quote ? quote.discountCentavos : 0;
  const paymentIcon = (name: string) => {
    const normalized = name.toLowerCase();
    if (normalized.includes('gcash') || normalized.includes('maya') || normalized.includes('paymaya') || normalized.includes('grab') || normalized.includes('shopee')) return Smartphone;
    if (normalized.includes('qr') || normalized.includes('instapay')) return QrCode;
    if (normalized.includes('visa') || normalized.includes('mastercard') || normalized.includes('card')) return CreditCard;
    if (normalized.includes('bank') || normalized.includes('bdo') || normalized.includes('bpi') || normalized.includes('union') || normalized.includes('ubp') || normalized.includes('rcbc')) return Building2;
    if (normalized.includes('wallet')) return WalletCards;
    return Banknote;
  };
  const isAllowedPaymentMethod = (name: string) => {
    const normalized = name.toLowerCase();
    return normalized.includes('gcash') || normalized.includes('maya') || normalized.includes('paymaya') || normalized.includes('qr') || normalized.includes('instapay') || normalized.includes('visa') || normalized.includes('mastercard') || normalized.includes('card') || normalized.includes('wallet') || normalized.includes('grab') || normalized.includes('shopee');
  };
  const orderedPaymentMethods = paymentMethods.filter(method => isAllowedPaymentMethod(method.name)).sort((first, second) => {
    const priority = (name: string) => {
      const normalized = name.toLowerCase();
      if (normalized.includes('gcash')) return 1;
      if (normalized.includes('maya') || normalized.includes('paymaya')) return 2;
      if (normalized.includes('qr') || normalized.includes('instapay')) return 3;
      if (normalized.includes('visa') || normalized.includes('mastercard') || normalized.includes('card')) return 4;
      return 5;
    };
    return priority(first.name) - priority(second.name);
  });
  const selectedPaymentMethod = orderedPaymentMethods.find(method => method.name === payment);
  const isCardPayment = /visa|mastercard|card|debit/i.test(selectedPaymentMethod?.name ?? '');
  if (step !== 'select' && selected) return <section className="space-y-4 rounded-xl border border-brand-gold p-5">
    <p className="text-sm text-brand-gold">Demo only — no real payment or supplier order.</p>
    <h2 className="text-xl font-bold" tabIndex={-1} ref={checkoutHeading}>
      {step === 'complete' ? 'Demo order completed' : 'Demo checkout'}
    </h2>
    <p>{product.name} · {selected.name}</p>
    <dl className="text-sm space-y-2">{(product.inputFields ?? []).map(field => <div key={field.name}>
      <dt className="text-gray-400">{field.label}</dt><dd>{field.options.find(option => option.value === account[field.name])?.label ?? account[field.name]}</dd>
    </div>)}</dl>
    {step === 'checkout' ? <>
      <fieldset className="space-y-2"><legend className="font-bold">Payment method</legend>
        {orderedPaymentMethods.length ? orderedPaymentMethods.map(method => { const Icon = paymentIcon(method.name); return <label key={method.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-brand-cardBorder p-3 transition hover:border-brand-gold">
          <input type="radio" name="demo-payment" checked={payment === method.name} onChange={() => setPayment(method.name)} />
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gold/15 text-brand-gold"><Icon size={18} /></span><span><strong>{method.name}</strong>{method.description?.trim() && <small className="block line-clamp-2 text-gray-400">{method.description}</small>}</span>
        </label>; }) : <p className="text-sm text-gray-400">No payment methods are currently active.</p>}
      </fieldset>
      {isCardPayment && <aside className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-4 text-sm" aria-label="Card payment details">
        <h3 className="font-bold text-brand-gold">Card payment details</h3>
        <p className="mt-2 text-gray-300">Visa and Mastercard payments are processed securely through {selectedPaymentMethod?.vendor || 'our payment gateway'}.</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-400"><li>Major Visa and Mastercard debit or credit cards are accepted.</li><li>Your full card details are not stored by the shop.</li><li>Charges are made at the time of purchase.</li></ul>
      </aside>}
      <label htmlFor="demo-coupon" className="block text-sm">Coupon code</label>
      <div className="flex gap-2"><input id="demo-coupon" className="dashboard-wallet-input min-w-0 flex-1" disabled={quoting} value={coupon}
        onChange={event => { setCoupon(event.target.value); setCouponApplied(false); setCouponMessage(''); }} />
        <button type="button" disabled={quoting} className="account-gold-button" onClick={async () => {
          setQuoting(true); setCouponApplied(false); setCouponMessage('');
          try {
            await apiRequest('/sanctum/csrf-cookie');
            const result = await apiRequest('/api/coupons/quote', { method: 'POST', body: JSON.stringify({ code: coupon, slug: product.slug, item_id: selected.id }) });
            setQuote(result); setCouponApplied(true); setCouponMessage(`${result.code} applied.`);
          } catch (error) { setCouponMessage(error instanceof Error ? error.message : 'Unable to apply coupon.'); }
          finally { setQuoting(false); }
        }}>{quoting ? 'Checking…' : 'Apply'}</button></div>
      <p role="status" className="text-sm">{couponMessage}</p>
    </> : <p role="status">Reference: {reference}<br />Simulated payment via {payment}. No money was charged and no items will be delivered.</p>}
    <dl className="space-y-2">
      <div className="flex justify-between"><dt>Subtotal</dt><dd>{price(subtotal / 100)}</dd></div>
      <div className="flex justify-between"><dt>Discount{couponApplied && quote ? (' (' + quote.code + ')') : ''}</dt><dd>−{price(discount / 100)}</dd></div>
      <div className="flex justify-between font-bold text-brand-gold"><dt>Demo total</dt><dd>{price((subtotal - discount) / 100)}</dd></div>
    </dl>
    {step === 'checkout' ? <div className="flex flex-wrap gap-3">
      <button type="button" className="account-gold-button" disabled={quoting} onClick={() => { setReference(`DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`); setStep('complete'); }}>Simulate payment</button>
      <button type="button" disabled={quoting} onClick={() => { setCouponApplied(false); setStep('select'); }}>Back to selection</button>
    </div> : <button type="button" className="account-gold-button" onClick={() => { setStep('select'); setSelectedId(null); setAccount({}); setCoupon(''); setCouponApplied(false); setCouponMessage(''); }}>Start another demo</button>}
  </section>;
  return <form className="space-y-5" onSubmit={event => {
    event.preventDefault();
    if (!selected) return;
    const data = new FormData(event.currentTarget);
    setAccount(Object.fromEntries((product.inputFields ?? []).map(field => [field.name, String(data.get(field.name) ?? '').trim()])));
    setStep('checkout');
  }}>
    <PlayerFields product={product} initialValues={account} />
    <fieldset className="space-y-3">
    <legend className="mb-3 text-xl font-bold text-white">Choose a package</legend>
    {!packages.length && <p className="text-gray-400">No packages are currently available.</p>}
    {!!packages.length && <PackageFilters browser={packageBrowser} />}
    <div className="grid gap-3 sm:grid-cols-2">
      {packageBrowser.visible.map(item => <label key={item.id} className={`group flex min-h-24 items-center gap-3 rounded-xl border p-3 transition ${item.stock === 0 ? 'cursor-not-allowed border-white/10 opacity-50' : selected?.id === item.id ? 'cursor-pointer border-brand-gold bg-brand-gold/10 shadow-[0_0_24px_rgba(245,166,35,.12)]' : 'cursor-pointer border-white/10 bg-white/[.03] hover:border-brand-gold/70 hover:bg-white/[.06]'} focus-within:ring-2 focus-within:ring-brand-gold`}>
        <input type="radio" name={`package-${product.id}`} value={item.id} checked={selected?.id === item.id} disabled={item.stock === 0} onChange={() => { setSelectedId(item.id); setQuantity(1); }} className="accent-yellow-400" />
        <img src={product.picture} alt="" className="h-12 w-12 rounded-lg object-cover opacity-90" />
        <span className="min-w-0"><span className="block truncate text-sm font-bold text-white">{item.name}</span><span className="mt-1 block text-base font-black text-brand-gold">{price(item.price)}</span>{item.stock === 0 && <span className="block text-xs text-red-300">Out of stock</span>}</span>
      </label>)}
    </div>
    <MorePackages browser={packageBrowser} />
    <p aria-live="polite" className="text-sm text-brand-gold">
      {selected ? `Selected: ${selected.name} — ${price(selected.price)}` : packages.length ? 'Select a package above.' : ''}
    </p>
  </fieldset>
    <p className="text-xs text-gray-400">Demo checkout only. No payment will be taken.</p>
    <div className="flex flex-col gap-3 sm:flex-row"><div className="flex h-12 items-center justify-between rounded-xl border border-white/10 bg-black/25 px-3 sm:w-32"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(value => Math.max(1, value - 1))} className="px-2 text-xl text-gray-300">−</button><strong>{quantity}</strong><button type="button" aria-label="Increase quantity" onClick={() => setQuantity(value => Math.min(99, value + 1))} className="px-2 text-xl text-gray-300">+</button></div><button type="submit" disabled={!selected} className="h-12 flex-1 rounded-xl bg-brand-gold px-5 text-sm font-black text-brand-dark shadow-[0_8px_24px_rgba(245,166,35,.22)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">🛒 Buy now</button></div>
  </form>;
}

function PlayerFields({ product, initialValues = {} }: { product: OfficialProduct; initialValues?: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  if (!product.inputFields?.length) return null;
  return <section className="space-y-3" aria-label="Game account details">
    <h2 className="font-bold text-xl">Game account details</h2>
    {product.inputFields.map(field => <div key={field.name} className="space-y-2">
      <label htmlFor={`player-${field.name}`} className="block text-sm font-bold">{field.label}</label>
      {field.type === 'select' ? <select
        id={`player-${field.name}`} name={field.name} required className="dashboard-wallet-input w-full"
        value={values[field.name] ?? ''} onChange={e => setValues(previous => ({ ...previous, [field.name]: e.target.value }))}
      >
        <option value="">{field.placeholder || `Select ${field.label}`}</option>
        {field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select> : <input
        id={`player-${field.name}`} name={field.name} type="text" className="dashboard-wallet-input w-full"
        placeholder={field.placeholder} required pattern=".*\S.*" autoComplete="off" spellCheck={false}
        value={values[field.name] ?? ''} onChange={e => setValues(previous => ({ ...previous, [field.name]: e.target.value }))}
      />}
    </div>)}
  </section>;
}

function SupplierProductPage({ product }: { product: OfficialProduct }) {
  const price = product.minPrice === null ? 'Price unavailable' : `₱${product.minPrice.toLocaleString('en-PH', { maximumFractionDigits: 2 })}`;
  return <main className="relative min-h-screen overflow-hidden bg-[#080b13]">
    <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105" style={{ backgroundImage: `url("${product.picture}")` }} aria-hidden="true" />
    <div className="absolute inset-0 bg-[linear-gradient(115deg,#080b13_8%,rgba(8,11,19,.82)_48%,rgba(8,11,19,.55))]" aria-hidden="true" />
    <section className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Link to="/games" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-brand-gold">⌂ <span>Games</span> <span className="text-gray-600">/</span> <span>{product.name}</span></Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(320px,.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-black/30 shadow-2xl shadow-black/40">
            <img src={product.picture} alt={product.name} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/35 p-3 text-center text-xs text-gray-300 backdrop-blur-md">
            <div><strong className="block text-lg text-white">⚡</strong>Instant delivery</div>
            <div><strong className="block text-lg text-white">◇</strong>Secure payments</div>
            <div><strong className="block text-lg text-white">◉</strong>24/7 support</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-md"><h2 className="font-bold text-white">How it works</h2><div className="mt-3 grid grid-cols-3 gap-3 text-center text-[11px] text-gray-400"><div><strong className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-brand-gold">1</strong>Choose a package</div><div><strong className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-brand-gold">2</strong>Complete payment</div><div><strong className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-brand-gold">3</strong>Receive instantly</div></div></div>
          <div className="flex items-center gap-3 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold text-lg text-brand-dark">Z</span><div><strong className="block text-sm text-brand-gold">Powered by GPDS</strong><span className="text-xs text-gray-400">Trusted digital delivery for gamers.</span></div></div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#101522]/80 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex justify-end gap-2 text-[10px] font-bold text-gray-300"><span className="rounded-full border border-white/10 bg-white/10 px-3 py-2">⚡ Instant Delivery</span><span className="rounded-full border border-white/10 bg-white/10 px-3 py-2">◇ 100% Secure Payment</span></div>
          <p className="text-xs font-bold uppercase tracking-[.35em] text-brand-gold">{product.category}</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">{product.name}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 line-clamp-2">{product.description}</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 px-5 py-4"><span className="block text-xs text-gray-400">Starting from</span><strong className="text-3xl text-brand-gold">{price}</strong></div>
          <div className="mt-7 flex justify-end"><span className="text-xs text-gray-400">API catalog pricing</span></div>
          <div className="mt-3"><PackageSelector key={product.slug} product={product} /></div>
          <p className="mt-6 text-xs text-gray-400">Packages and prices are supplied by the live game catalog. Contact support if an item is unavailable.</p>
          <Link to="/contact" className="mt-4 inline-flex rounded-xl border border-brand-gold/50 px-4 py-2 text-sm font-bold text-brand-gold hover:bg-brand-gold hover:text-brand-dark">Contact support</Link>
        </div>
      </div>
    </section>
  </main>;
}

export function CatalogPages({ detail = false }: { detail?: boolean }) {
  const { products, loading, error, reload } = useCatalog();
  const { params } = useRouter();
  const [search, setSearch] = useState('');
  const [details, setDetails] = useState<{ slug: string; product?: OfficialProduct; error?: string } | null>(null);
  const [retry, setRetry] = useState(0);
  const listedProduct = products.find(p => p.slug === params.gameId);
  const supplier = detail && (!listedProduct || listedProduct.source === 'supplier');
  useEffect(() => {
    if (!supplier) return;
    const controller = new AbortController();
    const slug = params.gameId;
    setDetails(null);
    apiRequest(`/api/products/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(async data => {
        if (controller.signal.aborted || !data.product) return;
        let product = data.product as OfficialProduct;
        if (product.source === 'supplier' && !product.packages?.length) {
          try {
            const itemsResponse = await fetch(`https://admin.gpdsgameshop.com/api/product-items/${product.id}?currency_code=PHP`, { signal: controller.signal });
            const itemsData = await itemsResponse.json();
            const packages: NonNullable<OfficialProduct['packages']> = (itemsData.payload ?? []).filter((item: { id?: number; name?: string; total_price?: number }) => item.id && item.name && Number.isFinite(Number(item.total_price))).map((item: { id: number; name: string; total_price: number; stock?: number | null }) => ({ id: String(item.id), name: item.name, price: Number(item.total_price), stock: item.stock ?? null }));
            if (packages.length) product = { ...product, packages, minPrice: Math.min(...packages.map(item => item.price)), maxPrice: Math.max(...packages.map(item => item.price)) };
          } catch {
            // Keep the backend response when the browser fallback is unavailable.
          }
        }
        if (!controller.signal.aborted) setDetails({ slug, product });
      })
      .catch(async () => {
        if (controller.signal.aborted) return;
        const parent = products.find(candidate => candidate.slug === slug || candidate.gameGroup?.variants.some(variant => variant.slug === slug));
        const variant = parent?.gameGroup?.variants.find(item => item.slug === slug);
        const fallbackProduct = variant && parent ? { ...parent, id: variant.id, name: variant.name, slug: variant.slug, picture: variant.picture, rating: variant.average_rating, reviewsCount: variant.total_reviews } : parent;
        if (!fallbackProduct) {
          setDetails({ slug, error: 'Unable to load game packages. Please try again.' });
          return;
        }
        try {
          const itemsResponse = await fetch(`https://admin.gpdsgameshop.com/api/product-items/${fallbackProduct.id}?currency_code=PHP`, { signal: controller.signal });
          const itemsData = await itemsResponse.json();
          const packages: NonNullable<OfficialProduct['packages']> = (itemsData.payload ?? []).filter((item: { id?: number; name?: string; total_price?: number }) => item.id && item.name && Number.isFinite(Number(item.total_price))).map((item: { id: number; name: string; total_price: number; stock?: number | null }) => ({ id: String(item.id), name: item.name, price: Number(item.total_price), stock: item.stock ?? null }));
          setDetails({ slug, product: packages.length ? { ...fallbackProduct, packages, minPrice: Math.min(...packages.map(item => item.price)), maxPrice: Math.max(...packages.map(item => item.price)) } : fallbackProduct });
        } catch {
          if (!controller.signal.aborted) setDetails({ slug, error: 'Unable to load game packages. Please try again.' });
        }
      });
    return () => controller.abort();
  }, [supplier, params.gameId, retry]);
  if (loading) return <p className="p-12 text-center">Loading catalog…</p>;
  if (error) return <div className="p-12 text-center"><p role="alert">Catalog unavailable.</p><button onClick={() => void reload()}>Try again</button></div>;
  if (detail) {
    if (supplier && (!details || details.slug !== params.gameId)) return <p className="p-12 text-center">Loading game packages...</p>;
    if (supplier && details?.error) return <div className="p-12 text-center"><p role="alert">{details.error}</p><button onClick={() => setRetry(value => value + 1)}>Try again</button></div>;
    const product = supplier ? details?.product : listedProduct;
    if (!product) return <div className="p-12 text-center"><h1>Product not found</h1><Link to="/games">Browse games</Link></div>;
    return <SupplierProductPage key={product.slug} product={product} />;
  }
  return <section className="max-w-7xl mx-auto p-6 py-12"><h1 className="text-3xl font-bold mb-6">Game catalog</h1><input className="dashboard-wallet-input mb-6" aria-label="Search catalog" placeholder="Search games…" value={search} onChange={e => setSearch(e.target.value)} /><div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">{products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => <Link key={p.id} to={`/games/${p.slug}`} className="admin-panel"><img src={p.picture} alt="" loading="lazy" className="rounded-xl aspect-square object-cover mb-3" /><h2 className="text-sm font-bold">{p.name}</h2><p className="text-brand-gold text-sm mt-2">{p.minPrice === null ? 'Price unavailable' : '₱' + p.minPrice.toLocaleString('en-PH')}</p></Link>)}</div></section>;
}
