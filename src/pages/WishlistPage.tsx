import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { FoodItem } from '../types';
import { FoodCard } from '../components/FoodCard';
import { FoodDetailModal } from '../components/FoodDetailModal';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistIds } = useWishlist();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get('/foods')
      .then((res) => {
        if (res.data.success) {
          const allFoods: FoodItem[] = res.data.data;
          const favoriteFoods = allFoods.filter((f) => wishlistIds.has(f.id));
          setFoods(favoriteFoods);
        }
      })
      .catch((err) => {
        console.error('Failed to load wishlist:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
          Your Curated Collection
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
          Saved Favorites ({foods.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Quickly access and order the signature dishes you crave the most.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl aspect-[3/4] animate-pulse border border-cream-200"
            />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 shadow-card space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-brand-red flex items-center justify-center text-3xl mx-auto">
            ❤️
          </div>
          <h3 className="text-lg font-black text-stone-900">No favorite dishes yet</h3>
          <p className="text-xs text-stone-500">
            Click the heart icon on any mouth-watering dish while browsing to save it here for instant ordering.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-red text-white text-xs font-bold rounded-full hover:bg-brand-red-dark transition-smooth shadow-sm"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onSelect={(item) => setSelectedFood(item)}
            />
          ))}
        </div>
      )}

      <FoodDetailModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
