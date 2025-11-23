
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface WishlistProps {
  onViewProduct: (product: Product) => void;
  onNavigate: (page: string) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ onViewProduct, onNavigate }) => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="pt-16 pb-24 px-4 max-w-7xl mx-auto min-h-screen animate-[fadeIn_0.5s_ease-out] bg-brand-50">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl text-brand-900 mb-4">Your Wishlist</h1>
        <p className="text-brand-600 text-lg font-light tracking-wide">Saved treasures.</p>
      </div>

      {wishlistItems.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-32 text-center">
             <div className="text-6xl mb-6 text-brand-200">♡</div>
             <p className="text-gray-400 font-serif italic text-xl mb-8">Your wishlist is empty.</p>
             <button 
                onClick={() => onNavigate('shop')}
                className="bg-brand-900 text-white px-8 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-brand-800 transition-all shadow-lg"
             >
                Discover Collection
             </button>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map(p => (
            <ProductCard key={p.id} product={p} onViewDetails={onViewProduct} />
            ))}
        </div>
      )}
    </div>
  );
};
