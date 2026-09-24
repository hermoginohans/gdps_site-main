import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { useRouter } from './RouterContext';
import { OfficialProduct } from '../data/officialData';
import { apiRequest } from './AuthContext';
import { assetUrl } from '../utils/assets';
import { createPortal } from 'react-dom';
const CatalogContext = createContext<{ products: OfficialProduct[]; loading: boolean; error: string; reload: () => Promise<void>; openProduct: (product: OfficialProduct) => void }>({ products: [], loading: true, error: '', reload: async () => {}, openProduct: () => {} });

function GameCollection({ group, onClose, onSelect }: { group: NonNullable<OfficialProduct['gameGroup']>; onClose: () => void; onSelect: (slug: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const element = dialog.current;
    return () => { element?.close(); previous?.focus(); };
  }, []);
  return createPortal(<dialog ref={dialog} onCancel={onClose} aria-labelledby="collection-title" className="m-auto w-[calc(100%-2rem)] max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-brand-gold/50 bg-brand-card text-white p-6 backdrop:bg-black/80">
    <header className="flex justify-between gap-4 border-b border-brand-cardBorder pb-5 mb-6"><div><p className="text-brand-gold font-bold uppercase">Game collection</p><h2 id="collection-title" className="text-2xl font-bold">{group.name}</h2><p className="text-gray-400">{group.variants.length} games · Choose the game you want to top up.</p></div><button type="button" aria-label="Close game collection" onClick={onClose} className="text-3xl self-start">×</button></header>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{group.variants.map(variant => <button type="button" key={variant.id} onClick={() => onSelect(variant.slug)} className="text-left rounded-2xl overflow-hidden border border-brand-gold/30 hover:border-brand-gold focus-visible:outline focus-visible:outline-brand-gold">
      <div className="relative"><img src={variant.picture} alt="" className="w-full aspect-square object-cover" />{variant.provider_country && <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-1 text-xs">{variant.provider_country}</span>}{!!variant.discount_tag && <span className="absolute top-2 right-2 bg-emerald-500 rounded-full px-2 py-1 text-xs font-bold">{variant.discount_tag}% Off</span>}</div>
      <div className="p-3 space-y-2">{variant.region_label && <p className="text-xs uppercase text-gray-400">{variant.region_label}</p>}<h3 className="font-bold">{variant.name}</h3><p className="text-brand-gold">★ {Number(variant.average_rating).toFixed(1)} <span className="text-gray-400">({Number(variant.total_reviews).toLocaleString()})</span></p></div>
    </button>)}</div>
  </dialog>, document.body);
}
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<OfficialProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentPath, navigate } = useRouter();
  const [group, setGroup] = useState<OfficialProduct['gameGroup']>(null);
  useEffect(() => { setGroup(null); }, [currentPath]);
  const openProduct = (product: OfficialProduct) => {
    if (product.gameGroup && product.gameGroup.variants.length > 1) setGroup(product.gameGroup);
    else navigate(`/games/${product.slug}`);
  };
  const requestVersion = useRef(0);
  const reload = useCallback(async () => {
    const version = ++requestVersion.current;
    try {
      const data = await apiRequest('/api/products', { cache: 'no-store' });
      if (version !== requestVersion.current) return;
      const next = data.products.map((p: OfficialProduct) => ({ ...p, picture: p.picture.startsWith('/') ? assetUrl(p.picture) : p.picture }));
      setProducts(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
      setError('');
    } catch (e) {
      if (version === requestVersion.current) setError(e instanceof Error ? e.message : 'Catalog unavailable');
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, []);
  useEffect(() => { void reload(); }, [currentPath, reload]);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') void reload(); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    const timer = window.setInterval(refresh, 30000);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      window.clearInterval(timer);
    };
  }, [reload]);
  return <CatalogContext.Provider value={{ products, loading, error, reload, openProduct }}>{children}{group && <GameCollection group={group} onClose={() => setGroup(null)} onSelect={slug => { setGroup(null); navigate(`/games/${slug}`); }} />}</CatalogContext.Provider>;
}
export const useCatalog = () => useContext(CatalogContext);
