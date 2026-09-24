import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  MessageCircle, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { SAMPLE_ORDERS } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';
import { Order } from '../types';

export const OrderTrackPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [searchInput, setSearchInput] = useState('GPDS-98241');
  const [activeOrder, setActiveOrder] = useState<Order | null>(SAMPLE_ORDERS[0]);
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');

    const found = SAMPLE_ORDERS.find(
      o => o.orderNumber.toLowerCase() === searchInput.trim().toLowerCase() ||
           o.userEmail.toLowerCase() === searchInput.trim().toLowerCase() ||
           (o.userPhone && o.userPhone.includes(searchInput.trim()))
    );

    if (found) {
      setActiveOrder(found);
    } else {
      setSearchError(`No order found matching "${searchInput}". Try demo order GPDS-98241, GPDS-98242, or GPDS-98243.`);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
          <Clock className="w-3.5 h-3.5" /> Real-Time Gateway Tracker
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
          Track Your Top-Up Order
        </h1>
        <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
          Enter your GPDS Order ID, email address, or mobile number to view live top-up dispatch and server status.
        </p>
      </div>

      {/* Search Bar & Demo Quick Links */}
      <div className="space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative grow">
            <Search className="w-5 h-5 text-brand-gold absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. GPDS-98241) or email..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full bg-brand-card border border-brand-cardBorder focus:border-brand-gold rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white font-medium placeholder-gray-500 outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-2xl shadow-gold-glow hover:opacity-95 transition-all shrink-0"
          >
            Track Order
          </button>
        </form>

        {/* Demo Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <span>Quick Demo Test:</span>
          {SAMPLE_ORDERS.map(o => (
            <button
              key={o.id}
              onClick={() => {
                setSearchInput(o.orderNumber);
                setActiveOrder(o);
                setSearchError('');
              }}
              className={`px-3 py-1 rounded-lg border text-[11px] font-mono font-bold transition-colors ${
                activeOrder?.id === o.id
                  ? 'bg-brand-gold text-brand-dark border-brand-gold'
                  : 'bg-brand-card text-gray-300 border-brand-cardBorder hover:border-brand-gold/40'
              }`}
            >
              {o.orderNumber} ({o.status})
            </button>
          ))}
        </div>

        {searchError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Active Order Progress Stepper */}
      {activeOrder && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-6">
            
            {/* Order Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-cardBorder">
              <div className="flex items-center gap-4">
                <img
                  src={activeOrder.gameIcon}
                  alt={activeOrder.gameName}
                  className="w-14 h-14 rounded-2xl object-cover border border-brand-gold/40 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-lg text-white">
                      {activeOrder.orderNumber}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      activeOrder.status === 'COMPLETED'
                        ? 'bg-green-500/15 text-green-400 border-green-500/30'
                        : activeOrder.status === 'PROCESSING'
                        ? 'bg-brand-gold/15 text-brand-gold border-brand-gold/30 animate-pulse'
                        : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                    }`}>
                      {activeOrder.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {activeOrder.gameName} • <strong className="text-brand-gold">{activeOrder.itemName}</strong>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-gray-400 uppercase font-bold block">Total Paid</span>
                <span className="text-xl font-display font-black text-brand-gold">
                  {formatPrice(activeOrder.totalPhp)}
                </span>
              </div>
            </div>

            {/* Visual 5-Stage Stepper */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Live Dispatch Timeline
              </h3>

              <div className="space-y-4">
                {activeOrder.statusHistory.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        h.done
                          ? 'bg-green-500 text-brand-dark shadow-md shadow-green-500/20'
                          : 'bg-brand-cardBorder text-gray-400'
                      }`}>
                        {h.done ? <CheckCircle2 className="w-5 h-5 text-brand-dark" /> : idx + 1}
                      </div>
                      {idx < activeOrder.statusHistory.length - 1 && (
                        <div className={`w-0.5 h-10 ${h.done ? 'bg-green-500/60' : 'bg-brand-cardBorder'}`} />
                      )}
                    </div>

                    <div className="grow pt-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-sm ${h.done ? 'text-white' : 'text-gray-400'}`}>
                          {h.title}
                        </h4>
                        <span className="text-xs font-mono text-gray-500">{h.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{h.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Receipt Breakdown */}
            <div className="p-5 rounded-2xl bg-[#0E0A1C] border border-brand-cardBorder space-y-3 text-xs">
              <div className="font-bold text-white uppercase tracking-wider pb-2 border-b border-brand-cardBorder flex items-center justify-between">
                <span>Receipt Breakdown</span>
                <span className="font-mono text-gray-500 text-[10px]">{activeOrder.txHash || 'TX-PENDING'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500 block">Recipient Game UID:</span>
                  <span className="font-mono font-bold text-white">
                    {activeOrder.userId} {activeOrder.serverId ? `(${activeOrder.serverId})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Payment Method:</span>
                  <span className="font-semibold text-white">{activeOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Customer Email:</span>
                  <span className="text-white">{activeOrder.userEmail}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Date & Time Created:</span>
                  <span className="text-white font-mono">{activeOrder.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-3 rounded-xl bg-brand-card hover:bg-brand-cardLight border border-brand-cardBorder text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" /> Download / Print Receipt
              </button>

              <a
                href={`https://wa.me/639774541147?text=Hi%20GPDS%20Support!%20I%20have%20an%20inquiry%20regarding%20Order%20${activeOrder.orderNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center"
              >
                <MessageCircle className="w-4 h-4" /> Support on WhatsApp
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
