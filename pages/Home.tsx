




import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Reveal } from '../components/Reveal';

interface HomeProps {
  onNavigate: (page: string) => void;
  onViewProduct: (product: Product) => void;
  onOpenStylist: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onViewProduct, onOpenStylist }) => {
  const { products, homeContent, testimonials } = useData();
  const featuredProducts = products.slice(0, 4);

  // Process marquee text
  const marqueeItems = Array(10).fill(homeContent.marqueeText.split('•')).flat();

  // Testimonial Slider State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (testimonials.length > 1) {
        const timer = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      
      {/* Hero Section - Advanced Parallax & Floating Elements */}
      <div className="relative min-h-[95vh] w-full overflow-hidden bg-brand-50 flex items-center">
        {/* Floating Animated Background Blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-gold-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8 order-2 lg:order-1 relative">
                <Reveal delay={100}>
                  <span className="inline-block py-2 px-4 rounded-full bg-white/80 backdrop-blur border border-gold-200 text-gold-600 text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-sm">
                    New Collections
                  </span>
                </Reveal>
                
                <Reveal delay={300}>
                  <h1 className="font-serif text-5xl md:text-8xl text-brand-900 leading-[1] font-medium tracking-tight">
                    {homeContent.heroTitle}<br/>
                    <span className="italic text-brand-500 text-4xl md:text-7xl block mt-2 font-light">{homeContent.heroSubtitle}</span>
                  </h1>
                </Reveal>

                <Reveal delay={500}>
                  <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed max-w-lg">
                     Experience the epitome of craftsmanship. Where timeless tradition meets modern emerald luxury.
                  </p>
                </Reveal>

                <Reveal delay={700}>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                      onClick={() => onNavigate('shop')}
                      className="px-10 py-4 bg-brand-900 text-white font-sans font-bold uppercase tracking-widest rounded-full hover:bg-brand-700 transition-all shadow-2xl hover:shadow-brand-500/40 hover:-translate-y-1"
                    >
                      Shop Now
                    </button>
                    <button 
                      onClick={onOpenStylist}
                      className="px-10 py-4 bg-white/50 backdrop-blur text-brand-900 border border-brand-200 font-sans font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all flex items-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      AI Stylist
                    </button>
                  </div>
                </Reveal>
            </div>
            
            <div className="relative order-1 lg:order-2 flex justify-center">
                 <Reveal className="w-full" delay={200}>
                    <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white rotate-2 hover:rotate-0 transition-all duration-1000 ease-out">
                        {/* Ken Burns Effect */}
                        <div className="overflow-hidden h-[600px]">
                           <img 
                               src={homeContent.heroImage} 
                               alt="Hero" 
                               className="w-full h-full object-cover animate-ken-burns"
                           />
                        </div>
                    </div>
                    <div className="absolute -bottom-12 -left-12 w-full h-full border-2 border-brand-300/50 rounded-[3rem] -z-10"></div>
                 </Reveal>
            </div>
        </div>
      </div>

      {/* Infinity Marquee Section - Dynamic */}
      <div className="bg-brand-900 py-4 overflow-hidden relative border-y border-brand-800">
         <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-brand-900 via-transparent to-brand-900 z-10"></div>
         <div className="whitespace-nowrap animate-marquee flex gap-8 items-center">
             {marqueeItems.map((text, i) => (
                 <React.Fragment key={i}>
                    <span className="text-brand-200 font-serif text-2xl italic">{text.trim()}</span>
                    <span className="text-brand-500">•</span>
                 </React.Fragment>
             ))}
         </div>
      </div>

      {/* Shop By Trend Section - Overlapping Cards */}
      <section className="py-32 max-w-7xl mx-auto w-full px-4">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
             <div>
                  <h2 className="font-serif text-5xl text-brand-900 mb-4">{homeContent.trendsSectionTitle}</h2>
                  <p className="text-gray-500 font-light text-lg">{homeContent.trendsSectionSubtitle}</p>
             </div>
             <button onClick={() => onNavigate('shop')} className="group flex items-center gap-2 text-brand-600 font-bold uppercase tracking-widest text-xs mt-6 md:mt-0 border-b border-brand-200 pb-1 hover:border-brand-600 transition-all">
                View All Collections
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
             </button>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           {/* Trend 1 */}
           <Reveal width="100%">
             <div className="group relative h-[600px] rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl" onClick={() => onNavigate('shop')}>
                <img 
                  src={homeContent.trend1Image} 
                  alt="Trend 1" 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-12 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                   <h3 className="font-serif text-4xl text-white mb-3 whitespace-pre-line">{homeContent.trend1Title}</h3>
                   <div className="h-1 w-20 bg-gold-400 rounded-full mb-4 origin-left transition-all duration-500 group-hover:w-32"></div>
                   <p className="text-white/90 font-light text-sm opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-4 group-hover:translate-y-0">Discover the golden hour collection.</p>
                </div>
             </div>
           </Reveal>

           {/* Trend 2 */}
           <Reveal width="100%" delay={200}>
             <div className="group relative h-[600px] rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl mt-0 md:mt-24" onClick={() => onNavigate('shop')}>
                <img 
                  src={homeContent.trend2Image} 
                  alt="Trend 2" 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-12 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                   <h3 className="font-serif text-4xl text-white mb-3 whitespace-pre-line">{homeContent.trend2Title}</h3>
                   <div className="h-1 w-20 bg-gold-400 rounded-full mb-4 origin-left transition-all duration-500 group-hover:w-32"></div>
                   <p className="text-white/90 font-light text-sm opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-4 group-hover:translate-y-0">Elegance for your special day.</p>
                </div>
             </div>
           </Reveal>
        </div>
      </section>

       {/* Cinematic Video Section */}
       {homeContent.homeVideoUrl && (
           <div className="w-full h-[80vh] relative overflow-hidden bg-black group">
               <video 
                 src={homeContent.homeVideoUrl} 
                 autoPlay 
                 muted 
                 loop 
                 playsInline
                 className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
               />
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                    <Reveal>
                         <span className="text-gold-300 uppercase tracking-[0.5em] text-xs font-bold mb-6 block animate-pulse">{homeContent.videoSectionSubtitle}</span>
                         <h2 className="font-serif text-6xl md:text-9xl text-white mix-blend-overlay opacity-90 whitespace-pre-line">{homeContent.videoSectionTitle}</h2>
                    </Reveal>
                    <Reveal delay={300}>
                        <button onClick={() => onNavigate('about')} className="mt-10 border border-white/30 bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-full uppercase text-xs font-bold tracking-widest hover:bg-white hover:text-brand-900 transition-all">
                            Watch Our Story
                        </button>
                    </Reveal>
               </div>
           </div>
       )}

      {/* Featured Section - Clean Grid */}
      <section className="py-32 px-4 w-full bg-brand-50 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
            <Reveal className="mx-auto w-full">
              <div className="text-center mb-24">
                  <span className="text-brand-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">{homeContent.featuredSectionSubtitle}</span>
                  <h2 className="font-serif text-5xl text-brand-900">{homeContent.featuredSectionTitle}</h2>
              </div>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <ProductCard product={p} onViewDetails={onViewProduct} />
                </Reveal>
            ))}
            </div>
        </div>
      </section>

      {/* Testimonials - Glassmorphism Slider - Dynamic */}
      <section className="py-20 relative bg-brand-800 overflow-hidden">
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-brand-600 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-gold-600 rounded-full blur-3xl opacity-20"></div>
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center h-[400px] flex items-center justify-center">
               {testimonials.length > 0 ? (
                   <div className="relative w-full transition-opacity duration-500">
                        <Reveal key={currentTestimonial}>
                            <div className="text-gold-400 text-6xl font-serif mb-6">"</div>
                            <p className="text-2xl md:text-4xl text-white font-serif italic leading-relaxed mb-8">
                                {testimonials[currentTestimonial].content}
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-14 h-14 bg-brand-200 rounded-full overflow-hidden border-2 border-gold-500/30">
                                    <img src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].name} className="w-full h-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-bold text-sm uppercase tracking-wide">{testimonials[currentTestimonial].name}</p>
                                    <p className="text-brand-300 text-xs font-bold tracking-wider uppercase">{testimonials[currentTestimonial].title}</p>
                                </div>
                            </div>
                        </Reveal>

                        {/* Slider Dots */}
                        <div className="flex justify-center gap-3 mt-12">
                            {testimonials.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentTestimonial(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        idx === currentTestimonial ? 'bg-gold-400 w-6' : 'bg-white/20 hover:bg-white/40'
                                    }`}
                                />
                            ))}
                        </div>
                   </div>
               ) : (
                   <div className="text-white opacity-50 italic">Testimonials loading or empty...</div>
               )}
          </div>
      </section>

      {/* Editorial / Legacy Section - Video Front, Image Back */}
      <section className="py-32 relative overflow-hidden bg-white">
         <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-10">
               <Reveal>
                 <h2 className="font-serif text-6xl text-brand-900 leading-[1.1]">{homeContent.editorialTitle}</h2>
               </Reveal>
               <Reveal delay={200}>
                 <div className="w-24 h-1 bg-gold-400"></div>
               </Reveal>
               <Reveal delay={400}>
                 <p className="text-gray-600 leading-loose text-xl font-light max-w-lg">
                   {homeContent.editorialText}
                 </p>
               </Reveal>
               <Reveal delay={600}>
                 <button onClick={() => onNavigate('about')} className="group inline-flex items-center gap-3 px-8 py-4 border border-brand-200 rounded-full text-brand-900 hover:bg-brand-900 hover:text-white transition-all uppercase text-xs font-bold tracking-widest">
                   Read Our Story
                   <span className="block w-8 h-[1px] bg-brand-900 group-hover:bg-white transition-colors"></span>
                 </button>
               </Reveal>
            </div>
            
            {/* Visual Composition: Video Front, Image Back */}
            <div className="flex-1 relative group">
               <Reveal delay={300} className="relative z-20" width="100%">
                 {/* Front Layer: Video */}
                 <div className="rounded-tl-[8rem] rounded-br-[8rem] overflow-hidden shadow-2xl border-4 border-white bg-black aspect-[4/5] md:aspect-auto md:h-[600px] w-full transition-transform duration-700 ease-out group-hover:-translate-y-4 group-hover:-translate-x-4">
                     {homeContent.editorialVideo ? (
                        <video 
                            src={homeContent.editorialVideo} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                            className="w-full h-full object-cover"
                        />
                     ) : (
                        <img 
                            src={homeContent.editorialImage} 
                            alt="Craftsmanship" 
                            className="w-full h-full object-cover" 
                        />
                     )}
                 </div>
               </Reveal>
               
               {/* Back Layer: Image (Offset) */}
               <div className="absolute top-0 left-0 w-full h-full translate-x-8 translate-y-8 rounded-tl-[8rem] rounded-br-[8rem] overflow-hidden z-10 shadow-inner opacity-60 transition-all duration-700">
                   <img 
                        src={homeContent.editorialImage} 
                        alt="Legacy Background" 
                        className="w-full h-full object-cover filter grayscale sepia-[0.3] contrast-125" 
                   />
                   <div className="absolute inset-0 bg-brand-900/20 mix-blend-multiply"></div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};