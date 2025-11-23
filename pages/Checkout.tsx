import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Order } from '../types';
import { API_URL } from '../utils/api';

interface CheckoutProps {
    onNavigate: (page: string) => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
    const { items, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { addOrder, siteSettings } = useData();
    const [step, setStep] = useState<'shipping' | 'success'>('shipping');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        state: ''
    });

    useEffect(() => {
        if (user) {
            const names = user.name.split(' ');
            setFormData({
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
                zip: user.zip || ''
            });
        }
    }, [user]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const totalAmount = Math.round(cartTotal * 1.03);

        if (paymentMethod === 'online') {
            const res = await loadRazorpayScript();
            if (!res) {
                alert('Razorpay SDK failed to load.');
                setIsLoading(false);
                return;
            }

            try {
                // 1. Create Order on Backend
                const orderRes = await fetch(`${API_URL}/create-payment-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: totalAmount })
                });

                if (!orderRes.ok) throw new Error("Server error creating payment order");
                const orderData = await orderRes.json();

                // 2. Open Razorpay Modal
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Safe to use env here
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: siteSettings.brandName,
                    description: "Jewelry Purchase",
                    order_id: orderData.id,
                    handler: async function (response: any) {
                        // 3. Verify Payment
                        const verifyRes = await fetch(`${API_URL}/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            await finalizeOrder('Paid (Online)');
                        } else {
                            alert("Payment verification failed.");
                            setIsLoading(false);
                        }
                    },
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: { color: "#064E3B" }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } catch (error) {
                console.error("Payment Error:", error);
                alert("Payment initialization failed. Check server console.");
                setIsLoading(false);
            }
        } else {
            // Cash on Delivery
            await finalizeOrder('Cash on Delivery');
        }
    };

    const finalizeOrder = async (paymentStatus: string) => {
        const prefix = siteSettings.orderPrefix || 'ORD-';
        const newOrder: Order = {
            id: `${prefix}${Math.floor(100000 + Math.random() * 900000)}`,
            userId: user?.id || 'guest',
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            total: Math.round(cartTotal * 1.03),
            items: [...items],
            paymentMethod: paymentStatus,
            shippingDetails: formData
        };

        try {
            // 1. Send to Backend
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });

            if (!response.ok) {
                throw new Error('Failed to save order to database');
            }

            // 2. Update Local UI
            addOrder(newOrder);

            // 3. Success UI
            setIsLoading(false);
            setStep('success');
            clearCart();
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error("Order Finalization Error:", error);
            alert("Order processed but failed to sync with server. Please contact support.");
            setIsLoading(false);
        }
    };

    if (items.length === 0 && step !== 'success') {
        return (
            <div className="min-h-screen pt-32 px-4 flex flex-col items-center text-center bg-brand-50">
                <h2 className="font-serif text-3xl text-brand-900 mb-4">Your Bag is Empty</h2>
                <button onClick={() => onNavigate('shop')} className="bg-brand-900 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest">Return to Shop</button>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen pt-32 px-4 bg-brand-50 flex items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                <div className="max-w-lg w-full bg-white p-12 rounded-3xl shadow-xl text-center border border-brand-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
                    <h2 className="font-serif text-4xl text-brand-900 mb-4">Order Confirmed</h2>
                    <p className="text-gray-500 mb-8">Thank you, {formData.firstName}. Check your email for confirmation.</p>
                    <button onClick={() => onNavigate('shop')} className="bg-brand-900 text-white px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest">Continue Shopping</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-50 pt-16 pb-24 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
                <div className="md:w-2/3 space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => onNavigate('shop')} className="text-xs font-bold uppercase tracking-widest text-brand-500">Back</button>
                        <h1 className="font-serif text-3xl text-brand-900">Checkout</h1>
                    </div>
                    <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-100">
                            <h3 className="font-serif text-xl text-brand-900 mb-6">Shipping Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input required placeholder="First Name" className="p-4 bg-brand-50 rounded-xl border border-brand-100" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                <input required placeholder="Last Name" className="p-4 bg-brand-50 rounded-xl border border-brand-100" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                <input required placeholder="Address" className="md:col-span-2 p-4 bg-brand-50 rounded-xl border border-brand-100" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                <input required placeholder="City" className="p-4 bg-brand-50 rounded-xl border border-brand-100" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                <input required placeholder="Zip Code" className="p-4 bg-brand-50 rounded-xl border border-brand-100" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} />
                                <input required placeholder="Phone" className="p-4 bg-brand-50 rounded-xl border border-brand-100" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                <input required placeholder="Email" type="email" className="p-4 bg-brand-50 rounded-xl border border-brand-100" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-100">
                            <h3 className="font-serif text-xl text-brand-900 mb-6">Payment</h3>
                            <div className="space-y-4">
                                <label className="flex items-center p-4 border rounded-xl cursor-pointer">
                                    <input type="radio" name="payment" value="online" className="w-5 h-5 accent-brand-600" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                                    <span className="ml-4 font-bold text-brand-900">Online Payment (Cards/UPI)</span>
                                </label>
                                <label className="flex items-center p-4 border rounded-xl cursor-pointer">
                                    <input type="radio" name="payment" value="cod" className="w-5 h-5 accent-brand-600" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                    <span className="ml-4 font-bold text-brand-900">Cash on Delivery</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="md:w-1/3">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-brand-100 sticky top-24">
                        <h3 className="font-serif text-xl text-brand-900 mb-6">Summary</h3>
                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-brand-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-sm text-brand-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span>Tax (3%)</span><span>₹{Math.round(cartTotal * 0.03).toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4"><span>Total</span><span>₹{Math.round(cartTotal * 1.03).toLocaleString('en-IN')}</span></div>
                        </div>
                        <button type="submit" form="checkout-form" disabled={isLoading} className="w-full bg-brand-900 text-white py-4 rounded-full font-bold text-xs uppercase tracking-widest mt-8 hover:bg-brand-800 transition-all disabled:opacity-50">
                            {isLoading ? 'Processing...' : (paymentMethod === 'online' ? 'Pay Now' : 'Place Order')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};