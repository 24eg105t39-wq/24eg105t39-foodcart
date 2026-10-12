import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    taxAmount,
    discountAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;

    setIsApplying(true);
    setCouponError('');
    setCouponSuccess('');

    const res = await applyCoupon(code);
    setIsApplying(false);

    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const quickCoupons = [
    { code: 'WELCOME50', desc: '50% OFF up to ₹150' },
    { code: 'CRAVE20', desc: '20% OFF up to ₹200' },
    { code: 'HUNGRY100', desc: 'Flat ₹100 OFF' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCartDrawer}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-red" />
              <h2 className="text-lg font-black text-stone-900">Your Crave Cart</h2>
              <span className="text-xs font-bold text-stone-500 bg-cream-200 px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 rounded-full hover:bg-cream-200 text-stone-600 transition-smooth"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center text-3xl">
                  🛒
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-800">Your cart is empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Satisfy your cravings! Browse our delicious menu and add your favorite dishes.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/menu');
                  }}
                  className="px-6 py-2.5 bg-brand-red text-white text-xs font-bold rounded-full hover:bg-brand-red-dark transition-smooth"
                >
                  Explore Delicious Menu
                </button>
              </div>
            ) : (
              <>
                {/* Free delivery tracker banner */}
                <div className="p-3 bg-brand-orange-light/60 rounded-2xl border border-brand-orange/20 flex items-center gap-2.5 text-xs">
                  <Sparkles className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  {subtotal >= 499 ? (
                    <span className="font-bold text-emerald-800">
                      🎉 Congratulations! You unlocked <strong className="text-brand-red">FREE Delivery</strong>!
                    </span>
                  ) : (
                    <span className="text-stone-700">
                      Add items worth <strong>₹{499 - subtotal}</strong> more for <strong>FREE Delivery</strong>!
                    </span>
                  )}
                </div>

                {/* Items */}
                <div className="divide-y divide-cream-200">
                  {cartItems.map((item) => (
                    <div key={item.food.id} className="py-3 flex items-center gap-3">
                      <img
                        src={item.food.image}
                        alt={item.food.name}
                        className="w-16 h-16 rounded-2xl object-cover bg-cream-200 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-2.5 h-2.5 rounded-sm border ${
                              item.food.isVeg ? 'border-emerald-600 bg-emerald-600' : 'border-rose-600 bg-rose-600'
                            }`}
                          />
                          <h4 className="text-xs font-extrabold text-stone-900 truncate">
                            {item.food.name}
                          </h4>
                        </div>
                        <p className="text-xs font-black text-brand-charcoal mt-0.5">
                          ₹{item.food.price * item.quantity}
                        </p>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center bg-cream-100 rounded-full p-1 border border-cream-200 text-xs font-bold">
                        <button
                          onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                          className="w-5 h-5 rounded-full hover:bg-cream-200 flex items-center justify-center text-stone-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-black text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                          className="w-5 h-5 rounded-full hover:bg-cream-200 flex items-center justify-center text-stone-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.food.id)}
                        className="p-1.5 text-stone-400 hover:text-brand-red transition-smooth"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-2">
                  <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-brand-red" />
                      Apply Promo Coupon
                    </span>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-800">
                            {appliedCoupon.code} applied (₹{appliedCoupon.discountAmount} saved)
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter coupon (e.g. WELCOME50)"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            className="flex-1 bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs uppercase outline-none focus:border-brand-red font-semibold"
                          />
                          <button
                            onClick={() => handleApplyCoupon()}
                            disabled={isApplying || !couponInput.trim()}
                            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-brand-red transition-smooth disabled:opacity-50"
                          >
                            Apply
                          </button>
                        </div>

                        {/* Quick pills */}
                        <div className="flex gap-1.5 flex-wrap pt-1">
                          {quickCoupons.map((c) => (
                            <button
                              key={c.code}
                              onClick={() => handleApplyCoupon(c.code)}
                              className="text-[10px] font-bold bg-white hover:bg-brand-red hover:text-white text-stone-700 px-2 py-1 rounded-lg border border-cream-300 transition-smooth"
                            >
                              {c.code}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {couponSuccess && (
                      <p className="text-[11px] font-bold text-emerald-600">{couponSuccess}</p>
                    )}
                    {couponError && (
                      <p className="text-[11px] font-bold text-rose-600">{couponError}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Bill & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-cream-200 bg-cream-50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-stone-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span className="font-semibold text-stone-800">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes & Charges (5% GST)</span>
                  <span className="font-semibold text-stone-800">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-cream-300">
                  <span>To Pay</span>
                  <span className="text-base font-black text-brand-red">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-full font-black text-sm shadow-md shadow-brand-red/20 flex items-center justify-center gap-2 transition-smooth active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
