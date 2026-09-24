import React, { useState } from 'react';
import { 
  MessageCircle, 
  Clock, 
  Mail, 
  Send, 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  ShieldCheck 
} from 'lucide-react';
import { apiRequest } from '../context/AuthContext';

const FacebookIcon = () => (
  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [subject, setSubject] = useState('Top-Up Delivery Status');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await apiRequest('/api/support', { method: 'POST', body: JSON.stringify({ name, email, order_number: orderNumber || null, subject, message }) });
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to send your support request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
          <PhoneCall className="w-3.5 h-3.5" /> 24/7 Gamer Assistance
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white">
          Contact GPDS Game Shop
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          Need assistance with an order, partnership inquiry, or technical question? Our dedicated gamer support team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Support Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-6">
            <h3 className="font-display font-bold text-lg text-white">
              Instant Contact Channels
            </h3>

            {/* WhatsApp Card */}
            <a
              href="https://wa.me/639774541147"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 hover:border-green-500/70 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-green-500 text-brand-dark flex items-center justify-center font-bold">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">WhatsApp Priority Support</div>
                  <div className="text-xs text-green-400 font-mono">+63 977 454 1147</div>
                </div>
              </div>
              <span className="text-xs text-green-400 font-bold group-hover:translate-x-1 transition-transform">
                Chat →
              </span>
            </a>

            {/* Facebook Card */}
            <a
              href="https://www.facebook.com/GPDSgameShopPH"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/70 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <FacebookIcon />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Official Facebook Page</div>
                  <div className="text-xs text-blue-400">@GPDSgameShopPH</div>
                </div>
              </div>
              <span className="text-xs text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                Visit →
              </span>
            </a>

            {/* Operating Hours Info */}
            <div className="p-4 rounded-2xl bg-[#0E0A1C] border border-brand-cardBorder space-y-2 text-xs">
              <div className="flex items-center gap-2 text-brand-gold font-bold uppercase">
                <Clock className="w-4 h-4" /> Operating Hours
              </div>
              <p className="text-white font-semibold">6:00 AM – 4:00 AM Philippine Time (PHT)</p>
              <p className="text-gray-400 leading-relaxed">
                22 hours continuous coverage daily. Orders outside of support hours are processed automatically by direct server APIs.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-6">
          <h3 className="font-display font-bold text-xl text-white">Send Us a Direct Message</h3>

          {submitted ? (
            <div className="p-8 text-center space-y-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
              <h4 className="font-display font-bold text-lg text-white">Message Delivered!</h4>
              <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                Thank you for contacting GPDS Game Shop. A customer support representative will email or WhatsApp you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-300 block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl p-3 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300 block">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="gamer@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl p-3 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-300 block">Order ID (If Applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. GPDS-98241"
                    value={orderNumber}
                    onChange={e => setOrderNumber(e.target.value)}
                    className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl p-3 text-white font-mono outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300 block">Inquiry Category</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl p-3 text-white outline-none cursor-pointer"
                  >
                    <option value="Top-Up Delivery Status">Top-Up Delivery Status</option>
                    <option value="Payment Verification">Payment Verification (GCash/Maya)</option>
                    <option value="Partnership & Reseller">Partnership & Reseller Program</option>
                    <option value="Whitelabel Website Creation">Turnkey Website Creation (₱50k)</option>
                    <option value="Account Auction Escrow">Account Auction Escrow</option>
                    <option value="Other Inquiries">Other Inquiries</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your request or question in detail..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl p-3 text-white outline-none"
                />
              </div>

              {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
