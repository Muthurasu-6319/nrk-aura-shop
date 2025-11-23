import React from 'react';
import { useData } from '../context/DataContext';

export const Gallery: React.FC = () => {
  const { gallery } = useData();

  return (
    <div className="pt-16 pb-20 px-4 max-w-7xl mx-auto min-h-screen animate-[fadeIn_0.5s_ease-out]">
       <div className="text-center mb-16">
        <h1 className="font-serif text-5xl text-gray-900 mb-4">Visual Diary</h1>
        <p className="text-gray-500 text-lg font-light">A curated glimpse into our world.</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {gallery.map(item => (
          <div key={item.id} className="break-inside-avoid bg-white p-4 border border-gray-100 hover:border-brand-300 shadow-sm hover:shadow-xl transition-all duration-500 group rounded-lg">
            <div className="overflow-hidden relative rounded-md">
                <img src={item.image} alt={item.title} className="w-full h-auto object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/10 transition-colors duration-500"></div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="font-serif text-xl text-brand-600">{item.title}</h3>
              {item.description && <p className="text-sm text-gray-500 font-sans mt-2 italic">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
      
      {gallery.length === 0 && (
        <div className="text-center text-gray-500 py-20">Gallery is empty.</div>
      )}
    </div>
  );
};