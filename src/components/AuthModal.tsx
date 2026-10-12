import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (mode === 'login') {
      const res = await login(email, password);
      setIsSubmitting(false);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      const res = await register(name, email, password, phone);
      setIsSubmitting(false);
      if (!res.success) {
        setError(res.message);
      }
    }
  };

  const handleQuickCustomer = () => {
    setEmail('customer@cravekart.com');
    setPassword('Customer@123456');
    setMode('login');
    setError('');
  };

  const handleQuickAdmin = () => {
    setEmail('admin@cravekart.com');
    setPassword('Admin@123456');
    setMode('login');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-br from-cream-100 to-cream-200 border-b border-cream-300 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-sm transition-smooth"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-extrabold text-brand-charcoal">
              Crave<span className="text-brand-red">Kart</span>
            </span>
          </div>
          <h3 className="text-lg font-black text-stone-900">
            {mode === 'login' ? 'Welcome Back!' : 'Create Your Foodie Account'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {mode === 'login'
              ? 'Log in to track orders, save favorites, and redeem discounts.'
              : 'Sign up to unlock 50% discount on your first order.'}
          </p>

          {/* Quick Demo Autofill Pills */}
          <div className="mt-4 pt-3 border-t border-cream-300 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-stone-500 uppercase">One-Click Demo:</span>
            <button
              type="button"
              onClick={handleQuickCustomer}
              className="text-[11px] font-bold bg-white text-stone-800 hover:bg-brand-red hover:text-white px-2.5 py-1 rounded-full border border-cream-300 transition-smooth shadow-sm"
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="text-[11px] font-bold bg-white text-brand-orange-dark hover:bg-brand-orange hover:text-white px-2.5 py-1 rounded-full border border-orange-200 transition-smooth shadow-sm flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Tab buttons */}
          <div className="flex bg-cream-100 p-1 rounded-2xl mb-5 border border-cream-200">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-smooth ${
                mode === 'login'
                  ? 'bg-white text-brand-charcoal shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-smooth ${
                mode === 'register'
                  ? 'bg-white text-brand-charcoal shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Aditya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-brand-red focus:bg-white text-stone-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-brand-red focus:bg-white text-stone-900"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="+91 9123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-brand-red focus:bg-white text-stone-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-brand-red focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl font-black text-xs sm:text-sm shadow-md shadow-brand-red/20 transition-smooth active:scale-95 disabled:opacity-50 mt-4"
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In to CraveKart'
                : 'Join CraveKart'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
