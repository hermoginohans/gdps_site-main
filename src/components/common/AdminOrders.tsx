import { useEffect, useState } from 'react';
import { apiRequest } from '../../context/AuthContext';

type Order = { id: number; code: string; status: string; qty: number; total_price: string; currency_code: string; created_at: string; customer_name: string | null; customer_email: string | null; game: string | null; denomination: string | null; cust_account?: string; provider?: string; provider_ref?: string };
type History = { id: number; status: string; type: string; note: string | null; created_at: string };
type Page = { data: Order[]; total: number; current_page: number; last_page: number };
const statuses = ['pending', 'on-process', 'success', 'failed', 'delay', 'expired', 'refunded'];
const amount = (order: Order) => `${order.currency_code} ${Number(order.total_price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function AdminOrders() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [filter, setFilter] = useState({ search: '', status: '', page: 1 });
  const [page, setPage] = useState<Page | null>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [detail, setDetail] = useState<{ order: Order; history: History[] } | null>(null);
  const [detailError, setDetailError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setPage(null); setError('');
    const query = new URLSearchParams({ search: filter.search, status: filter.status, page: String(filter.page) });
    apiRequest(`/api/admin/orders?${query}`, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setPage(data); })
      .catch(() => { if (!controller.signal.aborted) setError('Unable to load orders.'); });
    return () => controller.abort();
  }, [filter, retry]);
  useEffect(() => {
    setDetail(null); setDetailError('');
    if (selected === null) return;
    const controller = new AbortController();
    apiRequest(`/api/admin/orders/${selected}`, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setDetail(data); })
      .catch(() => { if (!controller.signal.aborted) setDetailError('Unable to load this order.'); });
    return () => controller.abort();
  }, [selected, retry]);

  return <section className="admin-panel space-y-5">
    <h2>Orders</h2>
    <form className="flex flex-wrap gap-3" onSubmit={event => { event.preventDefault(); setSelected(null); setFilter({ search: search.trim(), status, page: 1 }); }}>
      <input className="admin-modal-input" aria-label="Search orders" placeholder="Order code, customer, email or game" maxLength={255} value={search} onChange={event => setSearch(event.target.value)} />
      <select className="admin-modal-input" aria-label="Order status" value={status} onChange={event => setStatus(event.target.value)}><option value="">All statuses</option>{statuses.map(value => <option key={value} value={value}>{value}</option>)}</select>
      <button type="submit" className="account-gold-button">Search</button>
      <button type="button" onClick={() => { setSearch(''); setStatus(''); setSelected(null); setFilter({ search: '', status: '', page: 1 }); }}>Clear</button>
    </form>
    {error ? <p role="alert">{error} <button onClick={() => setRetry(value => value + 1)}>Retry</button></p> : !page ? <p role="status">Loading orders…</p> : <>
      <p>{page.total.toLocaleString()} matching orders</p>
      <div className="admin-table-scroll"><table><thead><tr>{['Order', 'Customer', 'Game / item', 'Quantity', 'Amount', 'Status', 'Created', 'Action'].map(label => <th key={label}>{label}</th>)}</tr></thead>
        <tbody>{page.data.map(order => <tr key={order.id}>
          <td>{order.code}</td><td>{order.customer_name || 'Guest'}<br />{order.customer_email}</td>
          <td>{order.game || 'Unavailable'}<br />{order.denomination}</td><td>{order.qty}</td><td>{amount(order)}</td><td>{order.status}</td><td>{order.created_at}</td>
          <td><button className="admin-text-link" onClick={() => setSelected(order.id)} aria-expanded={selected === order.id}>View details</button></td>
        </tr>)}</tbody></table></div>
      {!page.data.length && <p>No orders match your filters.</p>}
      <div className="flex gap-4 items-center"><button disabled={page.current_page <= 1} onClick={() => setFilter(current => ({ ...current, page: current.page - 1 }))}>Previous</button><span>Page {page.current_page} of {page.last_page}</span><button disabled={page.current_page >= page.last_page} onClick={() => setFilter(current => ({ ...current, page: current.page + 1 }))}>Next</button></div>
    </>}
    {selected !== null && <section className="border border-brand-cardBorder rounded-xl p-5 space-y-3" aria-label="Order details" aria-live="polite">
      <button className="admin-text-link" onClick={() => setSelected(null)}>Close details</button>
      {detailError ? <p role="alert">{detailError} <button onClick={() => setRetry(value => value + 1)}>Retry</button></p> : !detail ? <p>Loading details…</p> : <>
        <h3 className="font-bold">Order {detail.order.code}</h3>
        <p>{detail.order.game} · {detail.order.denomination} · {amount(detail.order)} · {detail.order.status}</p>
        <p className="break-words">Game account: {detail.order.cust_account || 'Not recorded'}</p>
        <p className="break-words">Provider: {detail.order.provider || 'Not recorded'} · Reference: {detail.order.provider_ref || 'Not recorded'}</p>
        <h4 className="font-bold">Order history</h4>
        {detail.history.length ? <ol className="space-y-3">{detail.history.map(item => <li key={item.id} className="border-l-2 border-brand-gold pl-3"><p>{item.created_at} · {item.status} · {item.type}</p><p className="whitespace-pre-wrap break-words">{item.note}</p></li>)}</ol> : <p>No history recorded.</p>}
      </>}
    </section>}
  </section>;
}
