import React, { useState, useRef, useEffect } from 'react';
import { getStyleAdvice } from '../services/geminiService';
import { useData } from '../context/DataContext';
import { Product } from '../types';

interface GeminiStylistProps {
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}

export const GeminiStylist: React.FC<GeminiStylistProps> = ({ onClose, onSelectProduct }) => {
  const { products } = useData(); 
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string | React.ReactNode}[]>([
    { role: 'ai', content: "Welcome to NRK Aura. I am your personal stylist. How may I assist you with your selection today?" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      const advice = await getStyleAdvice(userMsg, products);
      
      if (advice.recommendations.length > 0) {
        const recContent = (
          <div className="space-y-3">
            <p className="mb-2 text-brand-800 font-serif italic">Excellent choice. I recommend these pieces:</p>
            {advice.recommendations.map((rec, idx) => {
              const product = products.find(p => p.id === rec.productId);
              if (!product) return null;
              return (
                <div key={idx} className="bg-white p-3 rounded-xl shadow-md flex gap-3 cursor-pointer hover:bg-brand-50 transition-colors border border-transparent hover:border-brand-200" onClick={() => onSelectProduct(product.id)}>
                  <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-serif font-bold text-sm text-brand-900">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-tight">{rec.reason}</p>
                    <p className="text-xs font-bold text-brand-600 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        );
        setMessages(prev => [...prev, { role: 'ai', content: recContent }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "I couldn't find a perfect match in our current collection, but do explore our main gallery for more exquisite options." }]);
      }
    } catch (error) {
        setMessages(prev => [...prev, { role: 'ai', content: "My connection seems a bit faint. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white/95 backdrop-blur shadow-2xl rounded-3xl overflow-hidden z-40 flex flex-col border border-brand-100" style={{ maxHeight: '600px', height: '75vh' }}>
      {/* Header */}
      <div className="bg-brand-900 text-white p-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center border border-brand-700">
            <span className="text-xs">✨</span>
          </div>
          <h3 className="font-serif font-bold tracking-wide text-sm">NRK Concierge</h3>
        </div>
        <button onClick={onClose} className="text-brand-300 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-brand-50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-brand-800 text-white rounded-2xl rounded-br-sm' 
                : 'bg-white text-gray-700 rounded-2xl rounded-bl-sm border border-brand-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-brand-100 p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-brand-50">
        <div className="flex gap-2 items-center bg-brand-50 p-1 pr-2 rounded-full border border-brand-100 focus-within:border-brand-300 transition-colors">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ask for advice..."
            className="flex-1 bg-transparent px-4 py-2 text-sm text-brand-900 focus:outline-none placeholder-brand-300"
          />
          <button 
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="bg-brand-800 text-white p-2 rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};