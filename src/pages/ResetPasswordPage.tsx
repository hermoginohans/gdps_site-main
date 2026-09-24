import { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../context/AuthContext';
import { Link, useRouter } from '../context/RouterContext';
import { assetUrl } from '../utils/assets';

export function ResetPasswordPage() {
  const { navigate } = useRouter();
  const query = new URLSearchParams(window.location.search);
  const [email, setEmail] = useState(query.get('email') || '');
  const [token] = useState(query.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await apiRequest('/api/reset-password', { method: 'POST', body: JSON.stringify({ email, token, password, password_confirmation: confirmation }) });
      setMessage('Your password has been reset. You can now sign in.');
      setPassword('');
      setConfirmation('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'This reset link is invalid or expired.');
    } finally {
      setBusy(false);
    }
  };

  return <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
    <section className="w-full space-y-6 rounded-3xl border border-brand-cardBorder bg-brand-card p-6 shadow-2xl sm:p-8">
      <div className="text-center"><Link to="/" aria-label="GPDS GAME SHOP home"><img src={assetUrl('/gpds_logo.png')} alt="GPDS GAME SHOP" className="mx-auto h-11 w-auto object-contain" /></Link><h1 className="mt-5 text-2xl font-display font-black text-white">Create a new password</h1><p className="mt-2 text-xs text-gray-400">Choose a strong password for your GPDS account.</p></div>
      <form onSubmit={submit} className="space-y-4 text-xs">
        <label className="block space-y-1 font-bold text-gray-300">Email<input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="dashboard-wallet-input mt-1" /></label>
        <label className="block space-y-1 font-bold text-gray-300">New password<span className="relative block"><Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input required minLength={8} type="password" value={password} onChange={event => setPassword(event.target.value)} className="dashboard-wallet-input pl-9" /></span></label>
        <label className="block space-y-1 font-bold text-gray-300">Confirm password<input required minLength={8} type="password" value={confirmation} onChange={event => setConfirmation(event.target.value)} className="dashboard-wallet-input mt-1" /></label>
        {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">{error}</p>}
        {message && <p role="status" className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-green-300">{message}</p>}
        <button type="submit" disabled={busy || !token} className="w-full rounded-xl bg-brand-gold py-3.5 font-display font-black uppercase tracking-wider text-brand-dark disabled:opacity-50">{busy ? 'Resetting...' : 'Reset password'}</button>
      </form>
      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400"><ShieldCheck size={15} className="text-green-400" /> Reset links expire for security.</div>
      <button type="button" onClick={() => navigate('/login')} className="w-full text-center text-xs text-gray-400 hover:text-white">Back to sign in</button>
    </section>
  </main>;
}
