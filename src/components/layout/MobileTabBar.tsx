import React from 'react';
import { Home, Gamepad2, Clock, ShoppingBag, User } from 'lucide-react';
import { useRouter, Link } from '../../context/RouterContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MobileTabBar: React.FC = () => {
  const { currentPath } = useRouter();
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const tabs = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Top-Up', path: '/games', icon: Gamepad2 },
    { label: 'Track', path: '/payment', icon: Clock },
    { label: 'Cart', path: '/shop/cart', icon: ShoppingBag, badge: totalItems },
    { label: 'Profile', path: isAuthenticated ? '/dashboard' : '/login', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0B1A]/95 backdrop-blur-lg border-t border-brand-cardBorder px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {tabs.map(tab => {
        const isActive = currentPath === tab.path || (tab.path !== '/' && currentPath.startsWith(tab.path));
        const Icon = tab.icon;

        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive
                ? 'text-brand-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-brand-gold text-brand-dark font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-gold-glow">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] font-semibold mt-0.5 tracking-tight ${isActive ? 'font-bold' : ''}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
