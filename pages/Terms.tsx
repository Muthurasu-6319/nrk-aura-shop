import React from 'react';

interface PageProps {
  onBack: () => void;
}

export const Terms: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-brand-50 py-16 px-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-brand-100">
        
        <button onClick={onBack} className="text-brand-500 hover:text-brand-800 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
        </button>

        <h1 className="font-serif text-4xl text-brand-900 mb-2">Terms & Conditions</h1>
        <p className="text-sm text-gray-400 mb-10 uppercase tracking-wider">Last Updated: Nov 2025</p>

        <div className="space-y-8 text-gray-600 leading-relaxed font-light">
            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">1. Introduction</h2>
                <p>Welcome to NRK Aura. By accessing our website and purchasing our luxury jewelry, you agree to be bound by these Terms and Conditions. These terms apply to all visitors, users, and others who access or use the Service.</p>
            </section>

            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">2. Products & Authenticity</h2>
                <p>We guarantee that all jewelry sold under the NRK Aura brand is crafted with genuine materials as described. However, due to the handcrafted nature of our products, slight variations in weight, color, or setting may occur.</p>
            </section>

            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">3. Pricing & Payments</h2>
                <p>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices at any time without prior notice. Payment must be received in full before shipment.</p>
            </section>

            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">4. Shipping & Delivery</h2>
                <p>We offer secure shipping for all orders. Delivery times are estimates and commence from the date of shipping, rather than the date of order. We are not responsible for delays caused by customs or courier services.</p>
            </section>

            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">5. Returns & Refunds</h2>
                <p>Custom-made or personalized items are not eligible for return. For standard collection items, returns must be initiated within 7 days of delivery in their original, unworn condition with all tags and certificates intact.</p>
            </section>

            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">6. Intellectual Property</h2>
                <p>The Service and its original content, features, and functionality are and will remain the exclusive property of NRK Aura and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of NRK Aura.</p>
            </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">For any legal queries, please contact nrkaura@gmail.com</p>
        </div>
      </div>
    </div>
  );
};