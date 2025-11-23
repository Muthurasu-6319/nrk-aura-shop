
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        if (isLogin) {
          const success = await login(formData.email, formData.password);
          if (success) {
            onNavigate('home');
          } else {
            setError('Invalid credentials or Database not connected.');
          }
        } else {
          const success = await register(formData.name, formData.email, formData.password);
          if (success) {
            onNavigate('home');
          } else {
            setError('Registration failed. Email might be taken.');
          }
        }
    } catch (err) {
        setError('An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4 relative overflow-hidden">
       <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200 rounded-full blur-3xl opacity-50"></div>
       <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-200 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-12 shadow-2xl rounded-3xl border border-white relative z-10">
        <div className="text-center mb-10">
            <div className="inline-block w-12 h-12 bg-brand-800 rounded-xl rotate-45 mb-4"></div>
            <h1 className="font-serif text-2xl text-brand-900 font-bold tracking-wide">NRK AURA</h1>
            <p className="text-xs uppercase tracking-widest text-brand-500 mt-2">Member Access</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-xs text-center font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
             <input 
                type="text" 
                placeholder="Full Name"
                required 
                className="w-full bg-white border border-gray-200 px-6 py-4 text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all rounded-xl text-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
            />
          )}
          <input 
                type="email" 
                placeholder="Email Address"
                required 
                className="w-full bg-white border border-gray-200 px-6 py-4 text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all rounded-xl text-sm"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
            />
          <input 
                type="password" 
                placeholder="Password"
                required 
                className="w-full bg-white border border-gray-200 px-6 py-4 text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all rounded-xl text-sm"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
            />

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-900 transition-all shadow-lg mt-4 disabled:opacity-70"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-xs text-brand-600 font-bold hover:underline">
            {isLogin ? "New Member? Register Now" : "Already a member? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};
