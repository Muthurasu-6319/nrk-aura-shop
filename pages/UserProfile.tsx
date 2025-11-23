
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useData } from '../context/DataContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { Order } from '../types';

export const UserProfile: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { wishlistItems } = useWishlist();
  const { orders, siteSettings } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: ''
  });

  useEffect(() => {
      if (user) {
          setFormData({
              name: user.name,
              email: user.email,
              password: user.password || '',
              phone: user.phone || '',
              address: user.address || '',
              city: user.city || '',
              state: user.state || '',
              zip: user.zip || ''
          });
      }
  }, [user]);

  if (!user) return null;

  // Filter orders for current user
  const myOrders = orders.filter(order => order.userId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      await updateProfile({
          ...user,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
      });
      setIsSaving(false);
      setIsEditing(false);
      // We don't need to alert manually as updateProfile handles success/fail alerts if needed, 
      // but let's add a success message for better UX
      alert("Profile Saved to Database! This will auto-fill during checkout.");
  };

  return (
    <div className="min-h-screen bg-brand-50 pt-16 pb-24 px-4 animate-[fadeIn_0.5s_ease-out]">
        {selectedOrderForInvoice && (
           <InvoiceModal 
               order={selectedOrderForInvoice} 
               settings={siteSettings} 
               onClose={() => setSelectedOrderForInvoice(null)} 
           />
       )}

      <div className="max-w-5xl mx-auto">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-100 mb-8 relative group">
            <div className="h-40 bg-brand-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl"></div>
            </div>
            <div className="px-8 pb-8 relative flex flex-col md:flex-row items-end md:items-center gap-6 -mt-12">
                <div className="w-32 h-32 bg-white p-1 rounded-full shadow-lg relative z-10">
                    <div className="w-full h-full bg-brand-50 rounded-full flex items-center justify-center text-4xl font-serif text-brand-800 border border-brand-200">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 pt-12 md:pt-0">
                    <h1 className="text-3xl font-serif text-brand-900 font-bold">{user.name}</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        <span className="text-brand-200">•</span>
                        <span className="bg-gold-100 text-gold-700 text-[10px] font-bold px-2 py-0.5 rounded border border-gold-200 uppercase tracking-wider flex items-center gap-1">
                           <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span> Gold Member
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 mb-1 md:mb-0">
                    <button onClick={logout} className="px-6 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="md:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-brand-50 overflow-hidden sticky top-24">
                    <nav className="flex flex-col p-2">
                        <button 
                            onClick={() => setActiveTab('overview')} 
                            className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${activeTab === 'overview' ? 'bg-brand-900 text-white shadow-md' : 'text-gray-500 hover:bg-brand-50 hover:text-brand-700'}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            Overview
                        </button>
                        <button 
                            onClick={() => setActiveTab('orders')} 
                            className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${activeTab === 'orders' ? 'bg-brand-900 text-white shadow-md' : 'text-gray-500 hover:bg-brand-50 hover:text-brand-700'}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            Order History
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')} 
                            className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${activeTab === 'settings' ? 'bg-brand-900 text-white shadow-md' : 'text-gray-500 hover:bg-brand-50 hover:text-brand-700'}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Settings
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm">
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Total Orders</p>
                                <p className="text-3xl font-serif text-brand-900">{myOrders.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm">
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Wishlist</p>
                                <p className="text-3xl font-serif text-brand-900">{wishlistItems.length} Items</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm">
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Member Status</p>
                                <p className="text-3xl font-serif text-gold-500">Active</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-8">
                            <h3 className="font-serif text-xl text-brand-900 mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                {myOrders.length > 0 ? myOrders.slice(0, 3).map(order => (
                                    <div key={order.id} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden">
                                            <img src={order.items[0]?.image} alt="Order Item" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-brand-900">{order.id}</p>
                                            <p className="text-xs text-gray-400">{order.date}</p>
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                                            order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                                            order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-gray-400 text-sm italic">No recent orders.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                        <div className="p-6 border-b border-brand-50">
                            <h3 className="font-serif text-xl text-brand-900">Order History</h3>
                        </div>
                        <div className="divide-y divide-brand-50">
                            {myOrders.length > 0 ? myOrders.map(order => (
                                <div key={order.id} className="p-6 hover:bg-brand-50 transition-colors flex flex-col md:flex-row items-center gap-6">
                                    <div className="w-full md:w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                        <img src={order.items[0]?.image} alt="Order" className="w-full h-full object-cover" />
                                        {order.items.length > 1 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                                                +{order.items.length - 1}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 w-full text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                            <h4 className="font-bold text-brand-900">{order.id}</h4>
                                            <span className="hidden md:inline text-gray-300">•</span>
                                            <span className="text-sm text-gray-500">{order.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{order.items.length} Items • Total: <span className="font-bold">₹{order.total.toLocaleString('en-IN')}</span></p>
                                    </div>
                                    <div className="w-full md:w-auto flex flex-col md:items-end gap-2">
                                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider text-center md:text-right ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                        <button 
                                            onClick={() => setSelectedOrderForInvoice(order)}
                                            className="text-brand-600 hover:text-brand-900 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 justify-center md:justify-end"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            Invoice
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-10 text-center text-gray-400 italic">You haven't placed any orders yet.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-8 animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-serif text-xl text-brand-900">Account Details</h3>
                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-900 border-b border-brand-200 pb-1"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                        
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Full Name</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        className={`w-full p-4 rounded-xl border outline-none transition-all ${isEditing ? 'bg-brand-50 border-brand-200 focus:border-brand-500' : 'bg-white border-gray-100 text-gray-500'}`}
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Email Address</label>
                                    <input 
                                        type="email" 
                                        disabled={!isEditing}
                                        className={`w-full p-4 rounded-xl border outline-none transition-all ${isEditing ? 'bg-brand-50 border-brand-200 focus:border-brand-500' : 'bg-white border-gray-100 text-gray-500'}`}
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        disabled={!isEditing}
                                        placeholder="+91 98765 43210"
                                        className={`w-full p-4 rounded-xl border outline-none transition-all ${isEditing ? 'bg-brand-50 border-brand-200 focus:border-brand-500' : 'bg-white border-gray-100 text-gray-500'}`}
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Password</label>
                                    <input 
                                        type="password" 
                                        disabled={!isEditing}
                                        placeholder={isEditing ? "Enter new password to change" : "********"}
                                        className={`w-full p-4 rounded-xl border outline-none transition-all ${isEditing ? 'bg-brand-50 border-brand-200 focus:border-brand-500' : 'bg-white border-gray-100 text-gray-500'}`}
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                                
                                <div className="space-y-2 md:col-span-2 border-t border-brand-50 pt-4 mt-2">
                                    <h4 className="text-xs font-bold text-brand-800 uppercase tracking-wider mb-2">Shipping Address</h4>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Street Address</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        placeholder="123, Luxury Lane"
                                        className={`w-full p-4 rounded-xl border outline-none transition-all ${isEditing ? 'bg-brand-50 border-brand-200 focus:border-brand-500' : 'bg-white border-gray-100 text-gray-500'}`}
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">City</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        className={`w-full p-4 rounded-xl border outline-none transition-all ${isEditing ? 'bg-brand-50 border-brand-200 focus:border-brand-500' : 'bg-white border-gray-100 text-gray-500'}`}
                                        value={formData.city}
                                        onChange={e => setFormData({...formData, city: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">State</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        className={`w-full p-4 rounded-xl border outline-none transition-all ${isEditing ? 'bg-brand-50 border-brand-200 focus:border-brand-500' : 'bg-white border-gray-100 text-gray-500'}`}
                                        value={formData.state}
                                        onChange={e => setFormData({...formData, state: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Postal Code</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        className={`w-full p-4 rounded-xl border outline-none transition-all ${isEditing ? 'bg-brand-50 border-brand-200 focus:border-brand-500' : 'bg-white border-gray-100 text-gray-500'}`}
                                        value={formData.zip}
                                        onChange={e => setFormData({...formData, zip: e.target.value})}
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end gap-4 pt-4 border-t border-brand-50">
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsEditing(false); setFormData({ 
                                            name: user.name, email: user.email, password: user.password || '',
                                            phone: user.phone || '', address: user.address || '', city: user.city || '', state: user.state || '', zip: user.zip || ''
                                        }); }}
                                        className="px-6 py-3 rounded-full text-gray-500 hover:bg-gray-100 font-bold text-xs uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className="px-8 py-3 rounded-full bg-brand-900 text-white hover:bg-brand-800 font-bold text-xs uppercase tracking-widest shadow-lg disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};
