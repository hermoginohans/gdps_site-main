import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Star, 
  AlertCircle,
  X,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { AUCTION_ITEMS } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { AuctionItem } from '../types';

export const AuctionPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();

  const [auctions, setAuctions] = useState<AuctionItem[]>(AUCTION_ITEMS);
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [bidAmountInput, setBidAmountInput] = useState<number>(0);
  const [bidSuccessMessage, setBidSuccessMessage] = useState('');
  const [bidError, setBidError] = useState('');

  // When selecting an auction, default bid to minimum next bid
  useEffect(() => {
    if (selectedAuction) {
      setBidAmountInput(selectedAuction.minNextBidPhp);
      setBidError('');
      setBidSuccessMessage('');
    }
  }, [selectedAuction]);

  const handleOpenBidModal = (item: AuctionItem) => {
    setSelectedAuction(item);
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction) return;

    if (bidAmountInput < selectedAuction.minNextBidPhp) {
      setBidError(`Bid must be at least ${formatPrice(selectedAuction.minNextBidPhp)}`);
      return;
    }

    // Update auction item state
    const updatedAuctions = auctions.map(item => {
      if (item.id === selectedAuction.id) {
        const newBidHistory = [
          {
            bidder: user?.name ? `${user.name.slice(0, 4)}***` : 'You (Gamer)',
            amountPhp: bidAmountInput,
            timeAgo: 'Just now'
          },
          ...item.bidHistory
        ];
        return {
          ...item,
          currentBidPhp: bidAmountInput,
          minNextBidPhp: bidAmountInput + 250,
          bidsCount: item.bidsCount + 1,
          bidHistory: newBidHistory
        };
      }
      return item;
    });

    setAuctions(updatedAuctions);
    setSelectedAuction(prev => prev ? {
      ...prev,
      currentBidPhp: bidAmountInput,
      minNextBidPhp: bidAmountInput + 250,
      bidsCount: prev.bidsCount + 1,
      bidHistory: [
        {
          bidder: user?.name ? `${user.name.slice(0, 4)}***` : 'You (Gamer)',
          amountPhp: bidAmountInput,
          timeAgo: 'Just now'
        },
        ...prev.bidHistory
      ]
    } : null);

    setBidSuccessMessage(`Bid placed successfully for ${formatPrice(bidAmountInput)}! You are now the highest bidder.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#20153B] via-[#141026] to-[#20153B] border border-brand-gold/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Live Escrow Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
            Gaming Accounts & Collectible Auctions
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Bid on verified high-tier Mobile Legends, Honor of Kings, and Valorant accounts. 100% clean-bind guarantees protected by GPDS Escrow System.
          </p>
        </div>
      </div>

      {/* Auction Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map(item => (
          <div
            key={item.id}
            className="rounded-3xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/60 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-gold/10 group"
          >
            <div>
              {/* Media Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/10">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-red-600/90 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-lg">
                  <Clock className="w-3 h-3 animate-spin" /> LIVE AUCTION
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-lg">
                  {item.bidsCount} Bids
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {item.badges.map(b => (
                  <span key={b} className="text-[10px] font-bold text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/25">
                    {b}
                  </span>
                ))}
              </div>

              <h3 className="font-display font-bold text-base text-white group-hover:text-brand-gold transition-colors line-clamp-2 mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            {/* Bid info footer */}
            <div className="pt-4 border-t border-brand-cardBorder space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase font-semibold">Current Highest Bid</span>
                  <span className="text-xl font-display font-black text-brand-gold">
                    {formatPrice(item.currentBidPhp)}
                  </span>
                </div>

                {item.buyNowPricePhp && (
                  <div className="text-right">
                    <span className="block text-[10px] text-gray-400 uppercase font-semibold">Buy Now</span>
                    <span className="text-sm font-bold text-white">
                      {formatPrice(item.buyNowPricePhp)}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenBidModal(item)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-gold-glow transition-all flex items-center justify-center gap-2"
              >
                <Gavel className="w-4 h-4" /> Place Bid (Min {formatPrice(item.minNextBidPhp)})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Bidding Drawer/Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#151125] border border-brand-gold/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-brand-cardBorder">
              <div>
                <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider">
                  {selectedAuction.game}
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  Place Your Escrow Bid
                </h3>
              </div>
              <button
                onClick={() => setSelectedAuction(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Price Banner */}
            <div className="p-4 rounded-2xl bg-brand-card border border-brand-cardBorder flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Current Leader Bid</span>
                <span className="text-2xl font-display font-black text-brand-gold">
                  {formatPrice(selectedAuction.currentBidPhp)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">Minimum Allowed Bid</span>
                <span className="text-sm font-bold text-white">
                  {formatPrice(selectedAuction.minNextBidPhp)}
                </span>
              </div>
            </div>

            {/* Bidding Form */}
            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Enter Your Bid Amount (PHP)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold font-bold text-base">₱</span>
                  <input
                    type="number"
                    value={bidAmountInput}
                    onChange={e => setBidAmountInput(Number(e.target.value))}
                    min={selectedAuction.minNextBidPhp}
                    step={100}
                    className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl pl-9 pr-4 py-3 text-base text-white font-mono font-bold outline-none"
                  />
                </div>
              </div>

              {/* Quick Bid Increment Buttons */}
              <div className="flex gap-2">
                {[250, 500, 1000].map(inc => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setBidAmountInput(selectedAuction.currentBidPhp + inc)}
                    className="flex-1 py-2 rounded-xl bg-brand-card hover:bg-brand-gold/15 border border-brand-cardBorder hover:border-brand-gold/40 text-xs font-semibold text-gray-300 hover:text-brand-gold transition-colors"
                  >
                    +{formatPrice(inc)}
                  </button>
                ))}
              </div>

              {bidError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bidError}</span>
                </div>
              )}

              {bidSuccessMessage && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{bidSuccessMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:opacity-95 transition-all"
              >
                Confirm & Submit Bid • {formatPrice(bidAmountInput)}
              </button>
            </form>

            {/* Live Bid History Log */}
            <div className="space-y-2 pt-2 border-t border-brand-cardBorder">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Recent Bid History ({selectedAuction.bidHistory.length})
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {selectedAuction.bidHistory.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-brand-card/50 text-xs">
                    <span className="font-medium text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                      {b.bidder}
                    </span>
                    <span className="text-gray-400 text-[11px]">{b.timeAgo}</span>
                    <span className="font-mono font-bold text-brand-gold">{formatPrice(b.amountPhp)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              Funds held securely in GPDS Escrow until buyer inspects and approves account bind.
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
