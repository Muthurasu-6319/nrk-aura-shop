import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

interface ShopProps {
    onViewProduct: (product: Product) => void;
}

export const Shop: React.FC<ShopProps> = ({ onViewProduct }) => {
    // Get products directly from DataContext (which comes from DB)
    const { products, isLoading } = useData();
    const { isAdmin } = useAuth();
    
    const [filter, setFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<{min: string, max: string}>({ min: '', max: '' });

    // --- 1. Smart Category Logic (Avoids Duplicates) ---
    const categories = useMemo(() => {
        const uniqueCats: string[] = [];
        const seen = new Set<string>();

        products.forEach(p => {
            // Remove extra spaces & handle empty
            const catName = p.category ? p.category.trim() : 'Uncategorized';
            
            // Create lowercase key for check (e.g. "Bangle" == "bangle")
            const key = catName.toLowerCase();

            if (!seen.has(key)) {
                seen.add(key);
                uniqueCats.push(catName); // Keep original casing for display
            }
        });

        return ['All', ...uniqueCats.sort()];
    }, [products]);

    // --- 2. Filtering Logic ---
    const filteredProducts = products.filter(p => {
        // A. Visibility Check
        // If NOT admin, show only visible products. If Admin, show everything.
        if (!isAdmin && p.isVisible === false) return false;

        // B. Category Check
        // Compare strictly using lowercase to match smart categories
        const matchesCategory = filter === 'All' || p.category?.trim().toLowerCase() === filter.trim().toLowerCase();

        // C. Search Check (Name or Tags)
        const query = searchQuery.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(query) || 
                              (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));

        // D. Price Range Check
        const min = priceRange.min === '' ? 0 : Number(priceRange.min);
        const max = priceRange.max === '' ? Infinity : Number(priceRange.max);
        const matchesPrice = p.price >= min && p.price <= max;

        return matchesCategory && matchesSearch && matchesPrice;
    });

    // --- 3. Loading State (Skeleton UI) ---
    if (isLoading) {
        return (
            <div className="pt-16 pb-24 px-4 max-w-7xl mx-auto min-h-screen bg-brand-50">
                {/* Header Skeleton */}
                <div className="text-center mb-12">
                    <div className="h-12 bg-brand-100/50 w-64 mx-auto rounded-lg mb-4 animate-pulse"></div>
                    <div className="h-6 bg-brand-100/50 w-48 mx-auto rounded-lg animate-pulse"></div>
                </div>

                {/* Filter Skeleton */}
                <div className="flex flex-col items-center gap-8 mb-16">
                    <div className="flex gap-3 flex-wrap justify-center">
                        {[1,2,3,4].map(i => <div key={i} className="h-8 w-24 bg-brand-100/50 rounded-full animate-pulse delay-75"></div>)}
                    </div>
                    <div className="w-full max-w-4xl h-20 bg-white/50 rounded-2xl border border-brand-50 animate-pulse"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden h-[400px] border border-brand-50 shadow-sm flex flex-col">
                            <div className="h-full bg-brand-100/20 w-full relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite] translate-x-[-100%]"></div>
                            </div>
                            <div className="p-6 space-y-4 bg-white">
                                <div className="h-6 bg-brand-100/50 w-3/4 rounded animate-pulse"></div>
                                <div className="flex justify-between">
                                    <div className="h-4 bg-brand-100/50 w-16 rounded-full animate-pulse"></div>
                                    <div className="h-4 bg-brand-100/50 w-20 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="pt-16 pb-24 px-4 max-w-7xl mx-auto min-h-screen animate-[fadeIn_0.5s_ease-out] bg-brand-50">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="font-serif text-5xl text-brand-900 mb-4">The Collection</h1>
                <p className="text-brand-600 text-lg font-light tracking-wide">Emeralds, Gold, and Timeless Design.</p>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col items-center gap-8 mb-16">
                
                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 rounded-full ${
                        filter === cat 
                            ? 'bg-brand-800 text-white border-brand-800 shadow-md transform scale-105' 
                            : 'bg-white text-gray-500 border-brand-100 hover:border-brand-300 hover:text-brand-600'
                        }`}
                    >
                        {cat}
                    </button>
                    ))}
                </div>

                {/* Advanced Filters Row */}
                <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex flex-col md:flex-row items-center gap-6 justify-between">
                    
                    {/* Search */}
                    <div className="relative flex-1 w-full md:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or tag..."
                            className="w-full pl-10 pr-4 py-3 bg-brand-50 border border-brand-100 rounded-xl text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder-brand-300/50 text-brand-900"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Price Range */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-brand-50 px-3 py-2 rounded-xl border border-brand-100">
                            <span className="text-xs text-gray-400 font-bold">₹</span>
                            <input 
                                type="number" 
                                placeholder="Min" 
                                className="w-20 bg-transparent outline-none text-sm text-brand-900 placeholder-brand-300/50"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                            />
                        </div>
                        <span className="text-gray-300">-</span>
                        <div className="flex items-center gap-2 bg-brand-50 px-3 py-2 rounded-xl border border-brand-100">
                            <span className="text-xs text-gray-400 font-bold">₹</span>
                            <input 
                                type="number" 
                                placeholder="Max" 
                                className="w-20 bg-transparent outline-none text-sm text-brand-900 placeholder-brand-300/50"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    {/* Clear Filters */}
                    {(searchQuery || priceRange.min || priceRange.max || filter !== 'All') && (
                        <button 
                            onClick={() => {
                                setFilter('All');
                                setSearchQuery('');
                                setPriceRange({min: '', max: ''});
                            }}
                            className="text-xs text-red-400 font-bold uppercase tracking-widest hover:text-red-600 whitespace-nowrap"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-8 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Treasure' : 'Treasures'} Found
                </span>
            </div>

            {/* Grid - Shows ONLY products from DB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onViewDetails={onViewProduct} />
                ))}
            </div>
            
            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-32 flex flex-col items-center">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4 text-brand-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-serif italic text-lg">No treasures found.</p>
                    {products.length === 0 ? (
                        <p className="text-xs text-red-400 mt-2">Database is empty. Please add products from Admin Dashboard.</p>
                    ) : (
                        <button 
                            onClick={() => {
                                setFilter('All');
                                setSearchQuery('');
                                setPriceRange({min: '', max: ''});
                            }}
                            className="mt-4 text-brand-600 font-bold text-sm hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};