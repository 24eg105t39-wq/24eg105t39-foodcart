import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Send, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center text-white text-xl">
                🍔
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Crave<span className="text-brand-red">Kart</span>
              </span>
            </Link>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Your Cravings, Delivered. Experience gourmet delicacies, slow-cooked royal dum biryanis, sourdough artisan pizzas, and handcrafted treats delivered scorching hot to your doorstep in 30 minutes.
            </p>
            <div className="flex items-center gap-3 pt-2 text-stone-400 text-xs">
              <div className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-full border border-stone-700/60">
                <MapPin className="w-3.5 h-3.5 text-brand-red" />
                <span>Indiranagar 100ft Rd, Bengaluru</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-brand-red transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-brand-red transition-smooth">
                  Explore Full Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-brand-red transition-smooth">
                  Track Live Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-brand-red transition-smooth">
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-red transition-smooth">
                  My Profile & Addresses
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Cravings
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/menu?category=cat_biryani" className="hover:text-brand-red transition-smooth">
                  Royal Dum Biryani
                </Link>
              </li>
              <li>
                <Link to="/menu?category=cat_burgers" className="hover:text-brand-red transition-smooth">
                  Smash Burgers & Shakes
                </Link>
              </li>
              <li>
                <Link to="/menu?category=cat_pizzas" className="hover:text-brand-red transition-smooth">
                  Woodfired Sourdough Pizzas
                </Link>
              </li>
              <li>
                <Link to="/menu?category=cat_desserts" className="hover:text-brand-red transition-smooth">
                  Molten Cakes & Bakes
                </Link>
              </li>
              <li>
                <Link to="/menu?category=cat_healthy" className="hover:text-brand-red transition-smooth">
                  Superfood Salad Bowls
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              Secret Deals
            </h4>
            <p className="text-stone-400 text-xs mb-3">
              Subscribe to get 50% discount vouchers and secret weekend drops.
            </p>
            {isSubscribed ? (
              <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You're in! Check your inbox for coupon code WELCOME50.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-brand-red"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 p-2 bg-brand-red hover:bg-brand-red-dark text-white rounded-lg transition-smooth"
                    title="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-stone-500">We respect your privacy. No spam ever.</p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} CraveKart Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-brand-red fill-brand-red" />
            <span>for passionate food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
