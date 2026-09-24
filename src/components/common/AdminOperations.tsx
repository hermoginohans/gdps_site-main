import { useEffect, useState } from 'react';
import { Wallet, Filter, ArrowUpRight } from 'lucide-react';
import { apiRequest } from '../../context/AuthContext';
import { Link } from '../../context/RouterContext';
import './AdminOperations.css';
type Report = { period: { orders: number; turnoverCentavos: number | null }; today: { orders: number; turnoverCentavos: number | null }; pending: number; users: number; newUsers: number; products: number };
const providers = ['LapalGaming', 'VexGame', 'OneOne', 'Razer Gold', 'Aigan', 'Nexone', 'IDSL', 'BambooCard', 'Ushopcenter'];
const money = (value: number | null) => value === null ? 'Unavailable' : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value / 100);
export function AdminOperations() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [period, setPeriod] = useState({ month, year });
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; setReport(null); setError(''); apiRequest(`/api/admin/report?month=${period.month}&year=${period.year}`).then(data => { if (active) setReport(data); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, [period]);
  const metrics = [
    { label: 'Orders count', value: report?.period.orders, detail: report ? `${report.today.orders} orders today` : 'Loading…' },
    { label: 'Turnover', value: report ? money(report.period.turnoverCentavos) : undefined, detail: report ? `${money(report.today.turnoverCentavos)} today` : 'Loading…' },
    { label: 'Gross profit', value: '—', detail: 'Provider costs not connected' },
    { label: 'Net profit', value: '—', detail: 'Costs and fees not connected' },
    { label: 'Gateway fees', value: '—', detail: 'Order and deposit fees unavailable' },
    { label: 'VAT on fees', value: '—', detail: 'Tax configuration required' },
    { label: 'Total users', value: report?.users, detail: report ? `${report.newUsers} new in selected month` : 'Loading…' },
    { label: 'Total products', value: report?.products, detail: 'Current catalog total' },
  ];
  return <div className="admin-operations">
    <form className="admin-period-filter admin-panel" onSubmit={e => { e.preventDefault(); setPeriod({ month, year }); }}>
      <label>Month<select value={month} onChange={e => setMonth(Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(2026, i).toLocaleString('en', { month: 'long' })}</option>)}</select></label>
      <label>Year<input type="number" min="2000" max="2100" required value={year} onChange={e => setYear(Number(e.target.value))} /></label><button type="submit"><Filter size={15} />Filter</button>
    </form>
    {error && <p role="alert">{error}</p>}
    <div className="admin-provider-grid">{providers.map((name, i) => <article key={name} className={`admin-provider-card provider-${i}`}><div><span className="admin-provider-icon"><Wallet size={21} /></span><h3>{name}<strong>Balance unavailable</strong></h3><span className="admin-provider-status">Not connected</span></div><p>Orders fulfilled via {name} deduct from this wallet.</p></article>)}</div>
    <div className="admin-operations-links"><Link to="/admin/orders">View orders <ArrowUpRight size={14} /></Link><Link to="/admin/products">Manage products <ArrowUpRight size={14} /></Link><Link to="/admin/users">Manage users <ArrowUpRight size={14} /></Link><Link to="/admin/payments">View payments <ArrowUpRight size={14} /></Link><span>{report ? `${report.pending} pending orders` : 'Loading pending orders…'}</span></div>
    <p className="admin-report-caption">{new Date(period.year, period.month - 1).toLocaleString('en', { month: 'long', year: 'numeric' })} · Asia/Manila · Turnover uses completed payments and their update date.</p>
    <div className="admin-financial-grid">{metrics.map((metric, i) => <article className={`admin-financial-card metric-${i}`} key={metric.label}><h3>{metric.label}</h3><strong>{metric.value ?? (error ? 'Unavailable' : '…')}</strong><p>{metric.detail}</p></article>)}</div>
    <section className="admin-panel admin-today"><h2>Today’s summary</h2><div>{[{ label: 'Orders', value: report?.today.orders }, { label: 'Turnover', value: report ? money(report.today.turnoverCentavos) : undefined }, ...['Gross profit', 'Gateway fees', 'VAT on fees', 'Net profit'].map(label => ({ label, value: 'Not connected' }))].map(item => <div key={item.label}><span>{item.label}</span><strong>{item.value ?? '…'}</strong></div>)}</div></section>
    {!!report?.pending && <Link to="/admin/orders" className="admin-pending-alert">{report.pending} pending orders require your attention. <span>View orders →</span></Link>}
  </div>;
}
