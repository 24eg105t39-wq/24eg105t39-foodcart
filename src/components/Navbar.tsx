import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  MapPin,
  Search,
  Menu as MenuIcon,
  X,
  Shield,
  LogOut,
  ChevronDown,
  Clock,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocation as useLocationContext } from '../context/LocationContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { totalItemCount, subtotal, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { location: userLocation, setIsLocationModalOpen } = useLocationContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-cream-200 transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center shadow-md shadow-brand-red/20 group-hover:scale-105 transition-smooth">
                <span className="text-2xl select-none">🍔</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight text-brand-charcoal">
                  Crave<span className="text-brand-red">Kart</span>
                </span>
                <span className="hidden sm:block text-[10px] font-semibold text-brand-muted uppercase tracking-widest -mt-1">
                  Food Delivered Fresh
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-xs font-semibold text-stone-700 transition-smooth border border-cream-300 group"
                title="Click to change delivery location or track live GPS"
              >
                <MapPin
                  className={`w-3.5 h-3.5 ${
                    userLocation.isLiveGps
                      ? 'text-emerald-600 animate-pulse'
                      : 'text-brand-red'
                  }`}
                />
                <span className="max-w-[150px] truncate">{userLocation.label}</span>
                {userLocation.isLiveGps && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                )}
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600" />
              </button>
            </div>
          </div>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center flex-1 max-w-md relative mx-4"
          >
            <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search burgers, biryani, pizzas, desserts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream-100 border border-cream-300 focus:border-brand-red focus:bg-white text-xs sm:text-sm rounded-full pl-11 pr-20 py-2.5 outline-none transition-smooth placeholder:text-stone-400 text-brand-charcoal"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold rounded-full transition-smooth"
            >
              Search
            </button>
          </form>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-smooth ${
                location.pathname === '/' ? 'text-brand-red' : 'text-stone-700 hover:text-brand-red'
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`text-sm font-semibold transition-smooth ${
                location.pathname === '/menu' ? 'text-brand-red' : 'text-stone-700 hover:text-brand-red'
              }`}
            >
              Menu
            </Link>
            <Link
              to="/orders"
              className={`text-sm font-semibold transition-smooth ${
                location.pathname === '/orders' ? 'text-brand-red' : 'text-stone-700 hover:text-brand-red'
              }`}
            >
              My Orders
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange-light text-brand-orange-dark text-xs font-extrabold rounded-full border border-orange-200 hover:bg-orange-100 transition-smooth"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full hover:bg-cream-100 text-stone-700 transition-smooth"
              title="My Favorites"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCartDrawer}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-full font-bold text-xs sm:text-sm shadow-md shadow-brand-red/20 hover:shadow-hover transition-smooth active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-charcoal text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {totalItemCount > 0 && (
                <span className="pl-1 border-l border-white/30 text-xs font-extrabold">
                  ₹{subtotal}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 border border-cream-300 transition-smooth"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="hidden lg:block text-xs font-bold text-stone-800 max-w-[90px] truncate">
                    {user?.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-hover border border-cream-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-cream-200 mb-1">
                      <p className="text-xs font-bold text-stone-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-extrabold text-brand-orange bg-brand-orange-light px-2 py-0.5 rounded-full">
                          ADMINISTRATOR
                        </span>
                      )}
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-stone-700 hover:bg-cream-100 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      My Profile & Addresses
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-stone-700 hover:bg-cream-100 flex items-center gap-2"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Order History
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl text-brand-orange hover:bg-brand-orange-light flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl text-brand-red hover:bg-brand-red-light flex items-center gap-2 mt-1 border-t border-cream-200 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-full border border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-bold text-xs sm:text-sm transition-smooth"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 md:hidden hover:bg-cream-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-cream-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search burgers, biryanis, pizzas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream-100 border border-cream-300 rounded-xl pl-9 pr-16 py-2 text-xs outline-none focus:border-brand-red"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 px-3 py-1 bg-brand-red text-white text-[11px] font-bold rounded-lg"
            >
              Go
            </button>
          </form>

          <div className="flex flex-col gap-1 pt-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-800 hover:bg-cream-100"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-800 hover:bg-cream-100"
            >
              Explore Full Menu
            </Link>
            <Link
              to="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-800 hover:bg-cream-100"
            >
              My Orders
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-800 hover:bg-cream-100 flex items-center justify-between"
            >
              <span>Saved Favorites</span>
              {wishlistCount > 0 && (
                <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-bold text-brand-orange bg-brand-orange-light flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
