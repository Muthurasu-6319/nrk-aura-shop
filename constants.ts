
import { Product, User, GalleryItem, HomeContent, SiteSettings, AboutContent, Testimonial, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Kundan Heritage',
    price: 125000,
    shippingCost: 500,
    category: 'Traditional',
    description: 'A magnificent 22k gold bangle encrusted with uncut diamonds and rubies, inspired by Mughal architecture.',
    image: 'https://picsum.photos/seed/bangle1/600/600',
    tags: ['wedding', 'traditional', 'gold', 'luxury'],
    isVisible: true
  },
  {
    id: '2',
    name: 'Celestial Diamond Loop',
    price: 275000,
    shippingCost: 1000,
    category: 'Diamond',
    description: 'Modern minimalism meets eternal sparkle. A continuous loop of solitaire diamonds set in white gold.',
    image: 'https://picsum.photos/seed/bangle2/600/600',
    tags: ['modern', 'diamond', 'party', 'gift'],
    isVisible: true
  },
  {
    id: '3',
    name: 'Rose Gold Eternity',
    price: 75000,
    shippingCost: 0,
    category: 'Modern',
    description: 'Sleek, stackable, and sophisticated. Solid rose gold with a brushed finish.',
    image: 'https://picsum.photos/seed/bangle3/600/600',
    tags: ['daily wear', 'modern', 'rose gold', 'stackable'],
    isVisible: true
  },
  {
    id: '4',
    name: 'Jaipur Glass Kada',
    price: 12000,
    shippingCost: 200,
    category: 'Glass',
    description: 'Hand-painted vibrant glass bangles from the artisans of Jaipur. Adds a pop of color to any outfit.',
    image: 'https://picsum.photos/seed/bangle4/600/600',
    tags: ['traditional', 'colorful', 'budget', 'festival'],
    isVisible: true
  },
  {
    id: '5',
    name: 'Temple Gold Cuff',
    price: 180000,
    shippingCost: 500,
    category: 'Gold',
    description: 'Intricate carvings of temple deities on pure gold. A statement piece for cultural ceremonies.',
    image: 'https://picsum.photos/seed/bangle5/600/600',
    tags: ['religious', 'heavy', 'gold', 'statement'],
    isVisible: true
  },
  {
    id: '6',
    name: 'Platinum Wave',
    price: 210000,
    shippingCost: 750,
    category: 'Modern',
    description: 'Fluid design imitating ocean waves, crafted in pure platinum. Contemporary elegance.',
    image: 'https://picsum.photos/seed/bangle6/600/600',
    tags: ['office', 'platinum', 'modern', 'subtle'],
    isVisible: true
  },
  {
    id: '7',
    name: 'Emerald Embrace',
    price: 450000,
    shippingCost: 1500,
    category: 'Diamond',
    description: 'Deep green emeralds interspaced with brilliant cut diamonds.',
    image: 'https://picsum.photos/seed/bangle7/600/600',
    tags: ['luxury', 'emerald', 'evening', 'dinner'],
    isVisible: true
  },
  {
    id: '8',
    name: 'Vintage Polki Set',
    price: 280000,
    shippingCost: 500,
    category: 'Traditional',
    description: 'A set of 4 polki bangles that bring old-world charm to modern weddings.',
    image: 'https://picsum.photos/seed/bangle8/600/600',
    tags: ['vintage', 'wedding', 'set', 'polki'],
    isVisible: true
  }
];

export const INITIAL_USERS: User[] = [
    {
        id: 'admin1',
        name: 'NRK Admin',
        email: 'admin@nrkaura.com',
        role: 'admin',
        password: 'admin'
    },
    {
        id: 'user1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'user',
        password: 'user'
    }
];

export const INITIAL_REVIEWS: Review[] = [
    {
        id: '1',
        productId: '1',
        userId: 'user101',
        userName: 'Priya S.',
        rating: 5,
        comment: 'Absolutely breathtaking! The Kundan work is exquisite.',
        date: '2023-10-15'
    },
    {
        id: '2',
        productId: '1',
        userId: 'user102',
        userName: 'Rahul K.',
        rating: 4,
        comment: 'Beautiful design, but heavier than I expected.',
        date: '2023-11-02'
    },
    {
        id: '3',
        productId: '2',
        userId: 'user103',
        userName: 'Anita D.',
        rating: 5,
        comment: 'Shines like stars! Perfect for my engagement.',
        date: '2023-12-10'
    }
];

export const INITIAL_GALLERY: GalleryItem[] = [
    { id: '1', image: 'https://picsum.photos/seed/gal1/800/600', title: 'Summer Campaign', description: 'Shot in Udaipur' },
    { id: '2', image: 'https://picsum.photos/seed/gal2/800/600', title: 'Bridal Collection', description: 'The Royal Edit' },
    { id: '3', image: 'https://picsum.photos/seed/gal3/800/600', title: 'Craftsmanship', description: 'Behind the scenes' },
    { id: '4', image: 'https://picsum.photos/seed/gal4/800/600', title: 'Evening Gala', description: 'Diamond showcase' },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
    {
        id: '1',
        name: 'Ananya R.',
        title: 'Mumbai, India',
        content: "The craftsmanship is beyond words. Every bangle feels like a piece of history on my wrist.",
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
        id: '2',
        name: 'Priya Sharma',
        title: 'Bangalore',
        content: "Absolutely stunning collection. The customer service was impeccable and the packaging was so luxurious.",
        image: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
        id: '3',
        name: 'Emily Watson',
        title: 'London, UK',
        content: "I was skeptical about buying luxury jewelry online, but the AI stylist helped me find the perfect match. Truly exquisite.",
        image: 'https://randomuser.me/api/portraits/women/32.jpg'
    }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  brandName: "NRK AURA",
  brandSubtitle: "Luxury Bangles",
  logoUrl: "",
  logoHeight: "80",
  logoWidth: "auto",
  footerAboutTitle: "NRK AURA",
  footerAboutText: "Elevating the art of bangle making. Luxury defined by detail and tradition.",
  contactEmail: "concierge@nrkaura.com",
  socialInstagram: "https://instagram.com",
  socialFacebook: "https://facebook.com",
  socialPinterest: "https://pinterest.com",
  
  // Default Invoice Settings
  invoiceAddress: "NRK Aura Luxury Boutique\n123, Golden Mile Road,\nJubilee Hills, Hyderabad - 500033\nIndia",
  invoicePrefix: "INV-",
  orderPrefix: "ORD-",
};

export const INITIAL_HOME_CONTENT: HomeContent = {
  heroImage: "https://picsum.photos/seed/luxury_gold_dark/1920/1080",
  heroTitle: "NRK AURA",
  heroSubtitle: "LUXURY BANGLES",
  homeVideoUrl: "https://videos.pexels.com/video-files/5359870/5359870-hd_1280_720_25fps.mp4",
  
  // New Fields
  trendsSectionTitle: "Curated Trends",
  trendsSectionSubtitle: "Handpicked styles for the season.",
  
  trend1Image: "https://images.unsplash.com/photo-1637515670529-9942f22c588f?q=80&w=1000&auto=format&fit=crop",
  trend1Title: "Haldi- Mehendi\nTrend",
  trend2Image: "https://images.unsplash.com/photo-1573612664842-d43d7b543733?q=80&w=1000&auto=format&fit=crop",
  trend2Title: "Bridal Trend",

  videoSectionTitle: "POETRY IN\nMOTION",
  videoSectionSubtitle: "Cinematic Experience",
  
  featuredSectionTitle: "The Royal Edit",
  featuredSectionSubtitle: "Curated Selection",

  editorialImage: "https://picsum.photos/seed/gold_making/800/600",
  editorialTitle: "The NRK Legacy",
  editorialText: "At NRK Aura, we believe jewelry is an extension of your spirit. Every bangle is a masterpiece, forged with passion and precision. From the intricate detailing of our Temple collection to the sleek lines of our Modern edits, we bring you the finest in luxury.",
  editorialVideo: "https://videos.pexels.com/video-files/4930646/4930646-uhd_2560_1440_30fps.mp4", 
  marqueeText: "Pure Gold • Handcrafted Heritage • Luxury Redefined",
  testimonialText: "The craftsmanship is beyond words. Every bangle feels like a piece of history on my wrist.",
  testimonialAuthor: "Ananya R.",
  testimonialLocation: "Mumbai, India",
  testimonialImage: "https://randomuser.me/api/portraits/women/44.jpg"
};

export const INITIAL_ABOUT_CONTENT: AboutContent = {
  title: "About NRK Aura",
  subtitle: "Legacy of Elegance",
  heroImage: "https://picsum.photos/seed/jewelry_workshop/1920/800",
  
  // Stats
  stat1Value: "30+",
  stat1Label: "Years of Heritage",
  stat2Value: "5000+",
  stat2Label: "Exclusive Designs",
  stat3Value: "100%",
  stat3Label: "Ethically Sourced",
  
  storyTitle: "Crafting Eternity",
  storyText: "Founded on the principles of purity and precision, NRK Aura has been a beacon of luxury bangle craftsmanship for over three decades. Our artisans, hailing from the historic lineages of Jaipur and Kolkata, breathe life into gold and diamonds. We don't just make jewelry; we forge heirlooms that traverse generations, carrying stories of love, celebration, and heritage.",
  storyImage: "https://picsum.photos/seed/craftsman/800/800",

  craftsmanshipTitle: "The Art of Gold",
  craftsmanshipText: "In the quiet corners of our atelier, fire meets metal in a dance as old as time. Our master craftsmen, with hands weathered by experience and eyes sharp as the diamonds they set, transform raw elements into poetry.",
  craftsmanshipVideo: "https://videos.pexels.com/video-files/6700565/6700565-uhd_2560_1440_25fps.mp4",

  philosophyTitle: "Our Philosophy",
  philosophySubtitle: "The Pillars of Excellence",
  value1Title: "Purity",
  value1Desc: "We source only the finest, ethically mined gemstones and certified gold. Authenticity is the soul of our creations.",
  value2Title: "Innovation",
  value2Desc: "While rooted in tradition, we embrace modern technology to create designs that are lightweight yet resilient.",
  value3Title: "Eternity",
  value3Desc: "Every piece is designed to be timeless, transcending fleeting trends to become a cherished heirloom.",

  processTitle: "Our Process",
  processStep1Title: "The Sketch",
  processStep1Desc: "Every masterpiece begins with a thought, translated onto paper with precision.",
  processStep1Image: "https://images.unsplash.com/photo-1515923256456-352bb45225c6?q=80&w=800&auto=format&fit=crop",

  processStep2Title: "The Mold",
  processStep2Desc: "Lost-wax casting brings the 2D design into the 3rd dimension.",
  processStep2Image: "https://images.unsplash.com/photo-1617038220319-276d3cf6653f?q=80&w=800&auto=format&fit=crop",

  processStep3Title: "The Polish",
  processStep3Desc: "Hours of hand-polishing ensure the gold gleams with an inner fire.",
  processStep3Image: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=800&auto=format&fit=crop"
};
