import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Star,
  Navigation,
  ChevronRight,
  Sparkles,
  Leaf,
  Store,
  Compass,
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { Restaurant } from '../types';

export const NearbyRestaurantsSection: React.FC = () => {
  const navigate = useNavigate();
  const {
    location,
    nearbyRestaurants,
    loadingRestaurants,
    setIsLocationModalOpen,
    requestLiveGpsLocation,
    isDetecting,
  } = useLocation();

  const [activeFilter, setActiveFilter] = useState<'all' | 'under3' | 'under6' | 'veg'>('all');

  const filteredRestaurants = nearbyRestaurants.filter((rest) => {
    if (activeFilter === 'under3') return (rest.distanceKm ?? 99) <= 3;
    if (activeFilter === 'under6') return (rest.distanceKm ?? 99) <= 6;
    if (activeFilter === 'veg') return rest.isPureVeg;
    return true;
  });

  return (
    <section className="py-12 bg-cream-50 border-y border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Live Distance Tracking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal tracking-tight">
              Nearby Kitchens Delivering to You
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-sm text-brand-charcoal/70">
              <MapPin className="w-4 h-4 text-brand-red shrink-0" />
              <span>
                Sorted by proximity to{' '}
                <strong className="text-brand-charcoal font-semibold">{location.label}</strong>
              </span>
              {location.isLiveGps && (
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  GPS Active
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => requestLiveGpsLocation()}
              disabled={isDetecting}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-red text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-brand-red/90 transition-all disabled:opacity-50"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isDetecting ? 'Locating...' : 'Track My GPS'}</span>
            </button>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-brand-charcoal text-xs font-semibold rounded-xl border border-cream-300 shadow-sm hover:bg-cream-100 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              <span>Change Area</span>
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-brand-charcoal text-white shadow-sm'
                : 'bg-white text-brand-charcoal/70 border border-cream-300 hover:bg-cream-100'
            }`}
          >
            All Kitchens ({nearbyRestaurants.length})
          </button>
          <button
            onClick={() => setActiveFilter('under3')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'under3'
                ? 'bg-brand-red text-white shadow-sm'
                : 'bg-white text-brand-charcoal/70 border border-cream-300 hover:bg-cream-100'
            }`}
          >
            ⚡ Under 3 km (Lightning Fast)
          </button>
          <button
            onClick={() => setActiveFilter('under6')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'under6'
                ? 'bg-brand-red text-white shadow-sm'
                : 'bg-white text-brand-charcoal/70 border border-cream-300 hover:bg-cream-100'
            }`}
          >
            🛵 Under 6 km
          </button>
          <button
            onClick={() => setActiveFilter('veg')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'veg'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-brand-charcoal/70 border border-cream-300 hover:bg-cream-100'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-500" />
            <span>Pure Veg Only</span>
          </button>
        </div>

        {/* Restaurants Grid */}
        {loadingRestaurants ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-cream-300 p-4 animate-pulse space-y-4"
              >
                <div className="w-full h-44 bg-cream-200 rounded-2xl" />
                <div className="h-5 bg-cream-200 rounded w-3/4" />
                <div className="h-4 bg-cream-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-cream-300 p-8">
            <Store className="w-12 h-12 text-brand-charcoal/30 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-brand-charcoal">No restaurants match this filter</h3>
            <p className="text-sm text-brand-charcoal/60 mt-1">
              Try switching your location or relaxing your distance filter.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 px-4 py-2 bg-brand-red text-white text-xs font-semibold rounded-xl"
            >
              Show All Nearby Kitchens
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onSelect={() => navigate(`/menu?restaurant=${restaurant.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const RestaurantCard: React.FC<{
  restaurant: Restaurant;
  onSelect: () => void;
}> = ({ restaurant, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="group bg-white rounded-3xl overflow-hidden border border-cream-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-cream-200">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-xl text-xs font-bold text-brand-charcoal shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{restaurant.rating.toFixed(1)}</span>
          <span className="text-brand-charcoal/50 text-[10px]">({restaurant.reviewsCount})</span>
        </div>

        {/* Veg Badge */}
        {restaurant.isPureVeg && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-xl text-[11px] font-bold shadow-sm">
            <Leaf className="w-3 h-3" />
            <span>Pure Veg</span>
          </div>
        )}

        {/* Bottom Distance & Delivery overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-brand-red" />
            <span>
              {restaurant.distanceKm !== undefined ? `${restaurant.distanceKm} km away` : 'Nearby'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{restaurant.deliveryTimeMinutes} mins delivery</span>
          </div>
        </div>
      </div>

      {/* Body details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-lg text-brand-charcoal group-hover:text-brand-red transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
          </div>
          <p className="text-xs text-brand-charcoal/60 mt-1 line-clamp-1">
            {restaurant.cuisines.join(' • ')}
          </p>
          <p className="text-xs text-brand-charcoal/50 mt-1 line-clamp-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-charcoal/40 shrink-0" />
            <span>{restaurant.address}</span>
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-brand-charcoal/50">Delivery fee: </span>
            <span className="font-bold text-brand-charcoal">₹{restaurant.deliveryFee}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-brand-red group-hover:translate-x-1 transition-transform">
            <span>Explore Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
