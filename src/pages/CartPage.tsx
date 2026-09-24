import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Truck,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useRouter, Link } from '../context/RouterContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotalPhp, totalItems } = useCart();
  const { formatPrice } = useCurrency();
  const { navigate } = useRouter();

  const [promoInput, setPromoInput] = useState('');
  const [discountPhp, setDiscountPhp] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.toUpperCase() === 'GPDSFIRST50') {
      setDiscountPhp(50);
      setPromoMessage('Promo code GPDSFIRST50 applied (-₱50)!');
    } else {
      setPromoMessage('Invalid coupon code. Try GPDSFIRST50');
    }
  };

  const finalTotal = Math.max(0, subtotalPhp - discountPhp);

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto text-green-400 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-display font-black text-white">
          Shop Order Confirmed!
        </h1>
        <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
          Thank you for ordering official GPDS merchandise. We are preparing your shipment. A tracking notification will be dispatched to your phone and email.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-brand-gold text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:opacity-95 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-card flex items-center justify-center mx-auto text-gray-500 border border-brand-cardBorder">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-display font-black text-white">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          You have no merchandise items in your cart. Explore our official jerseys, cooling pads, and gaming accessories.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-brand-gold text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:opacity-95 transition-all"
        >
          Browse Shop Items
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/shop')}
          className="p-2 rounded-xl bg-brand-card hover:bg-brand-cardLight border border-brand-cardBorder text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
          Shopping Cart ({totalItems} items)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Item List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="p-4 sm:p-5 rounded-3xl bg-brand-card border border-brand-cardBorder flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-white/10 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-brand-cyan uppercase">{product.category}</span>
                  <h3 className="font-display font-bold text-base text-white">{product.name}</h3>
                  <div className="text-sm font-display font-black text-brand-gold mt-1">
                    {formatPrice(product.pricePhp)}
                  </div>
                </div>
              </div>

              {/* Quantity adjusters & delete */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-auto">
                <div className="flex items-center gap-2 bg-[#0E0A1C] border border-brand-cardBorder rounded-xl px-3 py-1">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-white px-2">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-display font-black text-base text-white min-w-[80px] text-right">
                  {formatPrice(product.pricePhp * quantity)}
                </span>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Shipping Details Form */}
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-gold" /> Delivery & Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-300">Recipient Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Contact Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 09171234567"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-gray-300">Complete Delivery Address</label>
                <input
                  type="text"
                  placeholder="Unit, Street, Barangay, City, Province, Postal Code"
                  value={customerAddress}
                  onChange={e => setCustomerAddress(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="p-6 rounded-3xl bg-[#171229] border border-brand-cardBorder space-y-5 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-white border-b border-brand-cardBorder pb-3">
              Order Summary
            </h3>

            {/* Promo Code input */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promoInput}
                  onChange={e => setPromoInput(e.target.value)}
                  className="grow bg-[#0E0A1C] border border-brand-cardBorder rounded-xl px-3 py-2 text-xs text-white uppercase font-mono outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-gold text-brand-dark font-extrabold text-xs uppercase rounded-xl"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className="text-[11px] text-brand-gold font-semibold">{promoMessage}</p>
              )}
            </form>

            <div className="space-y-2.5 text-xs border-t border-brand-cardBorder pt-4">
              <div className="flex justify-between text-gray-400">
                <span>Items Subtotal</span>
                <span className="text-white font-medium">{formatPrice(subtotalPhp)}</span>
              </div>
              {discountPhp > 0 && (
                <div className="flex justify-between text-green-400 font-medium">
                  <span>Promo Discount</span>
                  <span>-{formatPrice(discountPhp)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Nationwide Shipping</span>
                <span className="text-green-400 font-bold">FREE</span>
              </div>
              <div className="pt-3 border-t border-brand-cardBorder flex justify-between items-baseline font-bold text-white">
                <span className="text-sm">Total Payable</span>
                <span className="text-2xl font-display font-black text-brand-gold">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCompleteOrder}
              className="w-full py-4 bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-gold text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-2xl shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              Complete Checkout • {formatPrice(finalTotal)}
            </button>

            <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
              Direct dispatch & guaranteed authentic gear.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
