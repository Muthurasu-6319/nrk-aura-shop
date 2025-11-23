import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer border border-transparent hover:border-brand-100 hover:shadow-[0_20px_50px_rgba(6,95,70,0.15)] transform hover:-translate-y-2"
      onClick={() => onViewDetails(product)}
    >
      {/* Shimmer Effect Container on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:animate-shimmer z-20 pointer-events-none"></div>

      <div className="aspect-square overflow-hidden bg-gray-50 relative m-2 rounded-xl">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
        />
        
        {/* Overlay Style */}
        <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-all duration-500 z-10"></div>
        
        <button className="absolute bottom-4 right-4 z-30 bg-white/90 backdrop-blur text-brand-800 p-3 rounded-full shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-brand-800 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        </button>
      </div>
      
      <div className="px-6 py-5 relative z-10 bg-white">
        <div className="flex justify-between items-start mb-2">
             <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-brand-700 transition-colors duration-300">{product.name}</h3>
        </div>
        <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest border border-brand-100 px-2 py-1 rounded-full group-hover:bg-brand-50 transition-colors">{product.category}</span>
            <p className="font-sans text-base font-semibold text-gray-800 group-hover:text-brand-800">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};