import { AdminPaymentMethods } from '../components/common/AdminPaymentMethods';
import { AdminCoupons } from '../components/common/AdminCoupons';
import { AdminOrders } from '../components/common/AdminOrders';
import { AdminStreamerCodes } from '../components/common/AdminStreamerCodes';
import { AdminExchangeRates } from '../components/common/AdminExchangeRates';
import { AdminOperations } from '../components/common/AdminOperations';
import { AdminCatalogStatistics } from '../components/common/AdminCatalogStatistics';
import { AdminSupportInbox } from '../components/common/AdminSupportInbox';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BarChart3, ShoppingBag, Users, Package, CreditCard, ArrowUpRight, Search, ShieldCheck, Lock, Mail, Newspaper, Plus, Trash2, LogOut } from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { useAuth, apiRequest } from '../context/AuthContext';
import { AdminProductForm } from '../components/common/AdminProductForm';
import { assetUrl } from '../utils/assets';
import './AdminPage.css';
import './AdminGlass.css';
import './AdminReference.css';
import { AdminPromotion } from '../components/common/AdminPromotion';
import { Gift, Award, Store, Megaphone, Gavel, Wallet, FileBarChart, Headphones, Video, Handshake, RefreshCw, Settings, Server } from 'lucide-react';

const sections = [
  { id: 'overview', name: 'Dashboard', icon: BarChart3 },
  { id: 'products', name: 'Product', icon: Package },
  { id: 'providers', name: 'Providers', icon: Server },
  { id: 'orders', name: 'Order', icon: ShoppingBag },
  { id: 'gift-cards', name: 'Gift Cards', icon: Gift },
  { id: 'rewards', name: 'GPDS Rewards', icon: Award },
  { id: 'ecommerce', name: 'eCommerce', icon: Store },

  { id: 'promo', name: 'Promo', icon: Megaphone },
  { id: 'auction', name: 'Auction', icon: Gavel },
  { id: 'deposits', name: 'Deposit', icon: Wallet },
  { id: 'reports', name: 'Report', icon: FileBarChart },
  { id: 'statistics', name: 'Statistic', icon: BarChart3 },
  { id: 'support', name: 'Support', icon: Headphones },
  { id: 'users', name: 'User', icon: Users },
  { id: 'streamers', name: 'Streamer Program', icon: Video },
  { id: 'resellers', name: 'Resellers', icon: Store },
  { id: 'payments', name: 'Payment Method', icon: CreditCard },
  { id: 'partners', name: 'Partner', icon: Handshake },
  { id: 'exchange-rates', name: 'Exchange Rate', icon: RefreshCw },
  { id: 'news', name: 'Blog & News', icon: Newspaper },
  { id: 'mail', name: 'Mails', icon: Mail },
  { id: 'settings', name: 'Settings', icon: Settings },
];
const paymentMethods = ['GCash', 'Maya', 'QRPH InstaPay', 'GrabPay', 'Visa', 'Mastercard', 'PayPal', 'USDT'];
type AdminUser = { role_ids?: number[]; id: number; name: string; email: string; is_admin: boolean; is_affiliate: boolean; is_streamer: boolean; is_auction: boolean; is_disabled: boolean; created_at: string };
type AdminNews = { id: string; slug: string; title: string; category: string; author: string; readTime: string; image: string; summary: string; content: string[]; tags: string[]; date: string };
const isEnabledFlag = (value: unknown) => value === true || value === 1 || value === '1';

export function AdminPage() {
  const { user, logout } = useAuth();
  const { products: OFFICIAL_PRODUCTS, loading, error: catalogError } = useCatalog();
  const [records, setRecords] = useState<{roles?: { id: number; name: string }[]; userProgramFlagsSupported?: boolean; users: Record<string, unknown>[]; news: AdminNews[]; support: Record<string, unknown>[]; orders: Record<string, unknown>[]; payments: Record<string, unknown>[]; counts: {users: number; orders: number; revenueCentavos: number | null}} | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { if (user?.isAdmin) apiRequest('/api/admin').then(setRecords).catch(e => setError(e.message)); }, [user]);
  const { currentPath } = useRouter();
  const requested = currentPath.split('?')[0].split('/')[2] || 'overview';
  const section = sections.find(item => item.id === (requested === 'content' ? 'news' : requested)) || sections[0];
  const [query, setQuery] = useState('');
  const [navigationSearch, setNavigationSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editingNews, setEditingNews] = useState<AdminNews | null | undefined>(undefined);
  const [userSearchInput, setUserSearchInput] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const categories = ['All', ...new Set(OFFICIAL_PRODUCTS.map(product => product.category))];
  const products = OFFICIAL_PRODUCTS.filter(product => (category === 'All' || product.category === category) && `${product.name} ${product.slug}`.toLowerCase().includes(query.toLowerCase().trim()));
  const pages = Math.max(1, Math.ceil(products.length / 12));
  const currentPage = Math.min(page, pages);
  const overviewOrders = records?.orders || [];
  const orderStatuses = ['pending', 'processing', 'completed', 'failed'].map(status => ({ status, count: overviewOrders.filter(order => String(order.status).toLowerCase() === status).length }));
  const salesDays = Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - (6 - index)); const key = date.toISOString().slice(0, 10); const total = overviewOrders.filter(order => String(order.created_at || '').startsWith(key) && String(order.status).toLowerCase() === 'completed').reduce((sum, order) => sum + Number(order.amount_centavos || 0), 0); return { label: date.toLocaleDateString('en-PH', { weekday: 'short' }), total }; });
  const maxSales = Math.max(...salesDays.map(day => day.total), 1);
  const topProducts = Object.entries(overviewOrders.reduce<Record<string, number>>((counts, order) => { const productId = String(order.product_id || ''); if (productId) counts[productId] = (counts[productId] || 0) + 1; return counts; }, {})).sort(([, first], [, second]) => second - first).slice(0, 5).map(([productId, count]) => ({ name: OFFICIAL_PRODUCTS.find(product => String(product.id) === productId)?.name || `Product #${productId}`, count }));
  const filteredUsers = (records?.users as AdminUser[] | undefined)?.filter(adminUser => {
    const matchesSearch = `${adminUser.name} ${adminUser.email}`.toLowerCase().includes(userSearch.toLowerCase().trim());
    const affiliate = isEnabledFlag(adminUser.is_affiliate);
    const streamer = isEnabledFlag(adminUser.is_streamer);
    const auction = isEnabledFlag(adminUser.is_auction);
    const disabled = isEnabledFlag(adminUser.is_disabled);
    const matchesFilter = userFilter === 'all' || (userFilter === 'affiliate' && affiliate) || (userFilter === 'streamer' && streamer) || (userFilter === 'auction' && auction) || (userFilter === 'none' && !affiliate && !streamer && !auction) || (userFilter === 'active' && !disabled) || (userFilter === 'disabled' && disabled);
    return matchesSearch && matchesFilter;
  }) || [];
  const handleLogout = async () => { if (!await logout()) return; window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); };
  if (!user) return <AdminLoginForm />;
  if (!user.isAdmin) return <main className="max-w-lg mx-auto p-10 space-y-5"><h1 className="text-2xl text-brand-gold font-bold">Administrator access required</h1><p>Your account does not have administrator access.</p><Link to="/" className="admin-text-link">Back to storefront</Link></main>;
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link to="/admin" className="admin-brand"><img src={assetUrl('/gpds_logo.png')} alt="GPDS Game Shop" /><span>ADMIN WORKSPACE</span></Link>
      
      <nav aria-label="Admin navigation">{sections.map(item => <div key={item.id}>{['overview', 'products', 'support', 'settings'].includes(item.id) && <p className="admin-nav-label">{item.id === 'overview' ? 'Admin workspace' : item.id === 'products' ? 'Store management' : item.id === 'support' ? 'Community' : 'System'}</p>}<Link to={`/admin/${item.id}`} className={`admin-nav-item${section.id === item.id ? ' active' : ''}`}><item.icon size={20} /><span>{item.name}</span></Link></div>)}</nav>
      <div className="admin-sidebar-bottom"><ShieldCheck size={20} /><p>Administrator<span>Database connected</span></p></div>
      <Link to="/" className="admin-store-link">Back to storefront <ArrowUpRight size={16} /></Link>
      <button type="button" className="admin-logout-button" onClick={handleLogout}><LogOut size={16} />Log out</button>
    </aside>
    <main className="admin-main">
      <div className="admin-topbar"><div className="admin-navigation-search"><label><Search size={20} /><input aria-label="Search admin pages" placeholder="Search admin pages…" value={navigationSearch} onChange={event => setNavigationSearch(event.target.value)} /></label>{navigationSearch.trim() && <div className="admin-navigation-results">{sections.filter(item => item.name.toLowerCase().includes(navigationSearch.trim().toLowerCase())).map(item => <Link key={item.id} to={'/admin/' + item.id} onClick={() => setNavigationSearch('')}>{item.name}</Link>)}{!sections.some(item => item.name.toLowerCase().includes(navigationSearch.trim().toLowerCase())) && <p>No matching pages</p>}</div>}</div><span className="admin-topbar-account"><ShieldCheck size={18} />{user.name}</span></div>
      <header className="admin-header"><div><p>GPDS WORKSPACE</p><h1>{section.name}</h1></div><div className="admin-glass-toolbar"><Link to="/admin/products" className="admin-glass-create"><Plus size={15} />Manage products</Link><div className="admin-profile-menu"><button type="button" className="admin-glass-profile" aria-expanded={isProfileMenuOpen} aria-haspopup="menu" onClick={() => setIsProfileMenuOpen(open => !open)}><span>{user.name.slice(0, 1).toUpperCase()}</span><div><strong>{user.name}</strong><small>Administrator</small></div></button>{isProfileMenuOpen && <div className="admin-profile-dropdown" role="menu"><div className="admin-profile-summary"><strong>{user.name}</strong><small>{user.email}</small></div><button type="button" role="menuitem" onClick={handleLogout}><LogOut size={15} />Log out</button></div>}</div></div></header>
      <div className="admin-preview-notice">Products are saved to the database. Payment processing is not connected; no money can be collected here.</div>{(error || catalogError) && <p role="alert">{error || catalogError}</p>}{loading && <p>Loading catalog…</p>}
      {section.id === 'overview' && <>
        <div className="admin-intro"><h2>Hi, {user.name.split(' ')[0]}!</h2><p>Here’s what’s happening with your store today.</p></div>
        <AdminOperations />
        <div className="admin-quick-actions"><Link to="/admin/products" className="admin-quick-action"><Package size={17} /><span><strong>Add or edit game</strong><small>Manage your catalog</small></span><ArrowUpRight size={15} /></Link><Link to="/admin/news" className="admin-quick-action"><Newspaper size={17} /><span><strong>Blog &amp; News</strong><small>Share a new update</small></span><ArrowUpRight size={15} /></Link><Link to="/admin/users" className="admin-quick-action"><Users size={17} /><span><strong>Manage users</strong><small>Access and memberships</small></span><ArrowUpRight size={15} /></Link></div>
        <div className="admin-overview-panels admin-insight-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><h2>Sales activity</h2><p>Completed revenue over the last 7 days.</p></div><BarChart3 size={19} /></div><div className="admin-sales-chart">{salesDays.map(day => <div className="admin-sales-day" key={day.label}><div className="admin-sales-bar"><span style={{ height: `${Math.max(day.total ? (day.total / maxSales) * 100 : 4, 4)}%` }} /></div><small>{day.label}</small></div>)}</div></section><section className="admin-panel"><div className="admin-panel-heading"><div><h2>Order status</h2><p>Current order pipeline.</p></div><ShoppingBag size={19} /></div><div className="admin-status-list">{orderStatuses.map(item => <div key={item.status}><span className={`admin-status-dot ${item.status}`} /><span>{item.status}</span><strong>{item.count}</strong></div>)}</div></section></div>
        <div className="admin-overview-panels"><section className="admin-panel"><div className="admin-panel-heading"><div><h2>Top-selling games</h2><p>Based on recorded orders.</p></div><Package size={19} /></div>{topProducts.length ? <div className="admin-top-products">{topProducts.map(product => <div key={product.name}><span>{product.name}</span><strong>{product.count} order{product.count === 1 ? '' : 's'}</strong></div>)}</div> : <p>No order data yet.</p>}</section><section className="admin-panel"><h2>Recent orders</h2>{records ? <DatabaseRecords rows={records.orders.slice(0, 5)} /> : <p>Loading orders…</p>}<Link to="/admin/orders" className="admin-text-link">Open orders <ArrowUpRight size={15} /></Link></section></div>
        <div className="admin-overview-panels"><section className="admin-panel"><h2>Catalog by category</h2><div className="admin-category-list">{categories.filter(item => item !== 'All').map(item => { const count = OFFICIAL_PRODUCTS.filter(product => product.category === item).length; return <div key={item}><div><span>{item}</span><strong>{count}</strong></div><progress value={count} max={OFFICIAL_PRODUCTS.length} aria-label={`${item}: ${count} products`} /></div>; })}</div><Link to="/admin/products" className="admin-text-link">Browse catalog <ArrowUpRight size={15} /></Link></section></div>
      </>}
      {section.id === 'products' && <AdminProductForm />}
      {section.id === 'products' && <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>Product catalog</h2><p>Review the products currently listed on your storefront.</p></div><span>{products.length} products</span></div>
        <div className="admin-filters"><label><Search size={18} aria-hidden="true" /><input aria-label="Search products" type="search" placeholder="Search products or slugs…" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} /></label><select aria-label="Filter by category" value={category} onChange={event => { setCategory(event.target.value); setPage(1); }}>{categories.map(item => <option key={item}>{item}</option>)}</select></div>
        <div className="admin-table-scroll"><table><thead><tr><th>Product</th><th>Category</th><th>Starting price</th><th>Action</th></tr></thead><tbody>{products.slice((currentPage - 1) * 12, currentPage * 12).map(product => <tr key={product.id}><td><div className="admin-product-cell"><img src={product.picture} alt="" loading="lazy" /><div><strong>{product.name}</strong><span>{product.slug}</span></div></div></td><td>{product.category}</td><td>{product.minPrice === null ? 'Price unavailable' : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(product.minPrice)}</td><td><Link to={`/games/${product.slug}`} className="admin-text-link">View <ArrowUpRight size={14} /></Link></td></tr>)}</tbody></table></div>
        {!products.length && <div className="admin-empty"><h3>No products match your filters</h3><button onClick={() => { setQuery(''); setCategory('All'); setPage(1); }}>Clear filters</button></div>}
        <div className="admin-pagination"><span>Page {currentPage} of {pages}</span><div><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><button disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div></div>
      </section>}
      {section.id === 'users' && <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Users</h2><p>Edit account access, partnership programs, and passwords.</p></div><span>{filteredUsers.length} of {records?.users.length ?? 0} accounts</span></div><form className="admin-user-search" onSubmit={event => { event.preventDefault(); setUserSearch(userSearchInput); }}><Search size={16} aria-hidden="true" /><input aria-label="Search users" value={userSearchInput} onChange={event => setUserSearchInput(event.target.value)} placeholder="Search by name or email" /><select aria-label="Filter users" value={userFilter} onChange={event => setUserFilter(event.target.value)}><option value="all">All users</option><option value="affiliate">Affiliate</option><option value="streamer">Streamer</option><option value="auction">Auction</option><option value="none">No programs</option><option value="active">Active</option><option value="disabled">Disabled</option></select><button type="submit">Search</button>{(userSearch || userFilter !== 'all') && <button type="button" onClick={() => { setUserSearchInput(''); setUserSearch(''); setUserFilter('all'); }}>Clear</button>}</form>{!records ? <p>{error || 'Loading users…'}</p> : <div className="admin-table-scroll"><table><thead><tr><th>User</th><th>Programs</th><th>Status</th><th>Action</th></tr></thead><tbody>{filteredUsers.map(adminUser => { const affiliate = isEnabledFlag(adminUser.is_affiliate); const streamer = isEnabledFlag(adminUser.is_streamer); const auction = isEnabledFlag(adminUser.is_auction); return <tr key={adminUser.id}><td><div className="admin-product-cell"><div><strong>{adminUser.name}</strong><span>{adminUser.email}</span></div></div></td><td><div className="flex flex-wrap gap-1">{affiliate && <span className="admin-preview-badge">Affiliate</span>}{streamer && <span className="admin-preview-badge">Streamer</span>}{auction && <span className="admin-preview-badge">Auction</span>}{!affiliate && !streamer && !auction && <span className="text-gray-500">None</span>}</div></td><td><span className={isEnabledFlag(adminUser.is_disabled) ? 'text-red-400' : 'text-green-400'}>{isEnabledFlag(adminUser.is_disabled) ? 'Disabled' : 'Active'}</span></td><td><button type="button" onClick={() => setEditingUser(adminUser)} className="admin-text-link">Edit <ArrowUpRight size={14} /></button></td></tr>; })}</tbody></table>{!filteredUsers.length && <p className="admin-empty">No users match your search.</p>}</div>}</section>}
      {section.id === 'news' && <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Blog &amp; News</h2><p>Publish updates, esports stories, and player guides to the public blog.</p></div><button type="button" onClick={() => setEditingNews(null)} className="admin-text-link"><Plus size={15} /> Add article</button></div>{!records ? <p>{error || 'Loading news…'}</p> : <div className="admin-table-scroll"><table><thead><tr><th>Article</th><th>Category</th><th>Published</th><th>Action</th></tr></thead><tbody>{records.news.map(news => <tr key={news.id}><td><div className="admin-product-cell"><img src={news.image} alt="" /><div><strong>{news.title}</strong><span>/{news.slug}</span></div></div></td><td>{news.category}</td><td>{news.date}</td><td><button type="button" onClick={() => setEditingNews(news)} className="admin-text-link">Edit <ArrowUpRight size={14} /></button></td></tr>)}</tbody></table></div>}</section>}
      {section.id === 'support' && <>{!records ? <section className="admin-panel"><p>{error || 'Loading support requests…'}</p></section> : <AdminSupportInbox tickets={records.support} onRefresh={async () => setRecords(await apiRequest('/api/admin'))} />}</>}
      {section.id === 'orders' && <AdminOrders />}
      {section.id === 'payments' && <AdminPaymentMethods />}
      {section.id === 'exchange-rates' && <AdminExchangeRates />}
      {editingUser && <AdminUserEditor roles={records?.roles ?? []} programFlagsSupported={records?.userProgramFlagsSupported ?? false} user={editingUser} onClose={() => setEditingUser(null)} onSaved={async () => { setEditingUser(null); setRecords(await apiRequest('/api/admin')); }} />}
      {['providers', 'reports'].includes(section.id) && <AdminOperations />}
      {section.id === 'statistics' && <AdminCatalogStatistics />}
      {section.id === 'streamers' && <AdminStreamerCodes />}
      {['streamers', 'auction', 'partners'].includes(section.id) && <section className="admin-panel"><div className="admin-panel-heading"><div><h2>{section.name} members</h2><p>Registered accounts with access to this program. Select a member to manage their access.</p></div><label className="admin-member-search"><Search size={18} /><input aria-label="Search members" placeholder="Search members" value={memberSearch} onChange={event => setMemberSearch(event.target.value)} /></label></div>{!records ? <p>{error || 'Loading members...'}</p> : (() => {
        const members = (records.users as AdminUser[]).filter(member => isEnabledFlag(section.id === 'streamers' ? member.is_streamer : section.id === 'auction' ? member.is_auction : member.is_affiliate));
        const matching = members.filter(member => (member.name + ' ' + member.email).toLowerCase().includes(memberSearch.trim().toLowerCase()));
        return <><div className="admin-table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Action</th></tr></thead><tbody>{matching.map(member => <tr key={member.id}><td>{member.name}</td><td>{member.email}</td><td><button className="admin-text-link" onClick={() => setEditingUser(member)}>Manage access</button></td></tr>)}</tbody></table></div>{!matching.length && <div className="admin-members-empty"><span><Users size={32} /></span><h3>No members found</h3><p>{memberSearch ? 'Try another name or email.' : 'No members in the loaded accounts have access to this program yet.'}</p><Link to="/admin/users" className="admin-glass-create"><Users size={18} />Manage users</Link></div>}<footer className="admin-members-footer">Showing {matching.length} of {members.length} members in the latest {records.users.length} accounts</footer></>;
      })()}</section>}
      {section.id === 'deposits' && <section className="admin-panel"><h2>Deposit history</h2><p>Payments without an associated order. Payment collection is not connected yet.</p>{records ? <DatabaseRecords rows={records.payments.filter(payment => payment.order_id == null)} /> : <p>{error || 'Loading deposits…'}</p>}</section>}
      {section.id === 'resellers' && <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Resellers</h2><p>Manage reseller accounts and access from the user directory.</p></div><Link to="/admin/users" className="admin-text-link"><Plus size={15} /> Add reseller</Link></div><div className="admin-reseller-empty"><Store size={28} /><h3>Reseller management</h3><p>Choose an existing user to manage their reseller access and account details.</p><Link to="/admin/users" className="admin-glass-create">Open users</Link></div></section>}
      {section.id === 'promo' && <AdminCoupons />}
      {section.id === 'settings' && <AdminPromotion />}
      {['gift-cards', 'rewards', 'ecommerce', 'mail'].includes(section.id) && <section className="admin-panel"><div className="admin-panel-heading"><h2>{section.name}</h2><span className="admin-preview-badge">Not connected</span></div><EmptyState icon={section.icon} title={`${section.name} management`} description="This section is available in your admin navigation. Its management tools and data integration have not been implemented yet." /></section>}
      {editingNews !== undefined && <AdminNewsEditor news={editingNews} onClose={() => setEditingNews(undefined)} onSaved={async () => { setEditingNews(undefined); setRecords(await apiRequest('/api/admin')); }} />}
    </main>
  </div>;
}

function AdminUserEditor({ user, roles, programFlagsSupported, onClose, onSaved }: { roles: { id: number; name: string }[]; programFlagsSupported: boolean; user: AdminUser; onClose: () => void; onSaved: () => Promise<void> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => { dialog?.close(); previousFocus?.focus(); };
  }, []);
  const [form, setForm] = useState({ role_ids: user.role_ids ?? [], name: user.name, email: user.email, is_affiliate: user.is_affiliate, is_streamer: user.is_streamer, is_auction: user.is_auction, is_disabled: user.is_disabled, password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (field: string, value: string | boolean) => setForm(current => ({ ...current, [field]: value }));
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await apiRequest(`/api/admin/users/${user.id}`, { method: 'PUT', body: JSON.stringify(form) });
      await onSaved();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update user.');
    } finally {
      setSaving(false);
    }
  };
  return createPortal(<dialog ref={dialogRef} onCancel={onClose} aria-label={`Edit ${user.name}`} className="m-auto w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-cardBorder bg-brand-card p-6 text-white shadow-2xl backdrop:bg-black/75"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">User management</p><h2 className="mt-1 text-xl font-bold text-white">Edit {user.name}</h2></div><button type="button" onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close editor">×</button></div><form onSubmit={submit} className="mt-6 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-gray-300">Name<input required value={form.name} onChange={event => update('name', event.target.value)} className="admin-modal-input" /></label><label className="text-xs font-bold text-gray-300">Email<input required type="email" value={form.email} onChange={event => update('email', event.target.value)} className="admin-modal-input" /></label></div><fieldset className="space-y-2"><legend className="text-sm font-bold">Roles</legend>{roles.map(role => <label key={role.id} className="admin-check"><input type="checkbox" checked={form.role_ids.includes(role.id)} onChange={event => setForm(current => ({ ...current, role_ids: event.target.checked ? [...current.role_ids, role.id] : current.role_ids.filter(id => id !== role.id) }))} />{role.name}</label>)}</fieldset><div className="grid gap-3 sm:grid-cols-2"><label className="admin-check"><input type="checkbox" disabled={!programFlagsSupported} checked={form.is_affiliate} onChange={event => update('is_affiliate', event.target.checked)} /> Affiliate</label><label className="admin-check"><input type="checkbox" disabled={!programFlagsSupported} checked={form.is_streamer} onChange={event => update('is_streamer', event.target.checked)} /> Streamer</label><label className="admin-check"><input type="checkbox" disabled={!programFlagsSupported} checked={form.is_auction} onChange={event => update('is_auction', event.target.checked)} /> Auction access</label><label className="admin-check text-red-300"><input type="checkbox" checked={form.is_disabled} onChange={event => update('is_disabled', event.target.checked)} /> Disable account</label></div><div className="border-t border-brand-cardBorder pt-4"><p className="mb-3 text-xs font-bold text-gray-300">Change password <span className="font-normal text-gray-500">(leave blank to keep current)</span></p><div className="grid gap-4 sm:grid-cols-2"><input type="password" placeholder="New password" value={form.password} onChange={event => update('password', event.target.value)} className="admin-modal-input" minLength={8} /><input type="password" placeholder="Confirm new password" value={form.password_confirmation} onChange={event => update('password_confirmation', event.target.value)} className="admin-modal-input" minLength={8} /></div></div>{error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}<div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="rounded-lg border border-brand-cardBorder px-4 py-2 text-xs font-bold text-gray-400 hover:text-white">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-brand-gold px-4 py-2 text-xs font-bold text-brand-dark disabled:opacity-60">{saving ? 'Saving...' : 'Save changes'}</button></div></form></dialog>, document.body);
}

function AdminNewsEditor({ news, onClose, onSaved }: { news: AdminNews | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState({ title: news?.title || '', slug: news?.slug || '', category: news?.category || 'News', author: news?.author || 'GPDS Editorial Team', read_time: news?.readTime || '3 min read', image: news?.image || '/hero-fantasy.png', summary: news?.summary || '', content: news?.content?.join('\n\n') || '', tags: news?.tags?.join(', ') || '', published_at: news ? new Date(news.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10) });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (field: string, value: string) => setForm(current => ({ ...current, [field]: value }));
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, content: form.content.split(/\n\s*\n/).map(item => item.trim()).filter(Boolean), tags: form.tags.split(',').map(item => item.trim()).filter(Boolean) };
      await apiRequest(news ? `/api/admin/news/${news.id}` : '/api/admin/news', { method: news ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      await onSaved();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save news.');
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!news || !window.confirm('Delete this news article?')) return;
    setSaving(true);
    try {
      await apiRequest(`/api/admin/news/${news.id}`, { method: 'DELETE' });
      await onSaved();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete news.');
      setSaving(false);
    }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4"><div className="my-8 w-full max-w-2xl rounded-2xl border border-brand-cardBorder bg-brand-card p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">News management</p><h2 className="mt-1 text-xl font-bold text-white">{news ? 'Edit news article' : 'Add news article'}</h2></div><button type="button" onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close editor">×</button></div><form onSubmit={submit} className="mt-6 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-gray-300">Title<input required value={form.title} onChange={event => update('title', event.target.value)} className="admin-modal-input" /></label><label className="text-xs font-bold text-gray-300">Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={event => update('slug', event.target.value)} className="admin-modal-input" /></label><label className="text-xs font-bold text-gray-300">Category<select value={form.category} onChange={event => update('category', event.target.value)} className="admin-modal-input"><option>News</option><option>Esports</option><option>Patch Notes</option><option>Guides</option></select></label><label className="text-xs font-bold text-gray-300">Author<input required value={form.author} onChange={event => update('author', event.target.value)} className="admin-modal-input" /></label><label className="text-xs font-bold text-gray-300">Read time<input required value={form.read_time} onChange={event => update('read_time', event.target.value)} className="admin-modal-input" /></label><label className="text-xs font-bold text-gray-300">Publish date<input required type="date" value={form.published_at} onChange={event => update('published_at', event.target.value)} className="admin-modal-input" /></label></div><label className="block text-xs font-bold text-gray-300">Image URL or public path<input required value={form.image} onChange={event => update('image', event.target.value)} className="admin-modal-input" placeholder="/blogs/my-news.jpg" /></label><label className="block text-xs font-bold text-gray-300">Summary<textarea required rows={3} value={form.summary} onChange={event => update('summary', event.target.value)} className="admin-modal-input" /></label><label className="block text-xs font-bold text-gray-300">Article paragraphs<textarea required rows={8} value={form.content} onChange={event => update('content', event.target.value)} className="admin-modal-input" placeholder="Separate paragraphs with a blank line" /></label><label className="block text-xs font-bold text-gray-300">Tags<textarea required rows={2} value={form.tags} onChange={event => update('tags', event.target.value)} className="admin-modal-input" placeholder="MLBB, Esports, News" /></label>{error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}<div className="flex flex-wrap justify-between gap-3 pt-2"><div>{news && <button type="button" onClick={remove} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10 disabled:opacity-60"><Trash2 size={14} /> Delete</button>}</div><div className="flex gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-brand-cardBorder px-4 py-2 text-xs font-bold text-gray-400 hover:text-white">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-brand-gold px-4 py-2 text-xs font-bold text-brand-dark disabled:opacity-60">{saving ? 'Saving...' : 'Publish news'}</button></div></div></form></div></div>;
}

function AdminLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md rounded-3xl border border-brand-gold/30 bg-brand-card p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-3">
        <img src={assetUrl('/gpds_logo.png')} alt="GPDS Game Shop" className="h-10 w-auto mx-auto object-contain" />
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-gold">
          <ShieldCheck size={13} /> Admin workspace
        </div>
        <h1 className="font-display text-2xl font-black text-white">Sign in to continue</h1>
        <p className="text-xs leading-relaxed text-gray-400">Use an administrator account to manage the GPDS store.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5 text-xs font-bold text-gray-300">
          Email address
          <span className="relative block">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="admin@example.com" className="w-full rounded-xl border border-brand-cardBorder bg-[#0E0A1C] py-3 pl-10 pr-3.5 text-white outline-none focus:border-brand-gold" />
          </span>
        </label>
        <label className="block space-y-1.5 text-xs font-bold text-gray-300">
          Password
          <span className="relative block">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-brand-cardBorder bg-[#0E0A1C] py-3 pl-10 pr-3.5 text-white outline-none focus:border-brand-gold" />
          </span>
        </label>
        {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-brand-gold py-3.5 font-display text-xs font-black uppercase tracking-wider text-brand-dark shadow-gold-glow transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Signing in...' : 'Sign in to admin'}
        </button>
      </form>

      <Link to="/" className="block text-center text-xs text-gray-500 transition-colors hover:text-brand-gold">Back to storefront</Link>
    </div>
  </main>;
}

function EmptyState({ icon: Icon, title, description }: { icon: typeof ShoppingBag; title: string; description: string }) {
  return <div className="admin-empty"><span><Icon size={28} /></span><h3>{title}</h3><p>{description}</p></div>;
}

function DatabaseRecords({ rows }: { rows: Record<string, unknown>[] }) {
  if (!rows.length) return <p className="admin-empty">No records yet.</p>;
  const columns = Object.keys(rows[0]).filter(key => key !== 'details');
  return <div className="admin-table-scroll"><table><thead><tr>{columns.map(key => <th key={key}>{key.replace(/_/g, ' ')}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={String(row.id)}>{columns.map(key => <td key={key}>{String(row[key] ?? '—')}</td>)}</tr>)}</tbody></table></div>;
}
