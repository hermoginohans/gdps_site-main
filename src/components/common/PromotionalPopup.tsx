import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { apiRequest } from '../../context/AuthContext';

export type Promotion = { enabled: boolean; image_only?: boolean; title: string; message: string; image_url: string; button_label: string; button_url: string; revision?: string };
const safeUrl = (url: string) => { try { return new URL(url).protocol === 'https:'; } catch { return false; } };
export function PromotionDialog({ promotion, onClose }: { promotion: Promotion; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); previous?.focus(); };
  }, []);
  if (promotion.image_only && safeUrl(promotion.image_url)) return createPortal(<dialog ref={dialog} onCancel={event => { event.preventDefault(); onClose(); }} aria-label={promotion.title} className="m-auto max-w-[calc(100vw-2rem)] max-h-[90dvh] rounded-2xl border border-white/30 bg-black p-0 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm">
    <button type="button" autoFocus onClick={onClose} aria-label="Close promotion" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-black/80 text-2xl text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300">×</button>
    {safeUrl(promotion.button_url) ? <a href={promotion.button_url} aria-label={promotion.button_label || promotion.title} onClick={onClose}><img src={promotion.image_url} alt={promotion.title} style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: 'min(640px, calc(100vw - 2rem))', maxHeight: '90dvh' }} /></a> : <img src={promotion.image_url} alt={promotion.title} style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: 'min(640px, calc(100vw - 2rem))', maxHeight: '90dvh' }} />}
  </dialog>, document.body);
  return createPortal(<dialog ref={dialog} onCancel={event => { event.preventDefault(); onClose(); }} aria-labelledby="promotion-title" className="m-auto w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-gold/40 bg-brand-card text-white p-0 backdrop:bg-black/75">
    <button type="button" autoFocus onClick={onClose} aria-label="Close promotion" className="absolute right-3 top-3 z-10 rounded-full bg-black/80 px-3 py-2 text-white">✕</button>
    {safeUrl(promotion.image_url) && <img src={promotion.image_url} alt="" className="w-full max-h-80 object-contain" />}
    <div className="p-6 space-y-4"><p className="text-xs uppercase tracking-widest text-brand-gold">Special offer</p><h2 id="promotion-title" className="text-2xl font-bold pr-8">{promotion.title}</h2><p className="whitespace-pre-wrap text-gray-300">{promotion.message}</p>{promotion.button_label && safeUrl(promotion.button_url) && <a href={promotion.button_url} onClick={onClose} className="inline-block rounded-xl bg-brand-gold px-5 py-3 font-bold text-black">{promotion.button_label}</a>}</div>
  </dialog>, document.body);
}
export function PromotionalPopup() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  useEffect(() => {
    let active = true;
    apiRequest('/api/promotion').then(data => {
      if (!active || !data.promotion) return;
      try { if (sessionStorage.getItem('gpds-promotion-dismissed') === data.promotion.revision) return; } catch { /* Storage may be disabled. */ }
      setPromotion(data.promotion);
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  if (!promotion) return null;
  return <PromotionDialog promotion={promotion} onClose={() => {
    try { sessionStorage.setItem('gpds-promotion-dismissed', promotion.revision ?? ''); } catch { /* Closing still works without storage. */ }
    setPromotion(null);
  }} />;
}
