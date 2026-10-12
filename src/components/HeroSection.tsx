import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, Clock, ShieldCheck, Flame, Navigation, Loader2 } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { location, setIsLocationModalOpen, requestLiveGpsLocation, isDetecting } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/menu');
    }
  };

  const trendingSearches = [
    { label: '🔥 Dum Biryani', query: 'biryani' },
    { label: '🍔 Smash Burgers', query: 'burger' },
    { label: '🍕 Sourdough Pizza', query: 'pizza' },
    { label: '🍫 Lava Cake', query: 'lava' },
    { label: '🥑 Healthy Bowls', query: 'bowl' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white pt-10 pb-16 sm:pb-24 border-b border-cream-200">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange-light/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-red-light/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red-light border border-brand-red/20 text-brand-red text-xs font-black uppercase tracking-wider shadow-sm">
              <Flame className="w-4 h-4 fill-brand-red" />
              <span>Bengaluru's #1 Rated Gourmet Delivery</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-charcoal tracking-tight leading-[1.1]">
              Your Cravings, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-orange to-amber-500">
                Delivered.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-stone-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Indulge in slow-cooked Hyderabadi biryanis, woodfired Neapolitan sourdough pizzas, juicy smashed burgers, and decadent Belgian desserts crafted fresh by artisan kitchens.
            </p>

            {/* Main Search & Location Box */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-2.5 sm:p-3 rounded-3xl shadow-hover border border-cream-200 max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 transition-smooth"
            >
              {/* Location Selector Button */}
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center justify-between gap-2 px-3 py-2 bg-cream-100 hover:bg-cream-200 rounded-2xl border border-cream-200 sm:w-52 flex-shrink-0 text-left transition-smooth"
                title="Change delivery location"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin
                    className={`w-4 h-4 flex-shrink-0 ${
                      location.isLiveGps
                        ? 'text-emerald-600 animate-pulse'
                        : 'text-brand-red'
                    }`}
                  />
                  <span className="text-xs font-bold text-stone-800 truncate">
                    {location.label}
                  </span>
                </div>
                {location.isLiveGps && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black">
                    GPS
                  </span>
                )}
              </button>

              {/* Dish search */}
              <div className="flex-1 flex items-center px-3 py-2 bg-cream-50 sm:bg-transparent rounded-2xl">
                <Search className="w-4 h-4 text-stone-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes or cravings..."
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-brand-red/25 transition-smooth active:scale-95"
              >
                Find Food
              </button>
            </form>

            {/* Trending tags */}
            <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap pt-1 text-xs">
              <span className="font-bold text-stone-400 text-[11px] uppercase">Trending:</span>
              {trendingSearches.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => navigate(`/menu?search=${encodeURIComponent(item.query)}`)}
                  className="bg-cream-100 hover:bg-brand-red hover:text-white text-stone-700 px-3 py-1 rounded-full text-xs font-semibold border border-cream-300 transition-smooth"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Trust Metrics */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-cream-200 max-w-lg mx-auto lg:mx-0">
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-brand-red font-black text-lg sm:text-xl">
                  <Clock className="w-5 h-5" />
                  <span>25-30m</span>
                </div>
                <p className="text-[11px] text-stone-500 font-semibold">Lightning Delivery</p>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5 text-amber-500 font-black text-lg sm:text-xl">
                  <span>★ 4.9/5</span>
                </div>
                <p className="text-[11px] text-stone-500 font-semibold">50,000+ Reviews</p>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5 text-emerald-600 font-black text-lg sm:text-xl">
                  <ShieldCheck className="w-5 h-5" />
                  <span>100%</span>
                </div>
                <p className="text-[11px] text-stone-500 font-semibold">Hygienic Certified</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Food Photo Hero Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-cream-200 aspect-[4/4.5] group">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80"
                  alt="Royal Hyderabadi Dum Biryani"
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Overlaid Food Card info */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="bg-brand-red text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                    Today's Chef Masterpiece
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black mt-2">
                    Royal Hyderabadi Dum Biryani
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                    Slow-cooked in sealed earthen clay handis with saffron & aged basmati.
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-black text-white">₹349</span>
                    <button
                      onClick={() => navigate('/menu?search=biryani')}
                      className="px-4 py-2 bg-white text-brand-charcoal hover:bg-brand-red hover:text-white rounded-full text-xs font-black transition-smooth"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Floating Pill: Live ETA */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-cream-200 flex items-center gap-3 animate-bounce duration-1000">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-black">
                  🛵
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Live Courier</span>
                  <span className="text-xs font-black text-stone-900">Arriving in 24 mins</span>
                </div>
              </div>

              {/* Floating Promo Discount Pill */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-cream-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center font-black text-sm">
                  50%
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-red uppercase block">Special Promo</span>
                  <span className="text-xs font-black text-stone-900">Use code: WELCOME50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
