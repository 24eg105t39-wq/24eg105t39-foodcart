import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';
import { TrackingData, Order } from '../types';
import {
  CheckCircle2,
  Clock,
  Bike,
  Phone,
  Printer,
  ChevronRight,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTracking = async () => {
    if (!id) return;
    try {
      const res = await apiClient.get(`/orders/${id}/track`);
      if (res.data.success) {
        setTracking(res.data.data);
      }
    } catch (err) {
      setError('Unable to load order tracking details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 12000); // Polling for simulated live updates
    return () => clearInterval(interval);
  }, [id]);

  const handlePrintReceipt = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-stone-500">Loading order receipt and live courier tracker...</p>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm font-bold text-rose-600">{error || 'Order not found.'}</p>
        <Link
          to="/orders"
          className="inline-block px-6 py-2.5 bg-brand-red text-white text-xs font-bold rounded-full"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const { order, steps, deliveryPartner } = tracking;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card text-center space-y-3 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Confirmed & Placed
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Thank you for ordering, {order.customerName.split(' ')[0]}!
        </h1>

        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          We have forwarded your gourmet order to our kitchen. Food is being freshly prepared with highest hygiene standards.
        </p>

        <div className="pt-2 flex items-center justify-center gap-4 text-xs font-bold">
          <span className="text-stone-400">Order Number:</span>
          <span className="font-mono text-stone-900 font-black bg-cream-100 px-3 py-1 rounded-xl border border-cream-300">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Live Tracking Stepper Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
          <div>
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-red" />
              Live Order Progress
            </h3>
            <p className="text-xs text-stone-500">
              Estimated Delivery: <strong>{tracking.estimatedDeliveryMinutes || 25} minutes</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black text-stone-800 uppercase">
              Current Status: <span className="text-brand-red">{order.status}</span>
            </span>
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-cream-300 space-y-8 my-4 ml-4">
          {steps.map((s, idx) => (
            <div key={s.key} className="relative">
              {/* Indicator Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-smooth ${
                  s.isCompleted
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-50'
                    : s.isCurrent
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/30 ring-4 ring-brand-red-light animate-pulse'
                    : 'bg-cream-200 text-stone-400 border border-cream-300'
                }`}
              >
                {s.isCompleted ? '✓' : idx + 1}
              </div>

              <div>
                <h4
                  className={`text-sm font-black ${
                    s.isCompleted || s.isCurrent ? 'text-stone-900' : 'text-stone-400'
                  }`}
                >
                  {s.label}
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Courier Partner Card */}
        {deliveryPartner && (
          <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-cream-200">
                🛵
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">
                  Assigned Delivery Hero
                </span>
                <h4 className="text-xs sm:text-sm font-black text-stone-900">
                  {deliveryPartner.name}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {deliveryPartner.vehicle} • ★ {deliveryPartner.rating}
                </p>
              </div>
            </div>

            <a
              href={`tel:${deliveryPartner.phone}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-cream-100 text-stone-900 font-bold text-xs rounded-xl border border-cream-300 transition-smooth shadow-sm self-start sm:self-auto"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contact Courier</span>
            </a>
          </div>
        )}
      </div>

      {/* Itemized Order Receipt & Delivery Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-cream-200 pb-4">
          <h3 className="text-lg font-black text-stone-900">Order Receipt</h3>
          <button
            onClick={handlePrintReceipt}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-red transition-smooth px-3 py-1.5 rounded-xl border border-cream-300 hover:bg-cream-100"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Items List */}
        <div className="divide-y divide-cream-100">
          {order.items.map((item, i) => (
            <div key={i} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.foodName}
                  className="w-12 h-12 rounded-xl object-cover bg-cream-200"
                />
                <div>
                  <h4 className="font-extrabold text-stone-900">{item.foodName}</h4>
                  <p className="text-xs text-stone-500 font-semibold">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
              </div>
              <span className="font-black text-stone-900">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery Address & Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-cream-50 rounded-2xl border border-cream-200 text-xs">
          <div>
            <span className="font-bold text-stone-400 block uppercase mb-1">
              Delivering To
            </span>
            <p className="font-extrabold text-stone-800">{order.deliveryAddress.recipientName}</p>
            <p className="text-stone-600">{order.deliveryAddress.street}</p>
            <p className="text-stone-600">
              {order.deliveryAddress.city}, {order.deliveryAddress.state} -{' '}
              {order.deliveryAddress.postalCode}
            </p>
            <p className="text-stone-500 mt-1">Phone: {order.deliveryAddress.phone}</p>
          </div>

          <div>
            <span className="font-bold text-stone-400 block uppercase mb-1">
              Payment Information
            </span>
            <p className="font-extrabold text-stone-800">
              Method: {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment'}
            </p>
            <p className="text-stone-600">
              Payment Status:{' '}
              <strong className="text-emerald-700">{order.paymentStatus}</strong>
            </p>
            {order.deliveryInstructions && (
              <p className="text-stone-500 mt-2 italic">
                Note: "{order.deliveryInstructions}"
              </p>
            )}
          </div>
        </div>

        {/* Bill Total Breakdown */}
        <div className="space-y-2 text-xs sm:text-sm text-stone-600 pt-2 border-t border-cream-200 max-w-sm ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-stone-900">₹{order.subtotalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-bold text-stone-900">
              {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
            </span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Coupon Discount ({order.couponCode})</span>
              <span>-₹{order.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Taxes & Charges (5% GST)</span>
            <span className="font-bold text-stone-900">₹{order.taxAmount}</span>
          </div>
          <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-cream-300">
            <span>Final Paid Total</span>
            <span className="text-lg font-black text-brand-red">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-cream-200">
          <Link
            to="/orders"
            className="text-xs font-bold text-stone-600 hover:text-brand-red flex items-center gap-1"
          >
            <span>View All My Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/menu"
            className="px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs rounded-full transition-smooth shadow-md shadow-brand-red/20"
          >
            Order More Delicacies
          </Link>
        </div>
      </div>
    </div>
  );
};
