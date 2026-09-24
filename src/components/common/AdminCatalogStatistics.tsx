import { useCatalog } from '../../context/CatalogContext';
import { Link } from '../../context/RouterContext';

export function AdminCatalogStatistics() {
  const { products, loading, error, reload } = useCatalog();
  if (loading) return <section className="admin-panel"><p role="status">Loading catalog statistics…</p></section>;
  if (error) return <section className="admin-panel"><p role="alert">{error}</p><button type="button" onClick={() => void reload()}>Retry</button></section>;
  const supplierCount = products.filter(product => product.source === 'supplier').length;
  const categories = Array.from(new Set(products.map(product => product.category))).sort();
  return <section className="admin-panel space-y-5">
    <div className="admin-panel-heading"><div><h2>Catalog statistics</h2><p>Current storefront listings, including supplier products. These counts are not filtered by month.</p></div><Link to="/admin/products" className="admin-text-link">Manage products</Link></div>
    <dl className="grid gap-4 sm:grid-cols-3">{[['Total listings', products.length], ['Supplier listings', supplierCount], ['Local listings', products.length - supplierCount]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 p-4"><dt className="text-gray-400">{label}</dt><dd className="text-2xl font-bold">{value}</dd></div>)}</dl>
    {!products.length ? <p>No products are currently listed.</p> : <div className="admin-table-scroll"><table><caption className="text-left mb-3">Products by category</caption><thead><tr><th>Category</th><th>Listings</th><th>Share of catalog</th></tr></thead><tbody>{categories.map(category => {
      const count = products.filter(product => product.category === category).length;
      return <tr key={category}><td>{category || 'Uncategorized'}</td><td>{count}</td><td><progress value={count} max={products.length} aria-label={`${category}: ${count} listings`} /> <span>{Math.round(count / products.length * 100)}%</span></td></tr>;
    })}</tbody></table></div>}
  </section>;
}
