import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../services/api';
import { FoodItem, Category } from '../types';
import { FoodCard } from '../components/FoodCard';
import { FoodDetailModal } from '../components/FoodDetailModal';
import { Search, Filter, SlidersHorizontal, RotateCcw, ArrowUpDown, Store, MapPin, Clock, X } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { nearbyRestaurants, location } = useLocation();

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(searchParams.get('restaurant') || 'all');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');

  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  // Fetch foods with queries
  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, any> = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedRestaurant !== 'all') params.restaurantId = selectedRestaurant;
        if (dietFilter === 'veg') params.isVeg = true;
        if (dietFilter === 'nonveg') params.isVeg = false;
        if (maxPrice < 600) params.maxPrice = maxPrice;
        if (sortBy) params.sort = sortBy;

        const [foodsRes, catsRes] = await Promise.all([
          apiClient.get('/foods', { params }),
          apiClient.get('/categories'),
        ]);

        if (foodsRes.data.success) {
          setFoods(foodsRes.data.data);
        }
        if (catsRes.data.success) {
          setCategories(catsRes.data.data);
        }
      } catch (err) {
        console.error('Menu load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, [searchQuery, selectedCategory, selectedRestaurant, dietFilter, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRestaurant('all');
    setDietFilter('all');
    setMaxPrice(600);
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
            Handcrafted Menu
          </span>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight mt-0.5">
            Explore All Cravings
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Browse our full repertoire of chef-curated signature preparations.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by dish or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream-100 border border-cream-300 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm outline-none focus:border-brand-red focus:bg-white transition-smooth font-semibold text-stone-900"
          />
        </div>
      </div>

      {/* Filter and Content Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-red" />
                <h3 className="font-black text-sm text-stone-900">Filters</h3>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-stone-400 hover:text-brand-red flex items-center gap-1 transition-smooth"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Diet preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block uppercase">
                Dietary Preference
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-cream-100 p-1 rounded-2xl border border-cream-200 text-xs font-black">
                <button
                  onClick={() => setDietFilter('all')}
                  className={`py-2 rounded-xl transition-smooth ${
                    dietFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDietFilter('veg')}
                  className={`py-2 rounded-xl transition-smooth ${
                    dietFilter === 'veg'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-700 hover:bg-white'
                  }`}
                >
                  Veg
                </button>
                <button
                  onClick={() => setDietFilter('nonveg')}
                  className={`py-2 rounded-xl transition-smooth ${
                    dietFilter === 'nonveg'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-rose-700 hover:bg-white'
                  }`}
                >
                  Non-Veg
                </button>
              </div>
            </div>

            {/* Restaurant Kitchen Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 block uppercase">
                  Kitchen / Restaurant
                </label>
                <span className="text-[10px] text-brand-red font-semibold">Live GPS</span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedRestaurant('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-smooth flex items-center justify-between ${
                    selectedRestaurant === 'all'
                      ? 'bg-brand-red text-white'
                      : 'text-stone-700 hover:bg-cream-100'
                  }`}
                >
                  <span>All Kitchens</span>
                </button>
                {nearbyRestaurants.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRestaurant(r.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-smooth flex items-center justify-between ${
                      selectedRestaurant === r.id
                        ? 'bg-brand-red text-white'
                        : 'text-stone-700 hover:bg-cream-100'
                    }`}
                  >
                    <span className="truncate max-w-[130px]">{r.name}</span>
                    <span className="text-[10px] opacity-80 whitespace-nowrap">
                      {r.distanceKm !== undefined ? `${r.distanceKm} km` : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block uppercase">
                Category
              </label>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-smooth flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-brand-red text-white'
                      : 'text-stone-700 hover:bg-cream-100'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-smooth flex items-center justify-between ${
                      selectedCategory === c.id
                        ? 'bg-brand-red text-white'
                        : 'text-stone-700 hover:bg-cream-100'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {c.itemCount !== undefined && (
                      <span className="text-[10px] opacity-75">{c.itemCount}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span className="uppercase">Max Price</span>
                <span className="text-brand-red font-black">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="140"
                max="600"
                step="20"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-red cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                <span>₹140</span>
                <span>₹600</span>
              </div>
            </div>

            {/* Sort By Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block uppercase">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-cream-100 border border-cream-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 outline-none focus:border-brand-red"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Food Items Grid */}
        <main className="lg:col-span-3 space-y-6">
          {selectedRestaurant !== 'all' && (
            <div className="bg-gradient-to-r from-brand-red/10 via-brand-orange/10 to-cream-100 border border-brand-red/20 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-red text-white rounded-2xl shadow-sm">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-red">Active Kitchen</span>
                    {nearbyRestaurants.find((r) => r.id === selectedRestaurant)?.isPureVeg && (
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">Pure Veg</span>
                    )}
                  </div>
                  <h2 className="text-lg font-extrabold text-brand-charcoal">
                    {nearbyRestaurants.find((r) => r.id === selectedRestaurant)?.name || 'Selected Kitchen'}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-brand-charcoal/70 mt-0.5">
                    <span className="flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-brand-red" />
                      {nearbyRestaurants.find((r) => r.id === selectedRestaurant)?.distanceKm !== undefined
                        ? `${nearbyRestaurants.find((r) => r.id === selectedRestaurant)?.distanceKm} km away`
                        : 'Nearby'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {nearbyRestaurants.find((r) => r.id === selectedRestaurant)?.deliveryTimeMinutes || 25} mins delivery
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedRestaurant('all')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-xs font-bold text-brand-charcoal border border-cream-300 rounded-xl hover:bg-cream-100 shadow-sm self-start sm:self-auto transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Show All Kitchens</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>Showing {foods.length} items</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl aspect-[3/4] animate-pulse border border-cream-200"
                />
              ))}
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-cream-200 p-8 space-y-4">
              <span className="text-5xl block">🔍</span>
              <h3 className="text-lg font-black text-stone-900">
                No matching dishes found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We couldn't find any items matching your current filters. Try searching for something else or reset filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-brand-red text-white rounded-full text-xs font-bold hover:bg-brand-red-dark transition-smooth"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onSelect={(item) => setSelectedFood(item)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Food Details Modal */}
      <FoodDetailModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
