
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { items, toggleCart } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { siteSettings, updateSiteSettings } = useData();
  const { wishlistItems } = useWishlist();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoControls, setShowLogoControls] = useState(false);

  const menuItems = ['Home', 'Shop', 'Gallery', 'About', 'Contact'];

  const handleMobileNavigate = (page: string) => {
    onNavigate(page.toLowerCase());
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-50/95 backdrop-blur-md shadow-sm transition-all duration-300 border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo Section with Controls */}
          <div className="relative group/logo z-50">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate('home')}>
                {/* The logic: If logoUrl exists, it replaces ONLY the 'N' icon box. The text remains next to it. */}
                {siteSettings.logoUrl ? (
                    <img 
                        src={siteSettings.logoUrl} 
                        alt={siteSettings.brandName} 
                        style={{ 
                            height: `${siteSettings.logoHeight}px`, 
                            width: siteSettings.logoWidth === 'auto' ? 'auto' : `${siteSettings.logoWidth}px` 
                        }}
                        className="object-contain transition-all duration-300"
                    />
                ) : (
                    <div 
                        className="relative flex items-center justify-center bg-transparent transform rotate-45 rounded-xl shadow-sm group-hover:rotate-0 transition-all duration-500 border border-brand-200"
                        style={{ 
                            height: `${siteSettings.logoHeight}px`, 
                            width: siteSettings.logoHeight ? `${siteSettings.logoHeight}px` : '48px'
                        }}
                    >
                        <div className="absolute inset-1 border border-brand-300 rounded-lg opacity-70"></div>
                        <span className="font-serif text-xl font-bold text-brand-800 transform -rotate-45 group-hover:rotate-0 transition-all duration-500">
                            {siteSettings.brandName.charAt(0)}
                        </span>
                    </div>
                )}
                
                <div className="flex flex-col">
                    <span className="font-serif text-2xl font-bold text-brand-900 tracking-wide leading-none uppercase">{siteSettings.brandName}</span>
                    <span className="font-sans text-[10px] text-brand-600 tracking-[0.3em] uppercase mt-1">{siteSettings.brandSubtitle}</span>
                </div>
            </div>

            {/* Controls Trigger - Visible on Hover */}
            <button 
                onClick={(e) => { e.stopPropagation(); setShowLogoControls(!showLogoControls); }}
                className="absolute -bottom-6 left-0 text-[10px] bg-white border border-brand-200 px-2 py-1 rounded shadow-sm opacity-0 group-hover/logo:opacity-100 transition-opacity text-brand-800 font-bold uppercase tracking-widest hover:bg-brand-50"
            >
                Size
            </button>

            {/* Controls Panel */}
            {showLogoControls && (
                <div className="absolute top-full left-0 mt-4 bg-white p-4 shadow-xl rounded-xl border border-brand-100 w-64 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-brand-100 pb-2">
                            <h4 className="font-serif text-sm text-brand-900 font-bold">Logo Dimensions</h4>
                            <button onClick={() => setShowLogoControls(false)} className="text-gray-400 hover:text-brand-600">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-gray-500 block">Height (px)</label>
                            <input 
                                type="number" 
                                value={siteSettings.logoHeight} 
                                onChange={(e) => updateSiteSettings({...siteSettings, logoHeight: e.target.value})}
                                className="w-full bg-brand-50 border border-brand-200 p-2 rounded-lg text-sm focus:border-brand-500 outline-none"
                            />
                            <input 
                                type="range" 
                                min="40" 
                                max="200" 
                                value={siteSettings.logoHeight} 
                                onChange={(e) => updateSiteSettings({...siteSettings, logoHeight: e.target.value})}
                                className="w-full accent-brand-600 h-1 bg-brand-100 rounded-lg appearance-none cursor-pointer block"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-gray-500 block">Width (px or auto)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={siteSettings.logoWidth} 
                                    onChange={(e) => updateSiteSettings({...siteSettings, logoWidth: e.target.value})}
                                    className="w-full bg-brand-50 border border-brand-200 p-2 rounded-lg text-sm focus:border-brand-500 outline-none"
                                />
                                <button 
                                    onClick={() => updateSiteSettings({...siteSettings, logoWidth: 'auto'})}
                                    className="bg-brand-100 text-brand-800 px-3 rounded-lg text-xs font-bold hover:bg-brand-200 whitespace-nowrap"
                                >
                                    Auto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center bg-white rounded-full px-2 py-2 shadow-sm border border-brand-100">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item.toLowerCase())}
                className={`font-sans text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 ${
                  currentPage === item.toLowerCase() 
                  ? 'bg-brand-900 text-white shadow-lg' 
                  : 'text-brand-700 hover:text-brand-900 hover:bg-brand-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* Auth Links (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
                {isAuthenticated ? (
                <>
                    {isAdmin && (
                        <button onClick={() => onNavigate('admin')} className="text-[10px] font-bold text-brand-600 uppercase tracking-widest border border-brand-200 px-3 py-1 rounded-full hover:bg-brand-900 hover:text-white transition-all">
                            Admin
                        </button>
                    )}
                    <button onClick={() => onNavigate('profile')} className="w-10 h-10 rounded-full bg-white border border-brand-200 hover:border-brand-500 hover:bg-brand-50 flex items-center justify-center text-brand-700 transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </button>
                    <button onClick={logout} className="text-[10px] text-brand-500 hover:text-red-400 uppercase tracking-widest font-bold">
                        Logout
                    </button>
                </>
                ) : (
                    <button onClick={() => onNavigate('login')} className="px-6 py-2 rounded-full border border-brand-200 text-xs uppercase tracking-widest font-bold text-brand-800 hover:bg-brand-900 hover:text-white transition-all">
                        Login
                    </button>
                )}
            </div>

            <div className="w-px h-6 bg-brand-200 mx-2 hidden md:block"></div>

            {/* Wishlist Button */}
            <button 
                onClick={() => onNavigate('wishlist')}
                className="hidden md:flex relative w-10 h-10 rounded-full bg-white border border-brand-200 hover:border-brand-500 hover:bg-brand-50 items-center justify-center text-brand-700 transition-all shadow-sm group"
                title="Wishlist"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                 {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-sm">
                        {wishlistItems.length}
                    </span>
                )}
            </button>

            {/* Cart Button */}
            <button 
              className="relative p-3 rounded-full bg-brand-900 text-white hover:bg-brand-800 transition-all shadow-lg group"
              onClick={toggleCart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-brand-900 text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-brand-900">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
                className="lg:hidden p-2 text-brand-800 hover:bg-brand-100 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-24 left-0 w-full bg-brand-50 border-b border-brand-200 shadow-xl animate-[slideIn_0.3s_ease-out] overflow-hidden h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex flex-col p-6 space-y-4">
                {menuItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => handleMobileNavigate(item)}
                        className={`text-left px-4 py-3 rounded-xl font-serif text-lg font-medium transition-all ${
                            currentPage === item.toLowerCase() 
                            ? 'bg-brand-900 text-white border-l-4 border-gold-400' 
                            : 'text-brand-800 hover:bg-brand-100'
                        }`}
                    >
                        {item}
                    </button>
                ))}
                
                {/* Mobile Auth & Wishlist */}
                <div className="border-t border-brand-200 pt-6 mt-2 flex flex-col gap-4">
                     <button onClick={() => handleMobileNavigate('wishlist')} className="w-full text-left px-4 py-2 text-sm text-brand-700 hover:text-brand-900 font-semibold flex items-center gap-2">
                        Wishlist 
                        {wishlistItems.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{wishlistItems.length}</span>}
                     </button>

                    {isAuthenticated ? (
                        <>
                             <div className="flex items-center justify-between px-4 py-2 bg-white rounded-xl border border-brand-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-800 border border-brand-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-sm text-brand-900">My Account</span>
                                </div>
                                <button onClick={logout} className="text-xs text-red-500 font-bold uppercase bg-red-50 px-2 py-1 rounded border border-red-100">Logout</button>
                             </div>
                             <button onClick={() => handleMobileNavigate('profile')} className="w-full text-left px-4 py-2 text-sm text-brand-700 hover:text-brand-900 font-semibold">View Profile</button>
                             {isAdmin && (
                                <button onClick={() => handleMobileNavigate('admin')} className="w-full text-left px-4 py-2 text-sm text-brand-600 font-bold">Admin Dashboard</button>
                             )}
                        </>
                    ) : (
                        <button onClick={() => handleMobileNavigate('login')} className="w-full bg-brand-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg mt-2 hover:bg-brand-800">
                            Login / Register
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </nav>
  );
};
