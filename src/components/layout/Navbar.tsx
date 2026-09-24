import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  Flame, 
  ShieldCheck, 
  LogOut, 
  Layers, 
  Gift, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useRouter, Link } from '../../context/RouterContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CurrencyCode } from '../../types';
import { assetUrl } from '../../utils/assets';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { currentPath, navigate } = useRouter();
  const { currency, setCurrency, rates } = useCurrency();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navLinks = [
    { label: 'Game', path: '/games' },
    { label: 'Auction', path: '/auction', badge: 'LIVE', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { label: 'Transaction', path: '/payment' },
    { label: 'News', path: '/blog' },
    { label: 'Promo', path: '/vouchers', badge: '5%\u00A0OFF', badgeColor: 'bg-brand-gold/20 text-brand-gold border-brand-gold/30' },
    { label: 'Partnership', path: '/partnership' },
    { label: 'Shop', path: '/shop' },
  ];

  const handleCurrencySelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsCurrencyOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0E0B1A]/95 backdrop-blur-md border-b border-brand-cardBorder w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 lg:gap-3 xl:gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2 group shrink-0" aria-label="GPDS GAME SHOP Home">
              <img 
                src={assetUrl("/gpds_logo.png")} 
                alt="GPDS GAME SHOP" 
                className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(240,192,48,0.25)]" 
              />
            </Link>

            {/* Quick Search Bar Trigger (Desktop 2xl only, compact) */}
            <div 
              onClick={onOpenSearch}
              className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-card/80 border border-brand-cardBorder hover:border-brand-gold/50 cursor-pointer text-gray-400 hover:text-white transition-all w-44 group shadow-sm text-xs"
            >
              <Search className="w-3.5 h-3.5 text-brand-gold group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-medium text-gray-400 group-hover:text-gray-300 truncate">
                Search for games...
              </span>
              <span className="ml-auto text-[9px] bg-brand-cardLight border border-brand-cardBorder px-1.5 py-0.5 rounded text-gray-400 font-mono">
                ⌘K
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink-0">
            {navLinks.map(link => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-2.5 py-1.5 text-xs xl:text-xs 2xl:text-sm font-semibold uppercase tracking-wider transition-all duration-200 rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-brand-gold bg-brand-gold/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`inline-flex items-center whitespace-nowrap text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border shrink-0 leading-none ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(245,166,35,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Trigger for < 2xl screens */}
            <button
              onClick={onOpenSearch}
              className="2xl:hidden p-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 text-brand-gold font-bold text-xs transition-all whitespace-nowrap"
                aria-label="Select currency"
              >
                <span>{rates[currency].symbol}</span>
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {isCurrencyOpen && (
                <div className="absolute right-0 mt-2 w-52 max-h-80 overflow-y-auto rounded-xl bg-[#181329] border border-brand-gold/30 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Select Currency
                  </div>
                  {(Object.keys(rates) as CurrencyCode[]).map(code => (
                    <button
                      key={code}
                      onClick={() => handleCurrencySelect(code)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        currency === code
                          ? 'bg-brand-gold text-brand-dark font-bold'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{code} ({rates[code].symbol})</span>
                      <span className="text-[10px] opacity-75">{rates[code].name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 text-gray-300 hover:text-brand-gold transition-all"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-brand-gold text-brand-dark font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-gold-glow animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 pr-2 rounded-full bg-brand-card border border-brand-cardBorder hover:border-brand-gold/50 transition-all shrink-0"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-brand-gold/50"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-white max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#19142C] border border-brand-gold/30 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-brand-cardBorder mb-1">
                      <div className="text-xs font-bold text-white truncate">{user.name}</div>
                      <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded-full border border-brand-gold/20">
                          {user.vipTier}
                        </span>
                        <span className="text-[10px] text-brand-cyan font-semibold">
                          {user.loyaltyPoints.toLocaleString()} pts
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-xs font-medium">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/dashboard');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-brand-gold" /> Gamer Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/payment');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors text-left"
                      >
                        <Clock className="w-4 h-4 text-brand-cyan" /> Order History
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/vouchers');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors text-left"
                      >
                        <Gift className="w-4 h-4 text-brand-pink" /> My Vouchers
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-extrabold text-xs tracking-wider uppercase hover:opacity-95 shadow-gold-glow transition-all whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-1.5 text-gray-300 hover:text-white"
              aria-label="Toggle navigation"
            >
              {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileNavOpen && (
        <div className="lg:hidden bg-[#120E22] border-b border-brand-cardBorder px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-brand-cardBorder">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => {
                  setIsMobileNavOpen(false);
                  navigate(link.path);
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold uppercase ${
                  currentPath === link.path
                    ? 'bg-brand-gold text-brand-dark'
                    : 'bg-brand-card text-gray-300 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/30 text-white font-mono whitespace-nowrap shrink-0 leading-none">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1 text-green-400">
              <ShieldCheck className="w-4 h-4" /> 100% Legit Top-ups
            </span>
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                navigate('/faqs');
              }}
              className="text-brand-gold underline"
            >
              Need Help?
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
