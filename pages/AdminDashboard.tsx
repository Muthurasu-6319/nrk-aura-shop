import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext';
// Assuming 'Review' type is added to your types file
import { Product, User, GalleryItem, HomeContent, SiteSettings, AboutContent, Testimonial, OrderStatus, Order, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { InvoiceModal } from '../components/InvoiceModal';

interface AdminDashboardProps {
    onNavigate: (page: string) => void;
}

// ----------------------------------------------------
// Helper Components for Header (Mobile/Desktop)
// ----------------------------------------------------
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface AdminHeaderProps {
    siteSettings: SiteSettings;
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
    onLogout: () => void;
    onNavigate: (page: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ siteSettings, onToggleSidebar, isSidebarOpen, onLogout, onNavigate }) => (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-30 lg:ml-72 shadow-md">
        <div className="flex items-center gap-4">
            <button onClick={onToggleSidebar} className="text-brand-900 lg:hidden p-2 rounded-lg hover:bg-brand-50 transition-colors">
                {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <h1 className="text-xl font-serif font-bold text-brand-900 hidden sm:block">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 px-3 py-2 text-brand-700 hover:text-white hover:bg-brand-800 border border-brand-200 rounded-lg transition-colors"
            >
                Back to Site
            </button>
            <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-white hover:bg-red-500 border border-red-200 rounded-lg transition-colors"
            >
                Logout
            </button>
        </div>
    </header>
);

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    // NOTE: Added 'reviews', 'deleteOrder', and 'deleteReview' to the useData destructuring.
    const { 
        products, users, gallery, testimonials, homeContent, siteSettings, aboutContent, orders, reviews,
        addProduct, deleteProduct, updateProduct, 
        addUser, deleteUser, toggleUserStatus, 
        addGalleryItem, deleteGalleryItem, updateGalleryItem,
        addTestimonial, deleteTestimonial, updateTestimonial,
        updateHomeContent, updateSiteSettings, updateAboutContent, 
        updateOrderStatus, deleteOrder, deleteReview // New/Modified actions from Context
    } = useData();
    const { logout } = useAuth();
    
    // State for UI/Navigation
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'reviews' | 'users' | 'gallery' | 'testimonials' | 'home' | 'about' | 'settings'>('products');
    const [settingsSubTab, setSettingsSubTab] = useState<'header' | 'footer' | 'invoice'>('header');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state for mobile

    // Order View State
    const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
    const [documentType, setDocumentType] = useState<'invoice' | 'slip' | null>(null);
    const viewingOrder = useMemo(() => orders.find(o => o.id === viewingOrderId) || null, [orders, viewingOrderId]);

    // Product State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [prodForm, setProdForm] = useState<Partial<Product>>({
        name: '', price: 0, shippingCost: 0, category: 'Gold', description: '', image: '', tags: [], isVisible: true
    });
    
    // Gallery State
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
    const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({ title: '', image: '', description: '' });

    // Testimonial State
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({ name: '', title: '', content: '', image: '' });

    // Settings & Content Forms
    const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
    const [homeForm, setHomeForm] = useState<HomeContent>(homeContent);
    const [aboutForm, setAboutForm] = useState<AboutContent>(aboutContent);

    // Sync forms when Context data changes (Backend Load)
    useEffect(() => {
        setSettingsForm(siteSettings);
        setHomeForm(homeContent);
        setAboutForm(aboutContent);
    }, [siteSettings, homeContent, aboutContent]);

    // --- Handlers ---
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setProdForm(product);
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const newProductData = { 
            ...prodForm, 
            isVisible: prodForm.isVisible !== undefined ? prodForm.isVisible : true,
            shippingCost: prodForm.shippingCost !== undefined ? prodForm.shippingCost : 0 
        };
        if (editingProduct) updateProduct({ ...editingProduct, ...newProductData } as Product);
        else addProduct({ ...newProductData, id: Date.now().toString() } as Product);
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProdForm({ name: '', price: 0, shippingCost: 0, category: 'Gold', description: '', image: '', tags: [], isVisible: true });
    };

    const toggleProductVisibility = (product: Product) => { updateProduct({ ...product, isVisible: !product.isVisible }); };

    const handleEditGalleryItem = (item: GalleryItem) => { setEditingGalleryItem(item); setGalleryForm(item); setIsGalleryModalOpen(true); };
    const handleSaveGalleryItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingGalleryItem) updateGalleryItem({ ...editingGalleryItem, ...galleryForm } as GalleryItem);
        else addGalleryItem({ ...galleryForm, id: Date.now().toString() } as GalleryItem);
        setIsGalleryModalOpen(false); setEditingGalleryItem(null); setGalleryForm({ title: '', image: '', description: '' });
    };

    const handleEditTestimonial = (item: Testimonial) => { setEditingTestimonial(item); setTestimonialForm(item); setIsTestimonialModalOpen(true); };
    const handleSaveTestimonial = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTestimonial) updateTestimonial({ ...editingTestimonial, ...testimonialForm } as Testimonial);
        else addTestimonial({ ...testimonialForm, id: Date.now().toString() } as Testimonial);
        setIsTestimonialModalOpen(false); setEditingTestimonial(null); setTestimonialForm({ name: '', title: '', content: '', image: '' });
    };

    const handleSaveHomeContent = (e: React.FormEvent) => { e.preventDefault(); updateHomeContent(homeForm); alert("Home page content updated!"); };
    const handleSaveAboutContent = (e: React.FormEvent) => { e.preventDefault(); updateAboutContent(aboutForm); alert("About page content updated!"); };
    const handleSaveSettings = (e: React.FormEvent) => { e.preventDefault(); updateSiteSettings(settingsForm); alert("Global site settings updated!"); };
    
    const handleLogout = () => { logout(); onNavigate('home'); };

    // --- Order and Review Delete Handlers ---
    const handleDeleteOrder = (id: string) => {
        if(window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            deleteOrder(id);
        }
    };

    const handleDeleteReview = (id: string) => {
        if(window.confirm("Are you sure you want to delete this review?")) {
            deleteReview(id);
        }
    };
    
    // Handler to close sidebar on tab click in mobile view
    const handleTabClick = (tab: string) => {
        setActiveTab(tab as any);
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) { 
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-50 flex font-sans text-gray-800">
            
            {/* --- 1. Global Header (Mobile Menu & Logout/Back to Site) --- */}
            <AdminHeader
                siteSettings={siteSettings}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onLogout={handleLogout}
                onNavigate={onNavigate}
            />

            {/* Document Modal (Invoice or Packing Slip) */}
            {viewingOrder && documentType && (
                <InvoiceModal 
                    order={viewingOrder} 
                    settings={siteSettings} 
                    type={documentType}
                    onClose={() => setDocumentType(null)} 
                />
            )}

            {/* --- 2. Collapsible Sidebar --- */}
            <div className={`
                fixed top-0 left-0 w-72 bg-brand-900 text-white flex flex-col shadow-2xl z-40 h-full transition-transform duration-300
                lg:translate-x-0 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-8 border-b border-brand-800 flex flex-col items-center bg-brand-950">
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-xl rotate-45 bg-brand-800 shadow-inner border border-brand-700">
                        <span className="font-serif text-2xl font-bold text-gold-400 -rotate-45">
                            {siteSettings.brandName.charAt(0)}
                        </span>
                    </div>
                    <span className="font-serif text-xs text-brand-300 tracking-[0.3em] uppercase mt-6 font-bold">Admin Panel</span>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
                    {['Products', 'Orders', 'Reviews', 'Users', 'Gallery', 'Testimonials', 'Home', 'About', 'Settings'].map(tab => (
                        <button 
                            key={tab}
                            // Use handleTabClick to also close the sidebar on mobile
                            onClick={() => handleTabClick(tab.toLowerCase())} 
                            className={`w-full text-left px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.toLowerCase() ? 'bg-brand-700 text-white shadow-lg' : 'text-brand-300 hover:bg-brand-800 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
                {/* Removed Back to Site and Logout from the footer of the sidebar */}
                <div className="p-6 border-t border-brand-800 bg-brand-950 text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} {siteSettings.brandName}
                </div>
            </div>

            {/* Backdrop for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- 3. Main Content Area (Adjusted padding for fixed header) --- */}
            <div className="flex-1 lg:ml-72 p-4 pt-20 sm:p-10 sm:pt-24 overflow-y-auto w-full">
                
                {/* Detailed Order View Modal (Dashboard Overlay) */}
                {viewingOrder && !documentType && (
                    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
                                <h2 className="text-2xl font-serif text-brand-900 font-bold flex items-center gap-3">
                                    Order #{viewingOrder.id} details
                                </h2>
                                <button onClick={() => setViewingOrderId(null)} className="text-gray-400 hover:text-gray-600">
                                    <CloseIcon className="w-6 h-6"/>
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                                {/* Top Row: Status & Date */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-100 mb-6 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Order Date</p>
                                        <p className="text-lg font-serif text-brand-900">{viewingOrder.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Payment Method</p>
                                        <p className="text-sm text-gray-600 capitalize">{viewingOrder.paymentMethod}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Status:</label>
                                        <select 
                                            value={viewingOrder.status}
                                            onChange={(e) => updateOrderStatus(viewingOrder.id, e.target.value as OrderStatus)}
                                            className="bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm font-bold text-brand-900 outline-none focus:border-brand-500"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Billing & Shipping Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-100">
                                        <h3 className="font-serif text-lg text-brand-900 mb-4 border-b pb-2">Billing Details</h3>
                                        <p className="font-bold text-gray-800">{viewingOrder.shippingDetails.firstName} {viewingOrder.shippingDetails.lastName}</p>
                                        <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">
                                            {viewingOrder.shippingDetails.address}<br/>
                                            {viewingOrder.shippingDetails.city}, {viewingOrder.shippingDetails.state} {viewingOrder.shippingDetails.zip}
                                        </p>
                                        <div className="mt-4 space-y-1">
                                            <p className="text-sm text-gray-600"><span className="font-bold">Email:</span> {viewingOrder.shippingDetails.email}</p>
                                            <p className="text-sm text-gray-600"><span className="font-bold">Phone:</span> {viewingOrder.shippingDetails.phone}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-100">
                                        <h3 className="font-serif text-lg text-brand-900 mb-4 border-b pb-2 flex justify-between">Shipping Details</h3>
                                        <p className="font-bold text-gray-800">{viewingOrder.shippingDetails.firstName} {viewingOrder.shippingDetails.lastName}</p>
                                        <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">
                                            {viewingOrder.shippingDetails.address}<br/>
                                            {viewingOrder.shippingDetails.city}, {viewingOrder.shippingDetails.state} {viewingOrder.shippingDetails.zip}
                                        </p>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden mb-6">
                                    <table className="w-full text-left">
                                        <thead className="bg-brand-50 border-b border-brand-100">
                                            <tr>
                                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Item</th>
                                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Price</th>
                                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-center">Qty</th>
                                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {viewingOrder.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-4 flex items-center gap-4">
                                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                                                        <div>
                                                            <p className="font-bold text-brand-900 text-sm">{item.name}</p>
                                                            <p className="text-xs text-gray-400">SKU: {item.id}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right text-sm text-gray-600">₹{item.price.toLocaleString('en-IN')}</td>
                                                    <td className="p-4 text-center text-sm font-bold text-gray-800">{item.quantity}</td>
                                                    <td className="p-4 text-right text-sm font-bold text-brand-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-brand-50/50">
                                            <tr>
                                                <td colSpan={3} className="p-4 text-right text-sm font-bold text-gray-500">Subtotal</td>
                                                <td className="p-4 text-right text-sm font-bold text-gray-800">₹{Math.round(viewingOrder.total / 1.03).toLocaleString('en-IN')}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="p-4 text-right text-sm font-bold text-gray-500">Tax</td>
                                                <td className="p-4 text-right text-sm font-bold text-gray-800">₹{Math.round(viewingOrder.total - (viewingOrder.total / 1.03)).toLocaleString('en-IN')}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="p-4 text-right text-lg font-serif font-bold text-brand-900">Total</td>
                                                <td className="p-4 text-right text-lg font-serif font-bold text-brand-900">₹{viewingOrder.total.toLocaleString('en-IN')}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                
                                {/* Actions Panel */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-100">
                                    <h3 className="font-serif text-lg text-brand-900 mb-4">Document Actions</h3>
                                    <div className="flex gap-4">
                                            <button 
                                                onClick={() => setDocumentType('invoice')}
                                                className="flex items-center gap-2 px-6 py-3 bg-white border border-brand-200 rounded-lg text-brand-800 font-bold uppercase text-xs tracking-widest hover:bg-brand-50 shadow-sm transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                PDF Invoice (A4)
                                            </button>
                                            <button 
                                                onClick={() => setDocumentType('slip')}
                                                className="flex items-center gap-2 px-6 py-3 bg-white border border-brand-200 rounded-lg text-brand-800 font-bold uppercase text-xs tracking-widest hover:bg-brand-50 shadow-sm transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                PDF Packing Slip (Half Size)
                                            </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-serif text-brand-900">Manage Products</h2>
                            <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="bg-brand-800 text-white px-6 py-3 rounded-full hover:bg-brand-700 shadow-lg transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                Add Product
                            </button>
                        </div>
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-brand-100">
                            <table className="w-full text-left">
                                <thead className="bg-brand-50 border-b border-brand-100">
                                    <tr>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Image</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Name</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Category</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Price</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Shipping</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Visible</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.map(p => (
                                        <tr key={p.id} className={`hover:bg-brand-50/50 transition-colors ${!p.isVisible ? 'opacity-60 bg-gray-50' : ''}`}>
                                            <td className="p-6"><img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-brand-100 shadow-sm" /></td>
                                            <td className="p-6 font-serif text-gray-800">{p.name}</td>
                                            <td className="p-6"><span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-[10px] uppercase tracking-wide border border-brand-200">{p.category}</span></td>
                                            <td className="p-6 text-sm font-bold text-brand-600">₹{p.price.toLocaleString('en-IN')}</td>
                                            <td className="p-6 text-sm text-gray-500">{p.shippingCost ? `₹${p.shippingCost}` : 'Free'}</td>
                                            <td className="p-6">
                                                <button 
                                                    onClick={() => toggleProductVisibility(p)}
                                                    className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${p.isVisible !== false ? 'bg-green-500' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${p.isVisible !== false ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                </button>
                                            </td>
                                            <td className="p-6 flex gap-4">
                                                <button onClick={() => handleEditProduct(p)} className="text-gray-400 hover:text-brand-500 text-xs font-bold uppercase tracking-wider transition-colors">Edit</button>
                                                <button onClick={() => deleteProduct(p.id)} className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="text-3xl font-serif text-brand-900 mb-8">Manage Orders</h2>
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-brand-100">
                            <table className="w-full text-left">
                                <thead className="bg-brand-50 border-b border-brand-100">
                                    <tr>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Order ID</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Date</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Customer</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Total</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Status</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.map(order => (
                                        <tr key={order.id} className="hover:bg-brand-50/50 transition-colors">
                                            <td className="p-6 font-bold text-brand-900">{order.id}</td>
                                            <td className="p-6 text-gray-600">{order.date}</td>
                                            <td className="p-6 text-gray-800">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</td>
                                            <td className="p-6 font-bold text-brand-600">₹{order.total.toLocaleString('en-IN')}</td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-6 flex items-center gap-3">
                                                <button onClick={() => setViewingOrderId(order.id)} className="bg-brand-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-800 shadow-md">
                                                    View
                                                </button>
                                                {/* ADDED: Delete Order Button */}
                                                <button onClick={() => handleDeleteOrder(order.id)} className="text-red-400 hover:text-red-600 p-2" title="Delete Order">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {orders.length === 0 && (
                                <div className="p-12 text-center text-gray-400 italic">No orders received yet.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* ADDED: REVIEWS TAB */}
                {activeTab === 'reviews' && (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="text-3xl font-serif text-brand-900 mb-8">Manage Customer Reviews</h2>
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-brand-100">
                            <table className="w-full text-left">
                                <thead className="bg-brand-50 border-b border-brand-100">
                                    <tr>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">User</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Product ID</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Rating</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest w-1/2">Comment</th>
                                        <th className="p-6 text-xs font-bold text-brand-600 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {reviews.map(review => (
                                        <tr key={review.id} className="hover:bg-brand-50/50 transition-colors">
                                            <td className="p-6 font-bold text-brand-900">{review.userName || 'N/A'}</td>
                                            <td className="p-6 text-gray-500 text-xs">{review.productId}</td>
                                            <td className="p-6 font-bold text-gold-500">★ {review.rating}</td>
                                            <td className="p-6 text-gray-600 italic text-sm">{review.comment}</td>
                                            <td className="p-6">
                                                {/* ADDED: Delete Review Button */}
                                                <button onClick={() => handleDeleteReview(review.id)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {reviews.length === 0 && <div className="p-12 text-center text-gray-400 italic">No reviews yet.</div>}
                        </div>
                    </div>
                )}


                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="text-3xl font-serif text-brand-900 mb-6">User Management</h2>
                        <table className="w-full text-left">
                            <thead className="bg-brand-50 border-b border-brand-100">
                                <tr>
                                    <th className="p-4 text-xs font-bold">Name</th>
                                    <th className="p-4 text-xs font-bold">Email</th>
                                    <th className="p-4 text-xs font-bold">Role</th>
                                    <th className="p-4 text-xs font-bold">Status</th>
                                    <th className="p-4 text-xs font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b border-gray-50">
                                        <td className="p-4">{u.name}</td>
                                        <td className="p-4">{u.email}</td>
                                        <td className="p-4">{u.role}</td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => toggleUserStatus(u.id, u.status || 'active')}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors ${u.status === 'inactive' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                                            >
                                                {u.status || 'active'}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            {u.role !== 'admin' && <button onClick={() => deleteUser(u.id)} className="text-red-500 text-xs font-bold hover:underline">Delete</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* TESTIMONIALS TAB */}
                {activeTab === 'testimonials' && (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-serif text-brand-900">Manage Testimonials</h2>
                            <button onClick={() => { setEditingTestimonial(null); setTestimonialForm({name:'',title:'',content:'',image:''}); setIsTestimonialModalOpen(true); }} className="bg-brand-800 text-white px-6 py-3 rounded-full hover:bg-brand-700 shadow-lg transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                Add Testimonial
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {testimonials.map(item => (
                                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 border border-brand-100 flex gap-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover border border-brand-200" />
                                    <div className="flex-1">
                                        <h3 className="font-serif text-lg text-brand-900 font-bold">{item.name}</h3>
                                        <p className="text-xs text-brand-500 font-bold uppercase tracking-wide mb-2">{item.title}</p>
                                        <p className="text-gray-600 text-sm italic line-clamp-3 mb-4">"{item.content}"</p>
                                        <div className="flex gap-4">
                                            <button onClick={() => handleEditTestimonial(item)} className="text-brand-600 text-xs font-bold uppercase hover:underline">Edit</button>
                                            <button onClick={() => deleteTestimonial(item.id)} className="text-red-400 text-xs font-bold uppercase hover:underline">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* GALLERY TAB */}
                {activeTab === 'gallery' && (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-serif text-brand-900">Manage Gallery</h2>
                            <button onClick={() => { setEditingGalleryItem(null); setGalleryForm({title:'',image:'',description:''}); setIsGalleryModalOpen(true); }} className="bg-brand-800 text-white px-6 py-3 rounded-full hover:bg-brand-700 shadow-lg transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                Add Image
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gallery.map(item => (
                                <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-100 group relative">
                                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button onClick={() => { setEditingGalleryItem(item); setGalleryForm(item); setIsGalleryModalOpen(true); }} className="bg-white text-brand-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase hover:bg-brand-50">Edit</button>
                                        <button onClick={() => deleteGalleryItem(item.id)} className="bg-white text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase hover:bg-red-50">Delete</button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-serif text-lg text-brand-900 mb-1">{item.title}</h3>
                                        <p className="text-xs text-gray-500">{item.description || 'No description'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* HOME TAB */}
                {activeTab === 'home' && (
                    <div className="animate-[fadeIn_0.5s_ease-out] max-w-5xl">
                        <h2 className="text-3xl font-serif text-brand-900 mb-8">Edit Home Page Content</h2>
                        <form onSubmit={handleSaveHomeContent} className="bg-white shadow-xl rounded-2xl p-8 border border-brand-100 space-y-12">
                            
                            {/* Hero Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-800 border-b pb-2">Hero Section</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full border p-3 rounded mt-1" value={homeForm.heroTitle} onChange={e => setHomeForm({...homeForm, heroTitle: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><input className="w-full border p-3 rounded mt-1" value={homeForm.heroSubtitle} onChange={e => setHomeForm({...homeForm, heroSubtitle: e.target.value})} /></div>
                                    <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Hero Image URL</label><input className="w-full border p-3 rounded mt-1" value={homeForm.heroImage} onChange={e => setHomeForm({...homeForm, heroImage: e.target.value})} /></div>
                                    <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Marquee Text</label><input className="w-full border p-3 rounded mt-1" value={homeForm.marqueeText} onChange={e => setHomeForm({...homeForm, marqueeText: e.target.value})} /></div>
                                </div>
                            </div>
                            
                            {/* Trends Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-800 border-b pb-2">Trends Section</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Section Title</label><input className="w-full border p-3 rounded mt-1" value={homeForm.trendsSectionTitle} onChange={e => setHomeForm({...homeForm, trendsSectionTitle: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Section Subtitle</label><input className="w-full border p-3 rounded mt-1" value={homeForm.trendsSectionSubtitle} onChange={e => setHomeForm({...homeForm, trendsSectionSubtitle: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Trend 1 Title</label><input className="w-full border p-3 rounded mt-1" value={homeForm.trend1Title} onChange={e => setHomeForm({...homeForm, trend1Title: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Trend 1 Image</label><input className="w-full border p-3 rounded mt-1" value={homeForm.trend1Image} onChange={e => setHomeForm({...homeForm, trend1Image: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Trend 2 Title</label><input className="w-full border p-3 rounded mt-1" value={homeForm.trend2Title} onChange={e => setHomeForm({...homeForm, trend2Title: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Trend 2 Image</label><input className="w-full border p-3 rounded mt-1" value={homeForm.trend2Image} onChange={e => setHomeForm({...homeForm, trend2Image: e.target.value})} /></div>
                                </div>
                            </div>
                            
                            {/* Video Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-800 border-b pb-2">Video Section</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full border p-3 rounded mt-1" value={homeForm.videoSectionTitle} onChange={e => setHomeForm({...homeForm, videoSectionTitle: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><input className="w-full border p-3 rounded mt-1" value={homeForm.videoSectionSubtitle} onChange={e => setHomeForm({...homeForm, videoSectionSubtitle: e.target.value})} /></div>
                                    <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Video URL</label><input className="w-full border p-3 rounded mt-1" value={homeForm.homeVideoUrl} onChange={e => setHomeForm({...homeForm, homeVideoUrl: e.target.value})} /></div>
                                </div>
                            </div>
                            
                            {/* Featured Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-800 border-b pb-2">Featured Section</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full border p-3 rounded mt-1" value={homeForm.featuredSectionTitle} onChange={e => setHomeForm({...homeForm, featuredSectionTitle: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><input className="w-full border p-3 rounded mt-1" value={homeForm.featuredSectionSubtitle} onChange={e => setHomeForm({...homeForm, featuredSectionSubtitle: e.target.value})} /></div>
                                </div>
                            </div>
                            
                            {/* Editorial Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-800 border-b pb-2">Legacy / Editorial</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full border p-3 rounded mt-1" value={homeForm.editorialTitle} onChange={e => setHomeForm({...homeForm, editorialTitle: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Text Content</label><textarea rows={4} className="w-full border p-3 rounded mt-1" value={homeForm.editorialText} onChange={e => setHomeForm({...homeForm, editorialText: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Image URL</label><input className="w-full border p-3 rounded mt-1" value={homeForm.editorialImage} onChange={e => setHomeForm({...homeForm, editorialImage: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Video URL (Optional - Overrides Image)</label><input className="w-full border p-3 rounded mt-1" value={homeForm.editorialVideo} onChange={e => setHomeForm({...homeForm, editorialVideo: e.target.value})} /></div>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-brand-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-900">Update Home Page</button>
                        </form>
                    </div>
                )}
                
                {/* ABOUT TAB */}
                {activeTab === 'about' && (
                    <div className="animate-[fadeIn_0.5s_ease-out] max-w-5xl">
                        <h2 className="text-3xl font-serif text-brand-900 mb-8">Edit About Page Content</h2>
                        <form onSubmit={handleSaveAboutContent} className="bg-white shadow-xl rounded-2xl p-8 border border-brand-100 space-y-12">
                            
                            {/* Hero & Stats */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-800 border-b pb-2">Hero & Stats</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Page Title</label><input className="w-full border p-3 rounded mt-1" value={aboutForm.title} onChange={e => setAboutForm({...aboutForm, title: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><input className="w-full border p-3 rounded mt-1" value={aboutForm.subtitle} onChange={e => setAboutForm({...aboutForm, subtitle: e.target.value})} /></div>
                                    <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Hero Image</label><input className="w-full border p-3 rounded mt-1" value={aboutForm.heroImage} onChange={e => setAboutForm({...aboutForm, heroImage: e.target.value})} /></div>
                                </div>
                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div><label className="text-xs font-bold">Stat 1 Value</label><input className="w-full border p-2 rounded" value={aboutForm.stat1Value} onChange={e => setAboutForm({...aboutForm, stat1Value: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold">Stat 1 Label</label><input className="w-full border p-2 rounded" value={aboutForm.stat1Label} onChange={e => setAboutForm({...aboutForm, stat1Label: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold">Stat 2 Value</label><input className="w-full border p-2 rounded" value={aboutForm.stat2Value} onChange={e => setAboutForm({...aboutForm, stat2Value: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold">Stat 2 Label</label><input className="w-full border p-2 rounded" value={aboutForm.stat2Label} onChange={e => setAboutForm({...aboutForm, stat2Label: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold">Stat 3 Value</label><input className="w-full border p-2 rounded" value={aboutForm.stat3Value} onChange={e => setAboutForm({...aboutForm, stat3Value: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold">Stat 3 Label</label><input className="w-full border p-2 rounded" value={aboutForm.stat3Label} onChange={e => setAboutForm({...aboutForm, stat3Label: e.target.value})} /></div>
                                </div>
                            </div>

                            {/* Story Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-800 border-b pb-2">Our Story</h3>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full border p-3 rounded mt-1" value={aboutForm.storyTitle} onChange={e => setAboutForm({...aboutForm, storyTitle: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Story Text</label><textarea rows={4} className="w-full border p-3 rounded mt-1" value={aboutForm.storyText} onChange={e => setAboutForm({...aboutForm, storyText: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Image</label><input className="w-full border p-3 rounded mt-1" value={aboutForm.storyImage} onChange={e => setAboutForm({...aboutForm, storyImage: e.target.value})} /></div>
                            </div>

                            {/* Craftsmanship Video */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-800 border-b pb-2">Craftsmanship (Video)</h3>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full border p-3 rounded mt-1" value={aboutForm.craftsmanshipTitle} onChange={e => setAboutForm({...aboutForm, craftsmanshipTitle: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Text</label><textarea rows={2} className="w-full border p-3 rounded mt-1" value={aboutForm.craftsmanshipText} onChange={e => setAboutForm({...aboutForm, craftsmanshipText: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Video URL</label><input className="w-full border p-3 rounded mt-1" value={aboutForm.craftsmanshipVideo} onChange={e => setAboutForm({...aboutForm, craftsmanshipVideo: e.target.value})} /></div>
                            </div>

                            {/* Philosophy */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-800 border-b pb-2">Philosophy</h3>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full border p-3 rounded mt-1" value={aboutForm.philosophyTitle} onChange={e => setAboutForm({...aboutForm, philosophyTitle: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><input className="w-full border p-3 rounded mt-1" value={aboutForm.philosophySubtitle} onChange={e => setAboutForm({...aboutForm, philosophySubtitle: e.target.value})} /></div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 border rounded">
                                        <label className="text-xs font-bold block mb-1">Value 1 Title</label><input className="w-full border p-2 mb-2" value={aboutForm.value1Title} onChange={e => setAboutForm({...aboutForm, value1Title: e.target.value})} />
                                        <label className="text-xs font-bold block mb-1">Value 1 Desc</label><textarea className="w-full border p-2" rows={3} value={aboutForm.value1Desc} onChange={e => setAboutForm({...aboutForm, value1Desc: e.target.value})} />
                                    </div>
                                    <div className="p-4 border rounded">
                                        <label className="text-xs font-bold block mb-1">Value 2 Title</label><input className="w-full border p-2 mb-2" value={aboutForm.value2Title} onChange={e => setAboutForm({...aboutForm, value2Title: e.target.value})} />
                                        <label className="text-xs font-bold block mb-1">Value 2 Desc</label><textarea className="w-full border p-2" rows={3} value={aboutForm.value2Desc} onChange={e => setAboutForm({...aboutForm, value2Desc: e.target.value})} />
                                    </div>
                                    <div className="p-4 border rounded">
                                        <label className="text-xs font-bold block mb-1">Value 3 Title</label><input className="w-full border p-2 mb-2" value={aboutForm.value3Title} onChange={e => setAboutForm({...aboutForm, value3Title: e.target.value})} />
                                        <label className="text-xs font-bold block mb-1">Value 3 Desc</label><textarea className="w-full border p-2" rows={3} value={aboutForm.value3Desc} onChange={e => setAboutForm({...aboutForm, value3Desc: e.target.value})} />
                                    </div>
                                </div>
                            </div>

                            {/* Process */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-brand-800 border-b pb-2">Process</h3>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Main Title</label><input className="w-full border p-3 rounded mt-1" value={aboutForm.processTitle} onChange={e => setAboutForm({...aboutForm, processTitle: e.target.value})} /></div>
                                
                                <div className="space-y-4">
                                    <div className="flex gap-4 border p-4 rounded">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-xs font-bold">Step 1 Title</label><input className="w-full border p-2" value={aboutForm.processStep1Title} onChange={e => setAboutForm({...aboutForm, processStep1Title: e.target.value})} />
                                            <label className="text-xs font-bold">Step 1 Image</label><input className="w-full border p-2" value={aboutForm.processStep1Image} onChange={e => setAboutForm({...aboutForm, processStep1Image: e.target.value})} />
                                        </div>
                                        <div className="flex-1"><label className="text-xs font-bold">Step 1 Desc</label><textarea className="w-full border p-2 h-full" value={aboutForm.processStep1Desc} onChange={e => setAboutForm({...aboutForm, processStep1Desc: e.target.value})} /></div>
                                    </div>
                                    <div className="flex gap-4 border p-4 rounded">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-xs font-bold">Step 2 Title</label><input className="w-full border p-2" value={aboutForm.processStep2Title} onChange={e => setAboutForm({...aboutForm, processStep2Title: e.target.value})} />
                                            <label className="text-xs font-bold">Step 2 Image</label><input className="w-full border p-2" value={aboutForm.processStep2Image} onChange={e => setAboutForm({...aboutForm, processStep2Image: e.target.value})} />
                                        </div>
                                        <div className="flex-1"><label className="text-xs font-bold">Step 2 Desc</label><textarea className="w-full border p-2 h-full" value={aboutForm.processStep2Desc} onChange={e => setAboutForm({...aboutForm, processStep2Desc: e.target.value})} /></div>
                                    </div>
                                    <div className="flex gap-4 border p-4 rounded">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-xs font-bold">Step 3 Title</label><input className="w-full border p-2" value={aboutForm.processStep3Title} onChange={e => setAboutForm({...aboutForm, processStep3Title: e.target.value})} />
                                            <label className="text-xs font-bold">Step 3 Image</label><input className="w-full border p-2" value={aboutForm.processStep3Image} onChange={e => setAboutForm({...aboutForm, processStep3Image: e.target.value})} />
                                        </div>
                                        <div className="flex-1"><label className="text-xs font-bold">Step 3 Desc</label><textarea className="w-full border p-2 h-full" value={aboutForm.processStep3Desc} onChange={e => setAboutForm({...aboutForm, processStep3Desc: e.target.value})} /></div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-brand-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-900">Update About Page</button>
                        </form>
                    </div>
                )}

                {/* GLOBAL SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="animate-[fadeIn_0.5s_ease-out] max-w-4xl">
                        <h2 className="text-3xl font-serif text-brand-900 mb-8">Global Site Settings</h2>
                        
                        {/* Sub Tabs */}
                        <div className="flex gap-4 mb-8 border-b border-brand-100 pb-1">
                            <button onClick={() => setSettingsSubTab('header')} className={`pb-3 px-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${settingsSubTab === 'header' ? 'border-brand-800 text-brand-800' : 'border-transparent text-gray-400 hover:text-brand-600'}`}>Header & Logo</button>
                            <button onClick={() => setSettingsSubTab('footer')} className={`pb-3 px-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${settingsSubTab === 'footer' ? 'border-brand-800 text-brand-800' : 'border-transparent text-gray-400 hover:text-brand-600'}`}>Footer & Social</button>
                            <button onClick={() => setSettingsSubTab('invoice')} className={`pb-3 px-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${settingsSubTab === 'invoice' ? 'border-brand-800 text-brand-800' : 'border-transparent text-gray-400 hover:text-brand-600'}`}>Invoices</button>
                        </div>

                        <form onSubmit={handleSaveSettings} className="bg-white shadow-xl rounded-2xl p-8 border border-brand-100 space-y-8">
                            
                            {settingsSubTab === 'header' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Brand Name</label>
                                            <input type="text" className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.brandName} onChange={e => setSettingsForm({...settingsForm,brandName: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Brand Subtitle (Tagline)</label>
                                            <input type="text" className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.brandSubtitle} onChange={e => setSettingsForm({...settingsForm,brandSubtitle: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Logo URL (Optional - Replaces Text)</label>
                                            <input type="text" className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.logoUrl} onChange={e => setSettingsForm({...settingsForm, logoUrl: e.target.value})} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Logo Height (px)</label>
                                                <input type="text" className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.logoHeight} onChange={e => setSettingsForm({...settingsForm, logoHeight: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Logo Width (px or 'auto')</label>
                                                <input type="text" className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.logoWidth} onChange={e => setSettingsForm({...settingsForm, logoWidth: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {settingsSubTab === 'footer' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Footer About Title</label>
                                        <input type="text" className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.footerAboutTitle} onChange={e => setSettingsForm({...settingsForm, footerAboutTitle: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Footer About Text</label>
                                        <textarea rows={3} className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.footerAboutText} onChange={e => setSettingsForm({...settingsForm, footerAboutText: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Contact Email</label>
                                        <input type="text" className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.contactEmail} onChange={e => setSettingsForm({...settingsForm, contactEmail: e.target.value})} />
                                    </div>
                                    
                                    <div className="pt-4 mt-2 border-t border-brand-50">
                                        <h4 className="text-sm font-bold text-brand-800 mb-3">Social Media Links</h4>
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase text-gray-400">Instagram URL</label>
                                                <input type="text" className="w-full bg-brand-50 border border-brand-200 p-2 rounded text-sm" value={settingsForm.socialInstagram} onChange={e => setSettingsForm({...settingsForm, socialInstagram: e.target.value})} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase text-gray-400">Facebook URL</label>
                                                <input type="text" className="w-full bg-brand-50 border border-brand-200 p-2 rounded text-sm" value={settingsForm.socialFacebook} onChange={e => setSettingsForm({...settingsForm, socialFacebook: e.target.value})} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase text-gray-400">Pinterest URL</label>
                                                <input type="text" className="w-full bg-brand-50 border border-brand-200 p-2 rounded text-sm" value={settingsForm.socialPinterest} onChange={e => setSettingsForm({...settingsForm, socialPinterest: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {settingsSubTab === 'invoice' && (
                                <div className="animate-[fadeIn_0.3s_ease-out]">
                                    <h3 className="font-serif text-lg text-brand-600 mb-6 font-bold uppercase tracking-wider flex items-center gap-2">Invoice Settings</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-widest text-gray-500">Order ID Prefix</label><input type="text" className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.orderPrefix} onChange={e => setSettingsForm({...settingsForm, orderPrefix: e.target.value})} /></div>
                                        <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-widest text-gray-500">Invoice ID Prefix</label><input type="text" className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.invoicePrefix} onChange={e => setSettingsForm({...settingsForm, invoicePrefix: e.target.value})} /></div>
                                        <div className="space-y-2 col-span-2"><label className="text-xs font-bold uppercase tracking-widest text-gray-500">Invoice Sender Address</label><textarea rows={4} className="w-full bg-brand-50 border border-brand-200 p-3 rounded-lg focus:border-brand-500 outline-none" value={settingsForm.invoiceAddress || ''} onChange={e => setSettingsForm({...settingsForm, invoiceAddress: e.target.value})} /><p className="text-[10px] text-gray-400">This address appears on the "From" section of generated PDF invoices.</p></div>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="w-full bg-brand-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg">Save All Settings</button>
                        </form>
                    </div>
                )}
            </div>

            {/* 4. Modals (Product, Gallery, Testimonial) */}
            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-brand-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl">
                        <h3 className="text-2xl font-serif text-brand-900 mb-6">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                        <form onSubmit={handleSaveProduct} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500">Name</label><input type="text" className="w-full bg-brand-50 border border-brand-200 p-4 rounded-xl focus:border-brand-500 outline-none" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} required /></div>
                                <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500">Price (₹)</label><input type="number" className="w-full bg-brand-50 border border-brand-200 p-4 rounded-xl focus:border-brand-500 outline-none" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})} required min="0" /></div>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-500">Category</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Gold, Bridal, Antique"
                                        className="w-full bg-brand-50 border border-brand-200 p-4 rounded-xl focus:border-brand-500 outline-none" 
                                        value={prodForm.category} 
                                        onChange={e => setProdForm({...prodForm, category: e.target.value})} 
                                        required
                                    />
                                </div>

                                <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500">Shipping Cost (₹)</label><input type="number" className="w-full bg-brand-50 border border-brand-200 p-4 rounded-xl focus:border-brand-500 outline-none" value={prodForm.shippingCost} onChange={e => setProdForm({...prodForm, shippingCost: Number(e.target.value)})} min="0" /></div>
                                <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold uppercase text-gray-500">Image URL</label><input type="text" className="w-full bg-brand-50 border border-brand-200 p-4 rounded-xl focus:border-brand-500 outline-none" value={prodForm.image} onChange={e => setProdForm({...prodForm, image: e.target.value})} required /></div>
                                <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold uppercase text-gray-500">Description</label><textarea className="w-full bg-brand-50 border border-brand-200 p-4 rounded-xl focus:border-brand-500 outline-none" rows={3} value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} required /></div>
                                <div className="space-y-2 md:col-span-2"><label className="flex items-center gap-3 p-4 border border-brand-200 rounded-xl cursor-pointer hover:bg-brand-50"><input type="checkbox" className="w-5 h-5 accent-brand-600" checked={prodForm.isVisible !== false} onChange={e => setProdForm({...prodForm, isVisible: e.target.checked})} /><span className="font-bold text-brand-900">Visible in Shop</span></label></div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-bold">Cancel</button>
                                <button type="submit" className="px-8 py-3 bg-brand-800 text-white rounded-full hover:bg-brand-700 shadow-lg text-sm font-bold uppercase tracking-wider">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Gallery Modal */}
            {isGalleryModalOpen && (
                <div className="fixed inset-0 bg-brand-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
                        <h3 className="text-2xl font-serif text-brand-900 mb-6">{editingGalleryItem ? 'Edit Image' : 'Add Image'}</h3>
                        <form onSubmit={handleSaveGalleryItem} className="space-y-4">
                            <input type="text" placeholder="Title" className="w-full border p-3 rounded-lg" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} required />
                            <input type="text" placeholder="Image URL" className="w-full border p-3 rounded-lg" value={galleryForm.image} onChange={e => setGalleryForm({...galleryForm, image: e.target.value})} required />
                            <textarea placeholder="Description (Optional)" className="w-full border p-3 rounded-lg" value={galleryForm.description} onChange={e => setGalleryForm({...galleryForm, description: e.target.value})} />
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-brand-800 text-white rounded-lg font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Testimonial Modal */}
            {isTestimonialModalOpen && (
                <div className="fixed inset-0 bg-brand-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
                        <h3 className="text-2xl font-serif text-brand-900 mb-6">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                        <form onSubmit={handleSaveTestimonial} className="space-y-4">
                            <input type="text" placeholder="Name" className="w-full border p-3 rounded-lg" value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} required />
                            <input type="text" placeholder="Location/Title" className="w-full border p-3 rounded-lg" value={testimonialForm.title} onChange={e => setTestimonialForm({...testimonialForm, title: e.target.value})} required />
                            <input type="text" placeholder="User Image URL" className="w-full border p-3 rounded-lg" value={testimonialForm.image} onChange={e => setTestimonialForm({...testimonialForm, image: e.target.value})} required />
                            <textarea placeholder="Testimonial Content" rows={4} className="w-full border p-3 rounded-lg" value={testimonialForm.content} onChange={e => setTestimonialForm({...testimonialForm, content: e.target.value})} required />
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-brand-800 text-white rounded-lg font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};