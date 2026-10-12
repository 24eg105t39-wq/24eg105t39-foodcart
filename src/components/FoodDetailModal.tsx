import React, { useState } from 'react';
import {
  X,
  Star,
  Clock,
  Heart,
  Flame,
  Plus,
  Minus,
  MessageSquare,
  Check,
  Send,
} from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import apiClient, { getErrorMessage } from '../services/api';

interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onSelectRelated?: (food: FoodItem) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  onClose,
  onSelectRelated,
}) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  if (!food) return null;

  const isFavorite = isWishlisted(food.id);
  const cartItem = cartItems.find((item) => item.food.id === food.id);
  const currentInCart = cartItem?.quantity || 0;

  const handleAdd = () => {
    addToCart(food, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    setReviewError('');
    try {
      const res = await apiClient.post(`/foods/${food.id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      if (res.data.success) {
        setReviewSuccess('Review submitted! Thank you.');
        setReviewComment('');
        if (!food.reviews) food.reviews = [];
        food.reviews.unshift(res.data.data);
      }
    } catch (err) {
      setReviewError(getErrorMessage(err));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const spiceLabels = ['Mild & Gentle', 'Medium Spiced', 'Spicy Kick', 'Fiery Hot!'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-cream-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-md transition-smooth"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Hero Image */}
        <div className="relative aspect-[16/9] w-full bg-cream-200 overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Indicators overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
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
                </span>
                <span className="text-white text-xs font-bold px-3 py-1 bg-black/40 backdrop-blur-md rounded-full uppercase tracking-wider">
                  {food.categoryName || 'Special'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{food.name}</h2>
            </div>

            <button
              onClick={() => toggleWishlist(food.id)}
              className={`p-3 rounded-full backdrop-blur-md transition-smooth shadow-md ${
                isFavorite
                  ? 'bg-brand-red text-white'
                  : 'bg-white/90 text-stone-700 hover:text-brand-red'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cream-100 p-4 rounded-2xl border border-cream-200">
            <div>
              <span className="text-[11px] font-bold text-stone-400 block uppercase">Rating</span>
              <div className="flex items-center gap-1 font-black text-stone-800 text-sm mt-0.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{food.rating.toFixed(1)}</span>
                <span className="text-xs text-stone-400 font-normal">
                  ({food.reviewsCount || 0} reviews)
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-400 block uppercase">Prep Time</span>
              <div className="flex items-center gap-1 font-black text-stone-800 text-sm mt-0.5">
                <Clock className="w-4 h-4 text-stone-500" />
                <span>{food.prepTimeMinutes} mins</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-400 block uppercase">Spiciness</span>
              <div className="flex items-center gap-1 font-black text-stone-800 text-sm mt-0.5">
                <Flame className="w-4 h-4 text-brand-red" />
                <span>{spiceLabels[food.spicyLevel] || 'Normal'}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-400 block uppercase">Calories</span>
              <span className="font-black text-stone-800 text-sm mt-0.5 block">
                {food.calories ? `${food.calories} kcal` : 'Chef special'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              Culinary Story & Notes
            </h4>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Price & Add to Cart Bar */}
          <div className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-stone-400 block font-semibold">Total Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-brand-charcoal">
                  ₹{food.price * quantity}
                </span>
                {food.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{food.originalPrice * quantity}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center bg-cream-200 border border-cream-300 rounded-full p-1 font-bold">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white hover:bg-cream-100 text-stone-700 flex items-center justify-center transition-smooth"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-black text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-cream-100 text-stone-700 flex items-center justify-center transition-smooth"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 sm:flex-none px-8 py-3.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-full font-extrabold text-sm shadow-md shadow-brand-red/20 transition-smooth active:scale-95"
              >
                Add {quantity} to Cart (₹{food.price * quantity})
              </button>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-cream-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-red" />
                Customer Reviews
              </h3>
            </div>

            {/* Submit Review Box */}
            <form onSubmit={handleReviewSubmit} className="bg-cream-50 p-4 rounded-2xl border border-cream-200 mb-6">
              <h4 className="text-xs font-bold text-stone-700 uppercase mb-2">Leave a Rating</h4>
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setReviewRating(s)}
                    className="p-1 hover:scale-110 transition-smooth"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        s <= reviewRating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-stone-600 ml-2">
                  {reviewRating} out of 5 stars
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  placeholder={
                    isAuthenticated
                      ? 'Share your experience with this dish...'
                      : 'Sign in to submit your review...'
                  }
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white border border-cream-300 rounded-xl p-3 text-xs outline-none focus:border-brand-red resize-none text-stone-800"
                />
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="mt-2 px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold rounded-xl transition-smooth flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>

              {reviewSuccess && (
                <p className="text-xs font-bold text-emerald-600 mt-2">{reviewSuccess}</p>
              )}
              {reviewError && (
                <p className="text-xs font-bold text-rose-600 mt-2">{reviewError}</p>
              )}
            </form>

            {/* Existing Reviews */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {food.reviews && food.reviews.length > 0 ? (
                food.reviews.map((r, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-cream-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-800">{r.userName}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3 h-3 ${
                              idx < r.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600">{r.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 italic">
                  Be the first gourmet food enthusiast to review this item!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
