import React from 'react';

interface PageProps {
  onBack: () => void;
}

export const Privacy: React.FC<PageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-brand-50 py-16 px-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-brand-100">
        
        <button onClick={onBack} className="text-brand-500 hover:text-brand-800 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
        </button>

        <h1 className="font-serif text-4xl text-brand-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10 uppercase tracking-wider">Last Updated: Nov 2025</p>

        <div className="space-y-8 text-gray-600 leading-relaxed font-light">
            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information.</p>
            </section>

            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Process your transactions and deliver your orders.</li>
                    <li>Send you order confirmations and shipping updates.</li>
                    <li>Respond to your comments and questions.</li>
                    <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
                </ul>
            </section>

            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">3. Data Security</h2>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. All payment transactions are processed through secure gateway providers and are not stored or processed on our servers.</p>
            </section>

            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">4. Cookies</h2>
                <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </section>

            <section>
                <h2 className="font-serif text-xl text-brand-800 mb-3 font-bold">5. Third-Party Services</h2>
                <p>We may employ third-party companies and individuals to facilitate our Service, to provide the Service on our behalf, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf.</p>
            </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">Questions about your data? Contact nrkaura@gmail.com</p>
        </div>
      </div>
    </div>
  );
};