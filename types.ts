
export interface Product {
  id: string;
  name: string;
  price: number;
  shippingCost?: number; // New field
  category: string;
  description: string;
  image: string;
  tags: string[];
  isVisible?: boolean; // New field for On/Off toggle
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AIRecommendation {
  productId: string;
  reason: string;
}

export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  // New Profile Fields
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  content: string;
  image: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ShippingDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    state: string;
}

export interface Order {
    id: string;
    userId: string;
    date: string;
    status: OrderStatus;
    total: number;
    items: CartItem[];
    shippingDetails: ShippingDetails;
    paymentMethod: string;
}

export interface SiteSettings {
  brandName: string;
  brandSubtitle: string;
  logoUrl: string;
  logoHeight: string;
  logoWidth: string;
  footerAboutTitle: string;
  footerAboutText: string;
  contactEmail: string;
  socialInstagram: string;
  socialFacebook: string;
  socialPinterest: string;
  
  // Invoice Settings
  invoiceAddress: string;
  invoicePrefix: string;
  orderPrefix: string;
}

export interface HomeContent {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  homeVideoUrl: string;
  
  // New Customizable Titles
  trendsSectionTitle: string;
  trendsSectionSubtitle: string;
  
  trend1Image: string;
  trend1Title: string;
  trend2Image: string;
  trend2Title: string;
  
  videoSectionTitle: string;
  videoSectionSubtitle: string;
  
  featuredSectionTitle: string;
  featuredSectionSubtitle: string;

  editorialImage: string;
  editorialTitle: string;
  editorialText: string;
  editorialVideo: string;
  marqueeText: string;
  testimonialText: string; // Legacy field, kept for type safety
  testimonialAuthor: string; // Legacy field
  testimonialLocation: string; // Legacy field
  testimonialImage: string; // Legacy field
}

export interface AboutContent {
  title: string;
  subtitle: string;
  heroImage: string;
  
  // Stats Section
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;

  storyTitle: string;
  storyText: string;
  storyImage: string;

  // Bespoke Section: Craftsmanship (Video)
  craftsmanshipTitle: string;
  craftsmanshipText: string;
  craftsmanshipVideo: string;

  // Bespoke Section: Philosophy (Replaces Designer)
  philosophyTitle: string;
  philosophySubtitle: string;
  value1Title: string;
  value1Desc: string;
  value2Title: string;
  value2Desc: string;
  value3Title: string;
  value3Desc: string;

  // Bespoke Section: Process (3 Steps)
  processTitle: string;
  processStep1Title: string;
  processStep1Desc: string;
  processStep1Image: string;
  processStep2Title: string;
  processStep2Desc: string;
  processStep2Image: string;
  processStep3Title: string;
  processStep3Desc: string;
  processStep3Image: string;
}
