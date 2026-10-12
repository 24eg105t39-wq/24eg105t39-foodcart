import React from 'react';
import { Star, Clock, Heart, Plus, Minus, Flame, Sparkles } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface FoodCardProps {
  food: FoodItem;
  onSelect: (food: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onSelect }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const cartItem = cartItems.find((item) => item.food.id === food.id);
  const inCartQty = cartItem?.quantity || 0;
  const isFavorite = isWishlisted(food.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(food.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(food, 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCartQty > 0) {
      updateQuantity(food.id, inCartQty - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(food.id, inCartQty + 1);
  };

  return (
    <div
      onClick={() => onSelect(food)}
      className="group bg-white rounded-3xl overflow-hidden border border-cream-200 hover:border-brand-red/30 shadow-card hover:shadow-hover transition-smooth flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Image & Overlays */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          onError={(e) => {
            // High quality fallback food photography
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-1.5 rounded-lg shadow-sm border border-stone-200 flex items-center justify-center">
          <div
            className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center ${
              food.isVeg ? 'border-emerald-600' : 'border-rose-600'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </div>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-smooth shadow-sm ${
            isFavorite
              ? 'bg-brand-red text-white'
              : 'bg-white/90 text-stone-600 hover:text-brand-red hover:bg-white'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Tags or Bestseller Badge */}
        {food.tags && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {food.tags.split(',').slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="bg-brand-charcoal/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-extrabold text-stone-800 shadow-sm flex items-center gap-1 border border-stone-200">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{food.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 mb-1">
            <span className="text-brand-orange-dark font-bold uppercase tracking-wider truncate max-w-[140px]" title={food.restaurantName || food.categoryName}>
              {food.restaurantName || food.categoryName || 'Chef Special'}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{food.prepTimeMinutes}m</span>
            </div>
          </div>

          <h3 className="font-extrabold text-stone-900 text-base leading-snug group-hover:text-brand-red transition-smooth line-clamp-1 mb-1">
            {food.name}
          </h3>

          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed mb-4">
            {food.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-cream-200 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-brand-charcoal">
                ₹{food.price}
              </span>
              {food.originalPrice && food.originalPrice > food.price && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{food.originalPrice}
                </span>
              )}
            </div>
            {food.calories && (
              <span className="text-[10px] text-stone-400 block font-medium">
                {food.calories} kcal
              </span>
            )}
          </div>

          {/* Cart Stepper / Add button */}
          {!food.isAvailable ? (
            <span className="text-[11px] font-bold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full">
              Sold Out
            </span>
          ) : inCartQty > 0 ? (
            <div className="flex items-center bg-brand-red text-white rounded-full p-1 shadow-sm font-bold text-xs">
              <button
                onClick={handleDecrease}
                className="w-6 h-6 rounded-full hover:bg-brand-red-dark flex items-center justify-center transition-smooth"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 font-extrabold text-xs">{inCartQty}</span>
              <button
                onClick={handleIncrease}
                className="w-6 h-6 rounded-full hover:bg-brand-red-dark flex items-center justify-center transition-smooth"
                title="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-cream-200 hover:bg-brand-red hover:text-white text-brand-charcoal font-bold text-xs rounded-full border border-cream-300 hover:border-brand-red transition-smooth flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
