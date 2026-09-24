import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Gamepad2, ShoppingBag, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { GAMES, SHOP_PRODUCTS, VOUCHERS } from '../../data/mockData';
import { useRouter } from '../../context/RouterContext';
import { useCurrency } from '../../context/CurrencyContext';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { navigate } = useRouter();
  const { formatPrice } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered from parent or global
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredGames = query.trim()
    ? GAMES.filter(g =>
        g.name.toLowerCase().includes(query.toLowerCase()) ||
        g.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
        g.category.toLowerCase().includes(query.toLowerCase())
      )
    : GAMES.slice(0, 4);

  const filteredProducts = query.trim()
    ? SHOP_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectGame = (slug: string) => {
    onClose();
    navigate(`/games/${slug}`);
  };

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate('/shop');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#141026] border border-brand-gold/40 rounded-2xl shadow-2xl overflow-hidden shadow-brand-gold/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-brand-cardBorder bg-[#1A1532]">
          <Search className="w-5 h-5 text-brand-gold mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search games, vouchers, diamonds, top-ups..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-gray-400 text-sm md:text-base outline-none font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="ml-2 px-2 py-1 text-xs bg-brand-card rounded text-gray-400 hover:text-white border border-brand-cardBorder"
          >
            ESC
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Trending / Matched Games */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              <span className="flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-brand-gold" />
                {query ? 'Games & Top-ups' : 'Popular Games'}
              </span>
              <span className="text-[11px] text-brand-gold">Instant Delivery</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredGames.map(game => (
                <div
                  key={game.id}
                  onClick={() => handleSelectGame(game.slug)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-brand-card/70 hover:bg-brand-gold/10 border border-brand-cardBorder hover:border-brand-gold/50 cursor-pointer transition-all group"
                >
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-11 h-11 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="overflow-hidden grow">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-sm text-white group-hover:text-brand-gold transition-colors truncate">
                        {game.name}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{game.publisher}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {game.discountBadge && (
                        <span className="text-[10px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.2 rounded border border-green-500/20">
                          {game.discountBadge}
                        </span>
                      )}
                      <span className="text-[11px] text-brand-gold font-medium">
                        Starts {formatPrice(game.denominations[0]?.pricePhp || 50)}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-brand-gold group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">
                No games found matching "{query}".
              </div>
            )}
          </div>

          {/* Matched Merch Products */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-brand-cyan" />
                  Shop Items & Merch
                </span>
              </div>
              <div className="space-y-1.5">
                {filteredProducts.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.slug)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-brand-card hover:bg-brand-cyan/10 border border-brand-cardBorder hover:border-brand-cyan/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="text-sm font-semibold text-white">{prod.name}</div>
                        <div className="text-xs text-gray-400">{prod.category}</div>
                      </div>
                    </div>
                    <span className="font-bold text-brand-cyan text-sm">{formatPrice(prod.pricePhp)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-brand-cardBorder/50 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 px-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Tip: Top-ups take 1-5 minutes directly to your UID.</span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/games');
              }}
              className="text-brand-gold hover:underline font-medium"
            >
              Browse all 25+ games →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
