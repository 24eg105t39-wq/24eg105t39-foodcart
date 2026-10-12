import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { CategoryBar } from '../components/CategoryBar';
import { FoodCard } from '../components/FoodCard';
import { FoodDetailModal } from '../components/FoodDetailModal';
import { CouponBanner } from '../components/CouponBanner';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { NearbyRestaurantsSection } from '../components/NearbyRestaurantsSection';
import { FoodItem, Category } from '../types';
import apiClient from '../services/api';
import { Sparkles, ArrowRight, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [foodsRes, catsRes] = await Promise.all([
          apiClient.get('/foods'),
          apiClient.get('/categories'),
        ]);

        if (foodsRes.data.success) {
          setFoods(foodsRes.data.data);
        }
        if (catsRes.data.success) {
          setCategories(catsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter foods for display
  const filteredFoods = foods.filter((food) => {
    if (selectedCategory !== 'all' && food.categoryId !== selectedCategory) {
      return false;
    }
    if (dietFilter === 'veg' && !food.isVeg) return false;
    if (dietFilter === 'nonveg' && food.isVeg) return false;
    return true;
  });

  return (
    <div className="space-y-12">
      {/* Hero */}
      <HeroSection />

      {/* Live Distance Tracking & Nearby Kitchens */}
      <NearbyRestaurantsSection />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Promotional Deals Banner */}
        <CouponBanner />

        {/* Featured Categories & Filter Bar */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
                Satisfy Any Craving
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Explore Delicious Categories
              </h2>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-black text-brand-red hover:text-brand-red-dark transition-smooth self-start sm:self-auto"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <CategoryBar
            categories={categories}
            selectedCategoryId={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        {/* Popular Dishes Showcase */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-cream-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                  Popular & Trending Dishes
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Hand-picked dishes loved and frequently reordered by Bengaluru foodies.
              </p>
            </div>

            {/* Veg / Non-Veg Quick Pill Filters */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-cream-100 p-1 rounded-2xl border border-cream-200">
              <button
                onClick={() => setDietFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-smooth ${
                  dietFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietFilter('veg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-smooth ${
                  dietFilter === 'veg'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-700 hover:bg-white'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-300" />
                Pure Veg
              </button>
              <button
                onClick={() => setDietFilter('nonveg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-smooth ${
                  dietFilter === 'nonveg'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-rose-700 hover:bg-white'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-rose-300" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* Food Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl aspect-[3/4] animate-pulse border border-cream-200"
                />
              ))}
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="text-center py-16 bg-cream-50 rounded-3xl border border-cream-200 space-y-3">
              <span className="text-4xl block">🥗</span>
              <h4 className="text-base font-black text-stone-800">
                No items match this combination
              </h4>
              <p className="text-xs text-stone-500">
                Try switching category or clearing the vegetarian filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setDietFilter('all');
                }}
                className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded-full"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFoods.slice(0, 12).map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onSelect={(item) => setSelectedFood(item)}
                />
              ))}
            </div>
          )}
        </section>

        {/* How It Works */}
        <HowItWorksSection />

        {/* Customer Reviews & Social Proof */}
        <TestimonialsSection />
      </div>

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
