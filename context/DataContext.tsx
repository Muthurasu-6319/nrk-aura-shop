import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, User, GalleryItem, HomeContent, SiteSettings, AboutContent, Testimonial, Review, Order, OrderStatus } from '../types';
import { INITIAL_USERS, INITIAL_GALLERY, INITIAL_HOME_CONTENT, INITIAL_SITE_SETTINGS, INITIAL_ABOUT_CONTENT, INITIAL_TESTIMONIALS, INITIAL_REVIEWS } from '../constants';
import { API_URL } from '../utils/api';

interface DataContextType {
    isLoading: boolean;
    products: Product[];
    users: User[];
    gallery: GalleryItem[];
    testimonials: Testimonial[];
    reviews: Review[];
    orders: Order[];
    homeContent: HomeContent;
    aboutContent: AboutContent;
    siteSettings: SiteSettings;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
    addUser: (user: User) => void;
    updateUser: (user: User) => void;
    deleteUser: (id: string) => void;
    toggleUserStatus: (id: string, currentStatus: 'active' | 'inactive') => void;
    addGalleryItem: (item: GalleryItem) => void;
    updateGalleryItem: (item: GalleryItem) => void;
    deleteGalleryItem: (id: string) => void;
    addTestimonial: (item: Testimonial) => void;
    updateTestimonial: (item: Testimonial) => void;
    deleteTestimonial: (id: string) => void;
    addReview: (review: Review) => void;
    deleteReview: (id: string) => void;
    addOrder: (order: Order) => void;
    deleteOrder: (id: string) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    updateHomeContent: (content: HomeContent) => void;
    updateAboutContent: (content: AboutContent) => void;
    updateSiteSettings: (settings: SiteSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);

    // DB Managed State
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
    const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
    const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
    const [homeContent, setHomeContent] = useState<HomeContent>(INITIAL_HOME_CONTENT);
    const [aboutContent, setAboutContent] = useState<AboutContent>(INITIAL_ABOUT_CONTENT);
    const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const loadDB = async () => {
            try {
                const [prodRes, homeRes, aboutRes, galRes, testRes, userRes, settRes, revRes, orderRes] = await Promise.all([
                    fetch(`${API_URL}/products`).catch(() => null),
                    fetch(`${API_URL}/home-content`).catch(() => null),
                    fetch(`${API_URL}/about-content`).catch(() => null),
                    fetch(`${API_URL}/gallery`).catch(() => null),
                    fetch(`${API_URL}/testimonials`).catch(() => null),
                    fetch(`${API_URL}/users`).catch(() => null),
                    fetch(`${API_URL}/site-settings`).catch(() => null),
                    fetch(`${API_URL}/reviews`).catch(() => null),
                    fetch(`${API_URL}/orders`).catch(() => null)
                ]);

                if (prodRes?.ok) { const d = await prodRes.json(); if (Array.isArray(d)) setProducts(d); }
                if (homeRes?.ok) { const d = await homeRes.json(); if (d) setHomeContent(d); }
                if (aboutRes?.ok) { const d = await aboutRes.json(); if (d) setAboutContent(d); }
                if (galRes?.ok) { const d = await galRes.json(); if (Array.isArray(d)) setGallery(d); }
                if (testRes?.ok) { const d = await testRes.json(); if (Array.isArray(d)) setTestimonials(d); }
                if (userRes?.ok) { const d = await userRes.json(); if (Array.isArray(d)) setUsers(d); }
                if (settRes?.ok) { const d = await settRes.json(); if (d) setSiteSettings(prev => ({ ...prev, ...d })); }
                if (revRes?.ok) { const d = await revRes.json(); if (Array.isArray(d)) setReviews(d); }
                if (orderRes?.ok) { const d = await orderRes.json(); if (Array.isArray(d)) setOrders(d); }

            } catch (err) {
                console.error("Data Load Error:", err);
            } finally {
                setTimeout(() => setIsLoading(false), 500);
            }
        };
        loadDB();
    }, []);

    const addProduct = async (product: Product) => {
        setProducts(prev => [product, ...prev]);
        try {
            await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: product.id, name: product.name, price: product.price, category: product.category, description: product.description, image: product.image, shippingCost: product.shippingCost || 0, isVisible: product.isVisible !== undefined ? product.isVisible : true
                })
            });
        } catch (e) { console.error("Error adding product:", e); }
    };

    const updateProduct = async (product: Product) => {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        try {
            await fetch(`${API_URL}/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: product.name, price: product.price, category: product.category, description: product.description, image: product.image, shippingCost: product.shippingCost || 0, isVisible: product.isVisible
                })
            });
        } catch (e) { console.error(e); }
    };

    const deleteProduct = async (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        try { await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    };

    const addReview = async (review: Review) => {
        setReviews(prev => [review, ...prev]);
        try {
            await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(review)
            });
        } catch (e) { console.error("Error adding review:", e); }
    };

    const deleteReview = async (id: string) => {
        setReviews(prev => prev.filter(r => r.id !== id));
        try { await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    };

    const addUser = (user: User) => setUsers(prev => [...prev, user]);

    const updateUser = (user: User) => setUsers(prev => prev.map(u => u.id === user.id ? user : u));

    const toggleUserStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        try { await fetch(`${API_URL}/users/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) }); } catch (e) { console.error(e); }
    };

    const deleteUser = async (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        try { await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    };

    const addGalleryItem = async (item: GalleryItem) => {
        setGallery(prev => [...prev, item]);
        try { await fetch(`${API_URL}/gallery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }); } catch (e) { console.error(e); }
    };

    const updateGalleryItem = async (item: GalleryItem) => {
        setGallery(prev => prev.map(g => g.id === item.id ? item : g));
        try { await fetch(`${API_URL}/gallery/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }); } catch (e) { console.error(e); }
    };

    const deleteGalleryItem = async (id: string) => {
        setGallery(prev => prev.filter(g => g.id !== id));
        try { await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    };

    const addTestimonial = async (item: Testimonial) => {
        setTestimonials(prev => [...prev, item]);
        try { await fetch(`${API_URL}/testimonials`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }); } catch (e) { console.error(e); }
    };

    const updateTestimonial = async (item: Testimonial) => {
        setTestimonials(prev => prev.map(t => t.id === item.id ? item : t));
        try { await fetch(`${API_URL}/testimonials/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }); } catch (e) { console.error(e); }
    };

    const deleteTestimonial = async (id: string) => {
        setTestimonials(prev => prev.filter(t => t.id !== id));
        try { await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    };

    const updateHomeContent = async (content: HomeContent) => {
        setHomeContent(content);
        try { await fetch(`${API_URL}/home-content`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) }); } catch (e) { console.error(e); }
    };

    const updateAboutContent = async (content: AboutContent) => {
        setAboutContent(content);
        try { await fetch(`${API_URL}/about-content`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) }); } catch (e) { console.error(e); }
    };

    const updateSiteSettings = async (settings: SiteSettings) => {
        setSiteSettings(settings);
        try { await fetch(`${API_URL}/site-settings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) }); } catch (e) { console.error(e); }
    };

    const addOrder = (order: Order) => {
        setOrders(prev => [order, ...prev]);
    };

    const deleteOrder = async (id: string) => {
        setOrders(prev => prev.filter(o => o.id !== id));
        try { await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        try {
            await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
        } catch (error) {
            console.error("Failed to update order status", error);
        }
    };

    return (
        <DataContext.Provider value={{
            isLoading, products, users, gallery, testimonials, reviews, orders, homeContent, aboutContent, siteSettings,
            addProduct, updateProduct, deleteProduct,
            addUser, updateUser, deleteUser, toggleUserStatus,
            addGalleryItem, updateGalleryItem, deleteGalleryItem,
            addTestimonial, updateTestimonial, deleteTestimonial,
            addReview, deleteReview,
            addOrder, deleteOrder, updateOrderStatus,
            updateHomeContent, updateAboutContent, updateSiteSettings
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within a DataProvider");
    return context;
};