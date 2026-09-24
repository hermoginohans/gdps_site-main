import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { apiRequest } from '../../context/AuthContext';
import { ChatReply } from './ChatReply';

type Message = { role: 'user' | 'assistant'; content: string };
export function SalesChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const field = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) field.current?.focus(); }, [open]);
  useEffect(() => { if (open) end.current?.scrollIntoView({ block: 'nearest' }); }, [messages, busy, open]);
  const close = () => { setOpen(false); launcher.current?.focus(); };
  return <div className="fixed bottom-24 right-4 z-50 sm:bottom-6 sm:right-6">
    {open && <section role="dialog" aria-label="GPDS AI sales assistant" onKeyDown={event => { if (event.key === 'Escape') close(); }} className="mb-3 flex w-[min(380px,calc(100vw-2rem))] h-[min(520px,65dvh)] flex-col overflow-hidden rounded-2xl border border-purple-400/40 bg-[#161329] text-white shadow-2xl">
      <header className="flex items-center justify-between border-b border-white/10 p-4"><div><h2 className="font-bold">GPDS AI assistant</h2><p className="text-xs text-gray-400">Game recommendations & shop help</p></div><button type="button" aria-label="Close chat" onClick={close}><X size={20} /></button></header>
      <div className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-live="polite">{!messages.length && <p className="text-sm text-gray-300">Hi! What game are you topping up today?</p>}{messages.map((message, i) => <p key={i} className={`whitespace-pre-wrap break-words rounded-xl p-3 text-sm ${message.role === 'user' ? 'ml-6 bg-purple-600/40' : 'mr-3 bg-white/5'}`}><span className="sr-only">{message.role === 'user' ? 'You: ' : 'AI: '}</span>{message.role === 'assistant' ? <ChatReply text={message.content} /> : message.content}</p>)}{busy && <p className="text-sm text-gray-400">Thinking…</p>}<div ref={end} /></div>
      {error && <p role="alert" className="px-4 text-sm text-amber-200">{error}</p>}
      <a href="https://wa.me/639774541147" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs text-green-300">Talk to our team on WhatsApp ↗</a>
      <form className="flex gap-2 border-t border-white/10 p-3" onSubmit={async event => {
        event.preventDefault(); if (busy || !input.trim()) return;
        const content = input.trim(); const next: Message[] = [...messages.slice(-8), { role: 'user', content }];
        setMessages(next); setInput(''); setError(''); setBusy(true);
        try { const result = await apiRequest('/api/sales-chat', { method: 'POST', body: JSON.stringify({ messages: next }) }); setMessages([...next, { role: 'assistant', content: result.reply }]); }
        catch (e) { setError(e instanceof Error ? e.message : 'Unable to connect. Try again.'); setMessages(next.slice(0, -1)); setInput(content); }
        finally { setBusy(false); }
      }}><input ref={field} aria-label="Your message" value={input} disabled={busy} maxLength={1500} onChange={event => setInput(event.target.value)} placeholder="Ask about a game…" className="min-w-0 flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm" /><button type="submit" aria-label="Send message" disabled={busy || !input.trim()} className="rounded-lg bg-purple-600 p-3 disabled:opacity-40"><Send size={18} /></button></form>
      <p className="px-3 pb-3 text-[10px] text-gray-400">AI can make mistakes. Messages are sent to OpenAI. Don’t share passwords or payment details.</p>
    </section>}
    <button type="button" ref={launcher} aria-expanded={open} aria-label={open ? 'Close AI chat' : 'Open AI chat'} onClick={() => open ? close() : setOpen(true)} className="ml-auto flex items-center gap-2 rounded-full border border-purple-300/30 bg-purple-600 px-5 py-3 font-bold text-white shadow-xl"><MessageCircle size={22} />Ask GPDS AI</button>
  </div>;
}
