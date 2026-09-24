import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogOut } from 'lucide-react';

export function SignOutModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => Promise<void> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); if (previous?.isConnected) previous.focus(); };
  }, []);
  return createPortal(<dialog ref={dialog} aria-labelledby="signout-title" aria-describedby="signout-description" onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }} className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-purple-400/30 bg-[#19152b] p-6 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm">
    <div className="mb-4 inline-flex rounded-2xl bg-purple-500/15 p-3 text-purple-300"><LogOut size={26} /></div>
    <h2 id="signout-title" className="text-xl font-bold">Sign out?</h2>
    <p id="signout-description" className="mt-2 text-sm text-gray-300">You’ll need to sign in again to access your account.</p>
    {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
    <div className="mt-6 flex gap-3"><button type="button" autoFocus disabled={busy} onClick={onCancel} className="flex-1 rounded-xl border border-white/20 px-4 py-3 disabled:opacity-50">Cancel</button><button type="button" disabled={busy} onClick={async () => {
      if (busy) return;
      setBusy(true); setError('');
      try { await onConfirm(); } catch { setError('Unable to sign out. Please try again.'); setBusy(false); }
    }} className="flex-1 rounded-xl bg-purple-600 px-4 py-3 font-bold disabled:opacity-50">{busy ? 'Signing out…' : 'Sign out'}</button></div>
  </dialog>, document.body);
}
