import React, { useState } from 'react';
import { API_URL } from '../utils/api';

export const Contact: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/contact-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setTimeout(() => {
                    setSubmitted(true);
                    setLoading(false);
                }, 1000);
            } else {
                console.error('Submission failed on server.');
                alert('Failed to send message. Please try again later.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Network or CORS error:', error);
            alert('A network error occurred. Check your server connection.');
            setLoading(false);
        }
    };

    const handleSendAnother = () => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-brand-50 pt-16 pb-20 px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[fadeIn_0.5s_ease-out]">
                <div className="bg-brand-900 text-white p-16 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-800 rounded-full -mr-32 -mt-32 blur-2xl opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="font-serif text-3xl mb-10">Get in Touch</h2>
                        <p className="text-brand-100 mb-12 leading-relaxed italic">
                            We operate exclusively online to provide a seamless, global luxury experience.
                        </p>
                        <div className="space-y-10">
                            <div>
                                <h3 className="text-gold-400 uppercase text-xs font-bold tracking-widest mb-3">Location (Online)</h3>
                                <p className="text-brand-100 leading-relaxed">
                                    Serving globally from:<br/>
                                    Rajapalayam, Tamil Nadu,<br/>
                                    India
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gold-400 uppercase text-xs font-bold tracking-widest mb-3">Concierge Desk</h3>
                                <p className="text-brand-100">nrkaura@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 mt-12">
                        <p className="text-brand-400 text-xs">Online Support: 10am - 8pm (IST)</p>
                    </div>
                </div>

                <div className="p-16 md:w-3/5 bg-white">
                    {submitted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-3xl text-gray-900">Message Sent Successfully</h3>
                            <p className="text-gray-500">Our team will respond to your inquiry within 24 hours.</p>
                            <button onClick={handleSendAnother} className="text-brand-600 font-bold uppercase tracking-wider text-xs underline">Send Another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-b-2 border-gray-100 focus:border-brand-500 outline-none py-3 bg-transparent transition-colors text-gray-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-b-2 border-gray-100 focus:border-brand-500 outline-none py-3 bg-transparent transition-colors text-gray-800"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b-2 border-gray-100 focus:border-brand-500 outline-none py-3 bg-transparent transition-colors text-gray-800"
                                    placeholder="E.g., Bespoke Request or General Inquiry"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full border-b-2 border-gray-100 focus:border-brand-500 outline-none py-3 bg-transparent transition-colors resize-none text-gray-800"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brand-900 text-white px-12 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-brand-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};