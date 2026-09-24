import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useRouter } from '../../context/RouterContext';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotalPhp, totalItems } = useCart();
  const { formatPrice } = useCurrency();
  const { navigate } = useRouter();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/shop/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#151124] border-l border-brand-gold/30 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-brand-cardBorder bg-[#1C1730] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-gold/20 flex items-center justify-center border border-brand-gold/40 text-brand-gold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white">Your Cart</h3>
                <p className="text-xs text-gray-400">{totalItems} item{totalItems !== 1 ? 's' : ''} in cart</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center mx-auto text-gray-500 mb-4 border border-brand-cardBorder">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-white font-semibold text-lg mb-1">Your cart is empty</h4>
                <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                  Check out our esports jerseys, high-grade phone coolers, and gaming accessories.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-5 py-2.5 bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-bold rounded-xl text-sm transition-all shadow-gold-glow"
                >
                  Explore Shop Merch
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div 
                  key={product.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-brand-card border border-brand-cardBorder relative group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="grow min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-sm text-white truncate pr-4">{product.name}</h4>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-brand-cyan mb-2 font-medium">{product.category}</p>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-gold text-sm">
                        {formatPrice(product.pricePhp * quantity)}
                      </span>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-2 bg-[#0E0A1C] border border-brand-cardBorder rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="text-gray-400 hover:text-white p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-white px-1">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="text-gray-400 hover:text-white p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-cardBorder bg-[#1C1730]">
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(subtotalPhp)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Estimated Shipping</span>
                  <span className="text-green-400 font-medium">Free across PH & JPN</span>
                </div>
                <div className="pt-2 border-t border-brand-cardBorder flex justify-between font-bold text-base text-white">
                  <span>Total</span>
                  <span className="text-brand-gold text-lg">{formatPrice(subtotalPhp)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-extrabold rounded-xl shadow-gold-glow hover:opacity-95 transition-all text-sm uppercase tracking-wider"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
