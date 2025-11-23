import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { GeminiStylist } from './components/GeminiStylist';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserProfile } from './pages/UserProfile';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { Terms } from './pages/Terms'; // NEW IMPORT
import { Privacy } from './pages/Privacy'; // NEW IMPORT
import { Product } from './types';
import { Reveal } from './components/Reveal';

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const { products, siteSettings, aboutContent } = useData();
  const { isAdmin, isAuthenticated } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSelectFromAI = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
        handleViewProduct(product);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onViewProduct={handleViewProduct} onOpenStylist={() => setIsStylistOpen(true)} />;
      case 'shop':
        return <Shop onViewProduct={handleViewProduct} />;
      case 'product':
        return selectedProduct ? (
          <ProductDetails 
            product={selectedProduct} 
            onBack={() => handleNavigate('shop')} 
            onNavigate={handleNavigate}
          />
        ) : (
          <Shop onViewProduct={handleViewProduct} />
        );
      case 'gallery':
        return <Gallery />;
      case 'contact':
        return <Contact />;
      case 'wishlist':
        return <Wishlist onViewProduct={handleViewProduct} onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'terms': // NEW ROUTE
        return <Terms onBack={() => handleNavigate('home')} />;
      case 'privacy': // NEW ROUTE
        return <Privacy onBack={() => handleNavigate('home')} />;
      case 'about':
        return (
            <div className="min-h-screen bg-brand-50 flex flex-col">
                {/* About Hero - Parallax Effect */}
                <div className="relative h-[70vh] w-full overflow-hidden fixed-bg-hack">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img src={aboutContent.heroImage} alt="About Hero" className="w-full h-full object-cover animate-ken-burns fixed top-0 left-0 -z-10 h-full opacity-50" /> 
                     <img src={aboutContent.heroImage} alt="About Hero" className="absolute inset-0 w-full h-full object-cover animate-ken-burns" />
                    <div className="absolute inset-0 z-20 flex items-center justify-center flex-col text-center p-4">
                         <Reveal>
                            <span className="text-brand-300 uppercase tracking-[0.5em] text-xs font-bold mb-6 block animate-pulse">{aboutContent.subtitle}</span>
                         </Reveal>
                         <Reveal delay={200}>
                            <h1 className="font-serif text-6xl md:text-8xl text-white drop-shadow-lg">{aboutContent.title}</h1>
                         </Reveal>
                    </div>
                </div>

                {/* Stats / Legacy Section */}
                <div className="bg-brand-900 text-white py-16 border-b border-brand-800 relative z-30">
                    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-brand-800">
                         <Reveal delay={100}>
                             <div className="p-4">
                                 <p className="text-5xl font-serif text-gold-400 mb-2">{aboutContent.stat1Value}</p>
                                 <p className="text-xs uppercase tracking-widest text-brand-200">{aboutContent.stat1Label}</p>
                             </div>
                         </Reveal>
                         <Reveal delay={300}>
                             <div className="p-4">
                                 <p className="text-5xl font-serif text-gold-400 mb-2">{aboutContent.stat2Value}</p>
                                 <p className="text-xs uppercase tracking-widest text-brand-200">{aboutContent.stat2Label}</p>
                             </div>
                         </Reveal>
                         <Reveal delay={500}>
                             <div className="p-4">
                                 <p className="text-5xl font-serif text-gold-400 mb-2">{aboutContent.stat3Value}</p>
                                 <p className="text-xs uppercase tracking-widest text-brand-200">{aboutContent.stat3Label}</p>
                             </div>
                         </Reveal>
                    </div>
                </div>
                
                {/* Animated Legacy Section */}
                <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-brand-950 py-20 z-30">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-shimmer"></div>
                    
                    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                        <Reveal>
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-gold-500 to-brand-500 rounded-full opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-1000 animate-pulse"></div>
                                <img 
                                    src={aboutContent.storyImage} 
                                    alt="Legacy" 
                                    className="relative rounded-[3rem] border-2 border-gold-500/30 w-full max-w-md mx-auto shadow-2xl transform transition-transform duration-700 hover:scale-105 hover:rotate-2 object-cover"
                                />
                            </div>
                        </Reveal>
                        
                        <Reveal delay={200}>
                            <div className="text-center md:text-left space-y-6">
                                <h2 className="text-5xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600 mb-6">
                                    {aboutContent.storyTitle}
                                </h2>
                                <p className="text-gold-100 text-lg leading-loose font-light">
                                    {aboutContent.storyText}
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Bespoke Section: Craftsmanship */}
                <div className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center z-30 group">
                     <div className="absolute inset-0 bg-black/60 z-10"></div>
                     {aboutContent.craftsmanshipVideo && (
                        <video 
                            src={aboutContent.craftsmanshipVideo} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[10s]"
                        />
                     )}
                     <div className="relative z-20 text-center max-w-4xl px-4">
                         <Reveal>
                            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Behind The Scenes</span>
                            <h2 className="font-serif text-6xl text-white mb-8 leading-tight">{aboutContent.craftsmanshipTitle}</h2>
                            <p className="text-brand-100 text-xl leading-relaxed font-light">{aboutContent.craftsmanshipText}</p>
                         </Reveal>
                     </div>
                </div>

                {/* Bespoke Section: Philosophy */}
                <div className="bg-brand-950 py-32 px-4 overflow-hidden relative z-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-5"></div>
                    <div className="max-w-7xl mx-auto">
                         <Reveal className="text-center mb-20">
                            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">{aboutContent.philosophySubtitle}</span>
                            <h2 className="font-serif text-5xl text-white mb-6">{aboutContent.philosophyTitle}</h2>
                            <div className="w-24 h-1 bg-brand-700 mx-auto rounded-full"></div>
                         </Reveal>
                         
                         <div className="flex flex-col lg:flex-row gap-4 lg:h-[500px]">
                             {[1, 2, 3].map((num, idx) => {
                                 const title = (aboutContent as any)[`value${num}Title`];
                                 const desc = (aboutContent as any)[`value${num}Desc`];
                                 
                                 return (
                                     <div 
                                        key={num}
                                        className="relative flex-1 lg:hover:flex-[2] bg-brand-900 border border-brand-800 rounded-2xl overflow-hidden transition-all duration-700 ease-in-out group min-h-[200px] lg:min-h-0"
                                     >
                                         <div className="absolute inset-0 bg-gradient-to-br from-brand-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                         <div className="absolute -right-10 -bottom-10 text-9xl font-serif text-brand-950 opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:-translate-y-4 group-hover:-translate-x-4 select-none">
                                             0{num}
                                         </div>
                                         
                                         <div className="relative z-10 h-full flex flex-col justify-center p-10">
                                             <div className="w-12 h-12 rounded-full bg-brand-800 border border-brand-700 flex items-center justify-center mb-6 group-hover:bg-gold-500 group-hover:text-brand-950 transition-colors duration-500">
                                                  <span className="font-serif font-bold text-xl">{num}</span>
                                             </div>
                                             <h3 className="font-serif text-3xl text-white mb-4 whitespace-nowrap">{title}</h3>
                                             <p className="text-brand-200 text-lg leading-relaxed opacity-0 lg:opacity-0 lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100 block">
                                                 {desc}
                                             </p>
                                             <p className="lg:hidden text-brand-200 text-sm mt-2">{desc}</p>
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>
                    </div>
                </div>

                {/* Bespoke Section: Process Grid */}
                <div className="bg-white py-32 z-30">
                    <div className="max-w-7xl mx-auto px-4">
                        <Reveal className="text-center mb-20 mx-auto">
                             <h2 className="font-serif text-5xl text-brand-900 mb-4">{aboutContent.processTitle}</h2>
                             <div className="w-24 h-1 bg-brand-200 mx-auto"></div>
                        </Reveal>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                             {[1, 2, 3].map((num, index) => {
                                 const stepTitle = (aboutContent as any)[`processStep${num}Title`];
                                 const stepDesc = (aboutContent as any)[`processStep${num}Desc`];
                                 const stepImg = (aboutContent as any)[`processStep${num}Image`];

                                 return (
                                     <Reveal key={num} delay={index * 200} className="group cursor-pointer">
                                         <div className="relative overflow-hidden rounded-2xl h-80 mb-8 shadow-lg">
                                             <img src={stepImg} alt={stepTitle} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                             <div className="absolute inset-0 bg-brand-900/20 group-hover:bg-brand-900/0 transition-colors"></div>
                                             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-brand-900">
                                                 Step 0{num}
                                             </div>
                                         </div>
                                         <h3 className="text-2xl font-serif text-brand-900 mb-3 group-hover:text-brand-600 transition-colors">{stepTitle}</h3>
                                         <p className="text-gray-500 font-light leading-relaxed">{stepDesc}</p>
                                     </Reveal>
                                 )
                             })}
                        </div>
                    </div>
                </div>

            </div>
        );
      case 'login':
          return <Login onNavigate={handleNavigate} />;
      case 'admin':
          return isAdmin ? <AdminDashboard onNavigate={handleNavigate} /> : <div className="p-20 text-center">Access Denied. Admins only.</div>;
      case 'profile':
          return isAuthenticated ? <UserProfile /> : <Login onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} onViewProduct={handleViewProduct} onOpenStylist={() => setIsStylistOpen(true)} />;
    }
  };

  return (
      <div className="min-h-screen bg-brand-50 flex flex-col font-sans text-gray-800 relative">
        <div className="noise-overlay"></div>

        {currentPage !== 'admin' && <Navbar onNavigate={handleNavigate} currentPage={currentPage} />}
        
        <main className="flex-grow">
          {renderPage()}
        </main>
        
        {currentPage !== 'admin' && <CartDrawer onNavigate={handleNavigate} />}
        
        {isStylistOpen && currentPage !== 'admin' && (
          <GeminiStylist 
            onClose={() => setIsStylistOpen(false)} 
            onSelectProduct={handleProductSelectFromAI}
          />
        )}

        {!isStylistOpen && currentPage !== 'admin' && currentPage !== 'login' && (
            <button 
                onClick={() => setIsStylistOpen(true)}
                className="fixed bottom-8 right-8 bg-brand-900 text-white p-4 rounded-full shadow-2xl hover:bg-brand-800 transition-all z-30 flex items-center gap-2 group border border-brand-700 hover:scale-105 animate-float"
            >
                <span className="w-3 h-3 bg-gold-400 rounded-full animate-pulse"></span>
                <span className="font-bold pr-2 group-hover:pl-1 transition-all font-sans tracking-widest text-xs">AI STYLIST</span>
            </button>
        )}

        {currentPage !== 'admin' && (
            <footer className="bg-brand-900 text-white py-24 px-4 border-t border-brand-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-900 via-brand-500 to-brand-900"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
                <div>
                {siteSettings.logoUrl ? (
                     <img src={siteSettings.logoUrl} alt="Logo" className="h-12 w-auto mb-8 brightness-0 invert" />
                ) : (
                     <h2 className="font-serif text-4xl tracking-wide mb-8 text-white">{siteSettings.footerAboutTitle}</h2>
                )}
                <p className="text-brand-200 text-sm leading-loose max-w-xs">{siteSettings.footerAboutText}</p>
                </div>
                <div>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-8 text-brand-400">Explore</h3>
                    <ul className="space-y-4 text-sm text-brand-100">
                        <li><button onClick={() => handleNavigate('shop')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Shop Collection</button></li>
                        <li><button onClick={() => handleNavigate('gallery')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Gallery</button></li>
                        <li><button onClick={() => handleNavigate('about')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Our Story</button></li>
                        {/* NEW FOOTER LINKS */}
                        <li><button onClick={() => handleNavigate('terms')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Terms & Conditions</button></li>
                        <li><button onClick={() => handleNavigate('privacy')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Privacy Policy</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-8 text-brand-400">Connect</h3>
                    <div className="flex gap-6">
                        <a href={siteSettings.socialInstagram} target="_blank" rel="noreferrer" className="text-brand-200 hover:text-white transition-colors hover:scale-110 transform inline-block">Instagram</a>
                        <a href={siteSettings.socialPinterest} target="_blank" rel="noreferrer" className="text-brand-200 hover:text-white transition-colors hover:scale-110 transform inline-block">Pinterest</a>
                        <a href={siteSettings.socialFacebook} target="_blank" rel="noreferrer" className="text-brand-200 hover:text-white transition-colors hover:scale-110 transform inline-block">Facebook</a>
                    </div>
                    <p className="mt-12 text-xs text-brand-600">© 2025 {siteSettings.brandName}. All rights reserved.</p>
                </div>
            </div>
            </footer>
        )}
      </div>
  );
};

const App: React.FC = () => {
    return (
        <DataProvider>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <MainApp />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </DataProvider>
    );
}

export default App;