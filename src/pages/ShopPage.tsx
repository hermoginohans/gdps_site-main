import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Star, 
  ArrowRight, 
  Plus, 
  Check, 
  Sparkles, 
  ShieldCheck,
  X
} from 'lucide-react';
import { SHOP_PRODUCTS } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { ShopProduct } from '../types';

export const ShopPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = ['All', 'Apparel', 'Peripherals', 'Collectibles'];

  const filteredProducts = selectedCategory === 'All'
    ? SHOP_PRODUCTS
    : SHOP_PRODUCTS.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: ShopProduct, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#221638] via-[#141026] to-[#221638] border border-brand-gold/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan text-xs font-bold uppercase tracking-wider border border-brand-cyan/30">
            <ShoppingBag className="w-3.5 h-3.5" /> Official Merchandise & Gear
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
            Esports Gear & Gaming Collectibles
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Upgrade your battle setup with official GPDS pro jerseys, magnetic smartphone coolers, gaming mice, and commemorative pin sets.
          </p>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                : 'bg-brand-card hover:bg-brand-cardLight text-gray-400 hover:text-white border border-brand-cardBorder'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="rounded-3xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/60 p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-gold/10 flex flex-col justify-between group"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 border border-white/10 bg-[#0E0A1C]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-[10px] text-brand-cyan font-bold px-2 py-0.5 rounded">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] text-brand-gold font-bold">
                  <Star className="w-3 h-3 fill-current" /> {product.rating}
                  <span className="text-gray-400">({product.reviewsCount})</span>
                </div>

                <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-brand-gold transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="mt-4 pt-3 border-t border-brand-cardBorder flex items-center justify-between">
              <div>
                <span className="text-base font-display font-black text-brand-gold">
                  {formatPrice(product.pricePhp)}
                </span>
                {product.originalPricePhp && (
                  <span className="block text-[10px] text-gray-500 line-through">
                    {formatPrice(product.originalPricePhp)}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => handleAddToCart(product, e)}
                className="px-3.5 py-2 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
              >
                {addedId === product.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#151125] border border-brand-gold/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-brand-cardBorder">
              <div>
                <span className="text-xs font-bold text-brand-cyan uppercase">{selectedProduct.category}</span>
                <h3 className="font-display font-bold text-xl text-white mt-0.5">{selectedProduct.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/10">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 text-xs">
                <div className="text-2xl font-display font-black text-brand-gold">
                  {formatPrice(selectedProduct.pricePhp)}
                </div>

                <p className="text-gray-300 leading-relaxed text-sm">
                  {selectedProduct.description}
                </p>

                {/* Specs */}
                <div className="space-y-1.5 pt-2 border-t border-brand-cardBorder">
                  <span className="font-bold text-gray-400 uppercase tracking-wider block">Specifications:</span>
                  {Object.entries(selectedProduct.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-brand-cardBorder/40">
                      <span className="text-gray-400">{key}</span>
                      <span className="text-white font-medium">{val}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:opacity-95 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Shopping Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
