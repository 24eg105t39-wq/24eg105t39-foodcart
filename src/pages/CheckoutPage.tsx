import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  MapPin,
  CreditCard,
  Banknote,
  Tag,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient, { getErrorMessage } from '../services/api';
import { Address } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cartItems,
    subtotal,
    deliveryFee,
    taxAmount,
    discountAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const { user, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  // Address State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [postalCode, setPostalCode] = useState('560038');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Fetch saved user addresses
  useEffect(() => {
    if (isAuthenticated) {
      apiClient
        .get('/addresses')
        .then((res) => {
          if (res.data.success && res.data.data.length > 0) {
            setAddresses(res.data.data);
            const defaultAddr = res.data.data.find((a: Address) => a.isDefault) || res.data.data[0];
            setSelectedAddressId(defaultAddr.id);
            setRecipientName(defaultAddr.recipientName);
            setPhone(defaultAddr.phone);
            setStreet(defaultAddr.street);
            setCity(defaultAddr.city);
            setState(defaultAddr.state);
            setPostalCode(defaultAddr.postalCode);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleSelectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const res = await applyCoupon(couponCode.trim());
    setCouponMsg({ success: res.success, text: res.message });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/menu');
      return;
    }

    if (!street.trim() || !phone.trim() || !recipientName.trim()) {
      setOrderError('Please fill in complete address and contact information.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          foodItemId: item.food.id,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          recipientName: recipientName.trim(),
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          phone: phone.trim(),
        },
        couponCode: appliedCoupon?.code,
        paymentMethod,
        deliveryInstructions: deliveryInstructions.trim() || undefined,
      };

      const res = await apiClient.post('/orders', payload);

      if (res.data.success) {
        const order = res.data.data;

        // Celebratory confetti burst!
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });

        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      } else {
        setOrderError(res.data.message || 'Failed to place order.');
      }
    } catch (err) {
      setOrderError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-3xl">
          🛍️
        </div>
        <h2 className="text-2xl font-black text-stone-900">Your cart is empty</h2>
        <p className="text-xs sm:text-sm text-stone-500">
          You haven't selected any dishes yet. Add your favorite cravings to proceed!
        </p>
        <Link
          to="/menu"
          className="inline-block px-8 py-3 bg-brand-red text-white font-bold text-xs rounded-full hover:bg-brand-red-dark transition-smooth shadow-md shadow-brand-red/20"
        >
          Explore Delicious Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-red transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-2">
          Secure Checkout
        </h1>
      </div>

      {orderError && (
        <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{orderError}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Delivery Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Delivery Address Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-red-light text-brand-red flex items-center justify-center font-black text-xs">
                  1
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                    Delivery Address
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Where should our courier deliver your feast?
                  </p>
                </div>
              </div>
            </div>

            {/* Saved Addresses list */}
            {addresses.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-400 block uppercase">
                  Saved Locations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => handleSelectSavedAddress(a)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-smooth text-xs ${
                        selectedAddressId === a.id
                          ? 'border-brand-red bg-brand-red-light/30 ring-1 ring-brand-red'
                          : 'border-cream-300 hover:border-cream-400 bg-cream-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-extrabold text-stone-900 mb-1">
                        <span>{a.label}</span>
                        {selectedAddressId === a.id && (
                          <CheckCircle2 className="w-4 h-4 text-brand-red" />
                        )}
                      </div>
                      <p className="text-stone-600 truncate">{a.recipientName}</p>
                      <p className="text-stone-500 truncate">{a.street}</p>
                      <p className="text-stone-400 text-[10px]">{a.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address fields */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Aditya Sharma"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-brand-red focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-brand-red focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Street Address & Flat / House No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Lotus Residency, 12th Main Road"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-brand-red focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-brand-red"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-brand-red"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ring the bell twice, leave with security guard, extra napkins..."
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl p-3 text-xs outline-none focus:border-brand-red resize-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 border-b border-cream-200 pb-4">
              <div className="w-8 h-8 rounded-xl bg-brand-red-light text-brand-red flex items-center justify-center font-black text-xs">
                2
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                  Payment Method
                </h3>
                <p className="text-[11px] text-stone-500">
                  Select your preferred settlement mode
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Cash On Delivery */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-smooth flex items-center justify-between ${
                  paymentMethod === 'COD'
                    ? 'border-brand-red bg-brand-red-light/30 ring-1 ring-brand-red'
                    : 'border-cream-300 bg-cream-50 hover:bg-cream-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                    💵
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-900">Cash on Delivery</h4>
                    <p className="text-[10px] text-stone-500">Pay cash or UPI at doorstep</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'COD' ? 'border-brand-red' : 'border-stone-300'
                  }`}
                >
                  {paymentMethod === 'COD' && (
                    <div className="w-2 h-2 rounded-full bg-brand-red" />
                  )}
                </div>
              </div>

              {/* Online Payment */}
              <div
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-4 rounded-2xl border cursor-pointer transition-smooth flex items-center justify-between ${
                  paymentMethod === 'ONLINE'
                    ? 'border-brand-red bg-brand-red-light/30 ring-1 ring-brand-red'
                    : 'border-cream-300 bg-cream-50 hover:bg-cream-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                    💳
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-900">Online Payment</h4>
                    <p className="text-[10px] text-stone-500">Instant UPI, Cards & NetBanking</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'ONLINE' ? 'border-brand-red' : 'border-stone-300'
                  }`}
                >
                  {paymentMethod === 'ONLINE' && (
                    <div className="w-2 h-2 rounded-full bg-brand-red" />
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>100% Safe & Encrypted Checkout Guarantee. Server-verified totals.</span>
            </div>
          </div>
        </div>

        {/* Right Order Summary & Bill */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6 sticky top-28">
            <h3 className="font-black text-base text-stone-900 border-b border-cream-200 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-semibold text-stone-500">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </h3>

            {/* Cart Items list */}
            <div className="divide-y divide-cream-100 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.food.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-extrabold text-stone-800 w-5">
                      {item.quantity}x
                    </span>
                    <span className="text-stone-700 truncate">{item.food.name}</span>
                  </div>
                  <span className="font-bold text-stone-900 whitespace-nowrap">
                    ₹{item.food.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
              <span className="text-xs font-bold text-stone-700 block uppercase">
                Promo Coupon
              </span>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                  <span className="text-xs font-bold text-emerald-800">
                    {appliedCoupon.code} applied (-₹{appliedCoupon.discountAmount})
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME50"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs uppercase font-semibold outline-none focus:border-brand-red"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-stone-900 hover:bg-brand-red text-white text-xs font-bold rounded-xl transition-smooth"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponMsg && (
                <p
                  className={`text-[11px] font-bold ${
                    couponMsg.success ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Bill details */}
            <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-cream-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
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
                  <span>Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span className="font-semibold text-stone-800">₹{taxAmount}</span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-900 pt-3 border-t border-cream-300">
                <span>Total Amount</span>
                <span className="text-lg font-black text-brand-red">₹{totalAmount}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-red hover:bg-brand-red-dark text-white rounded-full font-black text-sm sm:text-base shadow-lg shadow-brand-red/25 transition-smooth active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Securing Your Order...</span>
              ) : (
                <span>
                  Place Order • ₹{totalAmount} ({paymentMethod})
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
