import { useEffect, useState } from 'react';
import { apiRequest } from '../../context/AuthContext';
type DemoOrder = { reference: string; user_id: number; created_at: string; details: { game: string; package: string; quantity: number; payment: string; total_centavos: number; account: Record<string, string>; coupon?: string } };
export function DemoOrders({ admin = false }: { admin?: boolean }) {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); setError(''); apiRequest('/api/demo-orders' + (admin ? '?admin=1' : '')).then(data => setOrders(data.orders)).catch(e => setError(e.message)).finally(() => setLoading(false)); };
  useEffect(load, [admin]);
  return <section className="rounded-2xl border border-purple-400/30 p-5 my-5 space-y-3"><h2 className="text-xl font-bold">Demo purchase records</h2><p className="text-sm text-gray-400">Simulated purchases only. No charges or fulfillment. Excluded from sales reports. Latest 100 records.</p><button type="button" onClick={load} disabled={loading}>Refresh</button>{error && <p role="alert">{error}</p>}{loading ? <p>Loading…</p> : !orders.length && !error ? <p>No demo purchases yet.</p> : orders.map(order => <details key={order.reference} className="rounded-xl border border-white/10 p-3"><summary className="cursor-pointer break-words">{order.details.game} · {order.details.package} × {order.details.quantity} — Demo completed</summary><p className="break-all mt-3 text-xs">{order.reference}</p><p>{order.created_at}{admin ? ` · User #${order.user_id}` : ''}</p><p>Simulated {order.details.payment} · PHP {(order.details.total_centavos / 100).toFixed(2)}{order.details.coupon ? ' · ' + order.details.coupon : ''}</p>{Object.entries(order.details.account).map(([key, value]) => <p className="break-words" key={key}>{key}: {value}</p>)}</details>)}</section>;
}
