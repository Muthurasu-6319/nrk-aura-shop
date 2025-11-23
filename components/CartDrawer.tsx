import React from 'react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onNavigate?: (page: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { items, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (onNavigate) {
        onNavigate('checkout');
        toggleCart();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-sm transition-opacity" onClick={toggleCart} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="h-full w-full bg-white shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out] rounded-l-3xl overflow-hidden">
          <div className="px-8 py-8 border-b border-gray-50 flex justify-between items-center bg-white">
            <h2 className="text-2xl font-serif text-brand-900">Your Collection</h2>
            <button onClick={toggleCart} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <p className="font-sans">Your cart is empty.</p>
                <button onClick={toggleCart} className="text-brand-600 font-bold hover:underline">Continue Shopping</button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-6 group">
                  <div className="w-24 h-24 overflow-hidden rounded-2xl bg-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-serif text-lg text-brand-900 leading-tight">{item.name}</h3>
                      <p className="text-sm text-brand-500 mt-1 font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-50 rounded-full px-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-gray-500 hover:text-brand-600">-</button>
                        <span className="px-2 text-sm text-gray-900 font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-gray-500 hover:text-brand-600">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-600 font-bold">Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="px-8 py-8 bg-brand-50 border-t border-brand-100">
              <div className="flex justify-between items-center mb-6 text-xl text-brand-900 font-serif font-bold">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-brand-900 text-white py-4 font-bold uppercase tracking-widest hover:bg-brand-800 transition-colors duration-300 shadow-lg rounded-full"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};