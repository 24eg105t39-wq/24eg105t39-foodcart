import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Clock,
  ShoppingBag,
  RotateCcw,
  ChevronRight,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    apiClient
      .get('/orders')
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  const handleReorder = (order: Order) => {
    for (const item of order.items) {
      addToCart(
        {
          id: item.foodItemId,
          name: item.foodName,
          price: item.price,
          description: '',
          categoryId: '',
          image: item.image,
          isVeg: true,
          isAvailable: true,
          rating: 4.8,
          reviewsCount: 10,
          prepTimeMinutes: 20,
          spicyLevel: 1,
        },
        item.quantity
      );
    }
    navigate('/checkout');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'OUT_FOR_DELIVERY':
        return 'bg-sky-100 text-sky-800 border-sky-300 animate-pulse';
      case 'PREPARING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-cream-200 rounded-full flex items-center justify-center mx-auto text-3xl">
          🔒
        </div>
        <h2 className="text-2xl font-black text-stone-900">Sign in to view orders</h2>
        <p className="text-xs text-stone-500">
          Please log in to your CraveKart account to access your live tracking and past order receipts.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 bg-brand-red text-white text-xs font-bold rounded-full hover:bg-brand-red-dark transition-smooth"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-stone-500">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
          Your Culinary Journey
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
          Order History & Tracking
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review previous cravings, live tracking status, and one-click reordering.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 shadow-card space-y-4">
          <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center text-4xl mx-auto">
            🍽️
          </div>
          <h3 className="text-lg font-black text-stone-900">No orders placed yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            When you place your first order, you will be able to track live delivery and view your itemized receipts right here.
          </p>
          <Link
            to="/menu"
            className="inline-block px-6 py-2.5 bg-brand-red text-white text-xs font-bold rounded-full hover:bg-brand-red-dark transition-smooth"
          >
            Explore Menu & Order
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card hover:shadow-hover transition-smooth space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-stone-900">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="px-4 py-2 bg-cream-100 hover:bg-brand-red hover:text-white text-stone-800 text-xs font-bold rounded-xl border border-cream-300 transition-smooth flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                  </Link>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-brand-red-dark transition-smooth flex items-center gap-1 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>

              {/* Items summary */}
              <div className="divide-y divide-cream-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.foodName}
                        className="w-10 h-10 rounded-xl object-cover bg-cream-200"
                      />
                      <div>
                        <h4 className="font-extrabold text-stone-900">{item.foodName}</h4>
                        <span className="text-stone-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-black text-stone-800">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="pt-3 border-t border-cream-200 flex items-center justify-between text-xs">
                <div className="text-stone-500 text-[11px]">
                  <span>Paid via </span>
                  <strong className="text-stone-800">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                  </strong>
                </div>

                <div className="text-right">
                  <span className="text-stone-400 text-[11px] block">Order Total</span>
                  <span className="text-base font-black text-brand-red">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
