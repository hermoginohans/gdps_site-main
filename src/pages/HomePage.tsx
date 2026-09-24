import { useCatalog } from '../context/CatalogContext';
import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Clock, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Gamepad2, 
  Ticket, 
  Headphones, 
  Award,
  TrendingUp,
  Percent,
  Search,
  Smartphone,
  Gift,
  Tag,
  ArrowUpRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  OFFICIAL_SLIDERS, 
  OFFICIAL_CATEGORIES, 
 
  OfficialProduct 
} from '../data/officialData';
import { useCurrency } from '../context/CurrencyContext';
import { useRouter, Link } from '../context/RouterContext';
import { StoreHero } from '../components/home/StoreHero';
import { assetUrl } from '../utils/assets';
import { MobileAppBanner } from '../components/home/MobileAppBanner';
import { SupportCenter } from '../components/home/SupportCenter';
import { NewsAndPayments } from '../components/home/NewsAndPayments';
import { CreatorPartnerships } from '../components/home/CreatorPartnerships';

export const HomePage: React.FC = () => {
  const { products: OFFICIAL_PRODUCTS, loading: catalogLoading, error: catalogError , openProduct } = useCatalog();
  const { formatPrice } = useCurrency();
  const { navigate } = useRouter();

  // Category & search filter
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [gameSearchQuery, setGameSearchQuery] = useState('');

  // Interactive UI states

  // Collapsible section & items states
  const [isGamesOpen, setIsGamesOpen] = useState(true);
  const [isGamesExpanded, setIsGamesExpanded] = useState(false);
  const [isVouchersOpen, setIsVouchersOpen] = useState(true);
  const [isVouchersExpanded, setIsVouchersExpanded] = useState(false);
  const [isFilteredExpanded, setIsFilteredExpanded] = useState(false);

  // Filter products by selected category and search query
  const filteredProducts = OFFICIAL_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(gameSearchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(gameSearchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategoryKey === 'all') return true;
    if (selectedCategoryKey === 'trending-games') return product.id % 2 === 0;
    if (selectedCategoryKey === 'new-release') return product.id % 3 === 0;
    if (selectedCategoryKey === 'popular-games') return (product.reviewsCount || 0) > 200;
    if (selectedCategoryKey === 'games') return product.category === 'Games';
    if (selectedCategoryKey === 'voucher') return product.category === 'Voucher' || product.isGiftCard;
    if (selectedCategoryKey === 'others') return product.category === 'Others';
    if (selectedCategoryKey === 'gift-card') return product.isGiftCard;

    return product.category.toLowerCase().includes(selectedCategoryKey.replace('-', ' '));
  });

  // Dedicated popular games vs vouchers split
  const popularGames = OFFICIAL_PRODUCTS.filter(p => !p.isGiftCard && p.category !== 'Voucher' && p.category !== 'Gift Card');
  const voucherProducts = OFFICIAL_PRODUCTS.filter(p => p.isGiftCard || p.category === 'Voucher' || p.category === 'Gift Card');


  const renderProductCard = (product: OfficialProduct) => (
    <button
      type="button"
      key={product.id}
      onClick={() => openProduct(product)}
      className="store-product-card text-left group relative rounded-2xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 p-2.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Image & Discount Badge */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40 mb-2">
        <img
          src={product.picture}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = assetUrl('/steam-wallet-card.svg');
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountTag && (
          <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-red-600/90 text-white font-display font-black text-[9px] uppercase tracking-wider shadow-sm">
            {product.discountTag}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-1 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-brand-cyan uppercase font-semibold tracking-wider block truncate">
            {product.category}
          </span>
          <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-brand-gold transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-brand-cardBorder/50 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-400 block">Starts at</span>
            <span className="text-xs font-black text-brand-gold">
              {product.minPrice === null ? 'Price unavailable' : formatPrice(product.minPrice)}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[10px] text-yellow-400 font-semibold">
            <Star className="w-3 h-3 fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      
      <StoreHero />
      {catalogLoading && <p className="text-center">Loading catalog…</p>}
      {catalogError && <p role="alert" className="text-center text-red-400">Catalog unavailable. Please try again later.</p>}

      {/* 2. EXCLUSIVE OFFERS */}
      <section className="store-offers max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="offers-heading">
        <div className="store-section-heading">
          <div>
            <span className="store-eyebrow"><Flame size={14} /> THE BONUS ROUND</span>
            <h2 id="offers-heading">A little extra. On us.</h2>
            <p>Discover in-game rewards and offers for your next adventure.</p>
          </div>
          <Link to="/vouchers" className="store-text-link">Explore all offers <ArrowUpRight size={17} /></Link>
        </div>
        <div className="store-offer-grid">
          <article className="store-featured-offer">
            <div className="store-offer-art" aria-hidden="true">
              <img src={assetUrl('/slider/free_code.png')} alt="" />
            </div>
            <div className="store-offer-copy">
              <span className="store-promo-label"><span /> LIMITED-TIME OFFER</span>
              <div>
                <span className="store-offer-kicker">YOUR NEXT ADVENTURE STARTS HERE</span>
                <h3>Small potions.<br /><em>Big possibilities.</em></h3>
                <p>Give your inventory a boost. Discover free item codes and get back to the game.</p>
              </div>
              <Link to="/vouchers" className="store-primary-action">Explore free codes <ArrowRight size={18} /></Link>
            </div>
            <span className="store-art-caption"><Gift size={14} /> IN-GAME REWARDS</span>
          </article>
          <article className="store-voucher-offer">
            <div className="store-voucher-top"><span className="store-eyebrow">MORE WAYS TO PLAY</span><ArrowUpRight size={20} /></div>
            <div className="store-ticket-art" aria-hidden="true"><Ticket size={56} strokeWidth={1.2} /><span>GPDS</span><i>DIGITAL VOUCHERS</i></div>
            <div>
              <h3>One voucher.<br />Your kind of play.</h3>
              <p>Explore wallet codes and digital gift cards for your favorite platforms.</p>
            </div>
            <Link to="/vouchers" className="store-secondary-action">Browse vouchers <ArrowRight size={16} /></Link>
          </article>
        </div>
      </section>

      {/* 3. GAME TOP-UPS & VOUCHERS */}
      <section className="store-catalog max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" aria-labelledby="catalog-heading">
        <div className="store-section-heading">
          <div>
            <span className="store-eyebrow store-eyebrow-cyan"><Gamepad2 size={15} /> PICK YOUR NEXT PLAY</span>
            <h2 id="catalog-heading">Your game. Your next level.</h2>
            <p>Game top-ups, wallet codes, and digital vouchers. All in one place.</p>
          </div>
          <span className="store-catalog-count">{OFFICIAL_PRODUCTS.length} products to explore</span>
        </div>
        <div className="store-catalog-toolbar">
          <div className="store-search">
            <Search size={19} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search games and vouchers"
              placeholder="Find your game or voucher..."
              value={gameSearchQuery}
              onChange={e => { setGameSearchQuery(e.target.value); setIsFilteredExpanded(false); }}
            />
          </div>
          {selectedCategoryKey === 'all' && !gameSearchQuery && (
            <button
              onClick={() => {
                const shouldOpen = !isGamesOpen || !isVouchersOpen;
                setIsGamesOpen(shouldOpen);
                setIsVouchersOpen(shouldOpen);
              }}
              className="store-collapse"
              aria-expanded={isGamesOpen && isVouchersOpen}
            >
              {(!isGamesOpen || !isVouchersOpen) ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              {(!isGamesOpen || !isVouchersOpen) ? 'Expand all' : 'Collapse all'}
            </button>
          )}
        </div>

        {/* Category Pills (from OFFICIAL_CATEGORIES) */}
        <div className="store-category-tabs flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryKey('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategoryKey === 'all'
                ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                : 'bg-brand-card border border-brand-cardBorder text-gray-300 hover:text-white hover:border-brand-gold/40'
            }`}
          >
            All Items
          </button>
          {OFFICIAL_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategoryKey(cat.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryKey === cat.key
                  ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                  : 'bg-brand-card border border-brand-cardBorder text-gray-300 hover:text-white hover:border-brand-gold/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* CONTENT VIEW: Split into Collapsible Sections when browsing "All" */}
        {selectedCategoryKey === 'all' && !gameSearchQuery ? (
          <div className="space-y-6">
            
            {/* 1. COLLAPSIBLE POPULAR GAMES SECTION */}
            <div className="rounded-3xl bg-brand-card/40 border border-brand-cardBorder overflow-hidden transition-all">
              {/* Accordion Header */}
              <div 
                onClick={() => setIsGamesOpen(prev => !prev)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors border-b border-brand-cardBorder/50 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center border border-brand-cyan/30">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-base sm:text-lg text-white">
                        Popular Game Top-Ups
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan text-[10px] font-bold border border-brand-cyan/30">
                        {popularGames.length} Titles
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 hidden sm:block">
                      Instant direct reload for Mobile Legends, Valorant, Honor of Kings, Genshin & more
                    </p>
                  </div>
                </div>

                <button 
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-xl bg-brand-card border border-brand-cardBorder"
                  aria-label={isGamesOpen ? 'Collapse Popular Games' : 'Expand Popular Games'}
                >
                  <span>{isGamesOpen ? 'Collapse' : 'Expand'}</span>
                  {isGamesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Accordion Body */}
              {isGamesOpen && (
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {(isGamesExpanded ? popularGames : popularGames.slice(0, 12)).map(renderProductCard)}
                  </div>

                  {/* Collapsible Expand/Collapse Items Toggle Button */}
                  {popularGames.length > 12 && (
                    <div className="pt-2 flex flex-col items-center">
                      <button
                        onClick={() => setIsGamesExpanded(prev => !prev)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-card to-brand-cardLight hover:border-brand-gold/50 border border-brand-cardBorder text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
                      >
                        {isGamesExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5 text-brand-gold" />
                            <span>Collapse to Top 12 Games</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5 text-brand-cyan" />
                            <span>Show All {popularGames.length} Games ({popularGames.length - 12} more)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. COLLAPSIBLE TOP-UP VOUCHERS SECTION */}
            <div className="rounded-3xl bg-brand-card/40 border border-brand-cardBorder overflow-hidden transition-all">
              {/* Accordion Header */}
              <div 
                onClick={() => setIsVouchersOpen(prev => !prev)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors border-b border-brand-cardBorder/50 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-base sm:text-lg text-white">
                        Top-Up Vouchers & Gift Cards
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold border border-brand-gold/30">
                        {voucherProducts.length} Vouchers
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 hidden sm:block">
                      Digital codes for Steam Wallet, Razer Gold, Google Play, Apple Gift Cards & more
                    </p>
                  </div>
                </div>

                <button 
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-xl bg-brand-card border border-brand-cardBorder"
                  aria-label={isVouchersOpen ? 'Collapse Vouchers' : 'Expand Vouchers'}
                >
                  <span>{isVouchersOpen ? 'Collapse' : 'Expand'}</span>
                  {isVouchersOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Accordion Body */}
              {isVouchersOpen && (
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {(isVouchersExpanded ? voucherProducts : voucherProducts.slice(0, 6)).map(renderProductCard)}
                  </div>

                  {/* Collapsible Expand/Collapse Items Toggle Button */}
                  {voucherProducts.length > 6 && (
                    <div className="pt-2 flex flex-col items-center">
                      <button
                        onClick={() => setIsVouchersExpanded(prev => !prev)}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-card to-brand-cardLight hover:border-brand-gold/50 border border-brand-cardBorder text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
                      >
                        {isVouchersExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5 text-brand-gold" />
                            <span>Collapse to Top 6 Vouchers</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5 text-brand-gold" />
                            <span>Show All {voucherProducts.length} Vouchers ({voucherProducts.length - 6} more)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        ) : (
          /* FILTERED / SEARCH VIEW WITH COLLAPSIBLE LIMIT */
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {(isFilteredExpanded ? filteredProducts : filteredProducts.slice(0, 12)).map(renderProductCard)}
            </div>

            {filteredProducts.length > 12 && (
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setIsFilteredExpanded(prev => !prev)}
                  className="px-6 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardLight border border-brand-cardBorder hover:border-brand-gold/40 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  {isFilteredExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Collapse Items</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Show All {filteredProducts.length} Items ({filteredProducts.length - 12} more)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 rounded-2xl bg-brand-card border border-brand-cardBorder space-y-2">
                <Gamepad2 className="w-10 h-10 text-gray-500 mx-auto" />
                <p className="text-sm text-gray-400 font-bold">No games found matching your search.</p>
                <button
                  onClick={() => {
                    setSelectedCategoryKey('all');
                    setGameSearchQuery('');
                  }}
                  className="text-xs text-brand-gold underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <MobileAppBanner />

      <CreatorPartnerships />

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <SupportCenter />

      <NewsAndPayments />

    </div>
  );
};

export default HomePage;
