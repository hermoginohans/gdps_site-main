import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Gamepad2, 
  Star, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  SlidersHorizontal 
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { useCurrency } from '../context/CurrencyContext';
import { useRouter } from '../context/RouterContext';
import { GameCategory } from '../types';
import { assetUrl } from '../utils/assets';

export const GamesPage: React.FC = () => {
  const { products, loading, error, openProduct } = useCatalog();
  const GAMES = useMemo(() => products.map(product => ({ ...product, image: product.picture, publisher: 'GPDS Game Shop', deliveryTime: 'See product details', tags: [product.category], platform: ['Mobile', 'PC', 'Console'], denominations: [{pricePhp: product.minPrice}], discountBadge: product.discountTag })), [products]);
  const { formatPrice } = useCurrency();
  const { navigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');

  const categories: GameCategory[] = [
    'All',
    'Trending Games',
    'Mobile Legends',
    'New Release',
    'PC Games',
    'Voucher',
    'Others'
  ];

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesSearch = 
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        selectedCategory === 'All' 
          ? true 
          : selectedCategory === 'Mobile Legends'
          ? game.slug === 'mobile-legends'
          : game.category === selectedCategory;

      const matchesPlatform = 
        selectedPlatform === 'All'
          ? true
          : game.platform.includes(selectedPlatform as any);

      return matchesSearch && matchesCategory && matchesPlatform;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return (a.denominations[0]?.pricePhp || 0) - (b.denominations[0]?.pricePhp || 0);
      if (sortBy === 'price-desc') return (b.denominations[0]?.pricePhp || 0) - (a.denominations[0]?.pricePhp || 0);
      return 0;
    });
  }, [GAMES, searchQuery, selectedCategory, selectedPlatform, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {loading && <p>Loading catalog…</p>}{error && <p role="alert">Catalog unavailable. Please try again later.</p>}
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#1D1635] via-[#141026] to-[#1D1635] border border-brand-cardBorder relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
            <Gamepad2 className="w-3.5 h-3.5" /> Instant Delivery Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
            Official Gaming Top-Ups & Vouchers
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Select your game, enter your User ID & Zone ID, choose your diamond or token pack, and pay in seconds via GCash, Maya, or QRPH.
          </p>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-gold/10 to-transparent pointer-events-none hidden lg:block" />
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-brand-gold absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by game name, publisher, tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-brand-card border border-brand-cardBorder focus:border-brand-gold/60 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Sort & Platform dropdowns */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-brand-card border border-brand-cardBorder text-white text-xs font-semibold rounded-xl px-3 py-2.5 outline-none focus:border-brand-gold cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Lowest Price First</option>
              <option value="price-desc">Highest Price First</option>
            </select>

            <select
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value)}
              className="bg-brand-card border border-brand-cardBorder text-white text-xs font-semibold rounded-xl px-3 py-2.5 outline-none focus:border-brand-gold cursor-pointer"
            >
              <option value="All">All Platforms</option>
              <option value="Mobile">Mobile Only</option>
              <option value="PC">PC Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                  : 'bg-brand-card hover:bg-brand-cardLight text-gray-400 hover:text-white border border-brand-cardBorder'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Games Catalog Grid */}
      <div className="space-y-4">
        <div className="text-xs text-gray-400 font-semibold">
          Showing <span className="text-white font-bold">{filteredGames.length}</span> games and digital products
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGames.map(game => (
            <div
              key={game.id}
              onClick={() => openProduct(game)}
              className="group relative rounded-2xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/60 p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-gold/10 flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 border border-white/10">
                <img
                  src={game.image}
                  alt={game.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = assetUrl('/steam-wallet-card.svg');
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {game.discountBadge && (
                  <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-display font-black text-[10px] px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
                    {game.discountBadge}
                  </div>
                )}

                <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-[10px] text-gray-300 px-2 py-0.5 rounded font-medium">
                  {game.deliveryTime}
                </div>
              </div>

              {/* Game Meta */}
              <div className="space-y-1 grow">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span className="truncate">{game.publisher}</span>
                  <span className="flex items-center gap-0.5 text-brand-gold font-bold">
                    <Star className="w-3 h-3 fill-current" /> {game.rating}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-brand-gold transition-colors line-clamp-1">
                  {game.name}
                </h3>

                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-3 pt-3 border-t border-brand-cardBorder flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase">Starts at</span>
                  <span className="text-xs sm:text-sm font-display font-extrabold text-brand-gold">
                    {game.minPrice === null ? 'Price unavailable' : formatPrice(game.minPrice)}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-xl bg-brand-gold/15 group-hover:bg-brand-gold group-hover:text-brand-dark text-brand-gold flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20 bg-brand-card/30 rounded-3xl border border-brand-cardBorder space-y-3">
            <Gamepad2 className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No games found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              We couldn't find any games matching "{searchQuery}". Try searching for Mobile Legends, Honor of Kings, or Steam.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedPlatform('All');
              }}
              className="px-4 py-2 bg-brand-gold text-brand-dark font-bold text-xs rounded-xl uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
