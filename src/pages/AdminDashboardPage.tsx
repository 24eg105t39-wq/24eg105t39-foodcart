import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  AdminStats,
  Order,
  FoodItem,
  Category,
  Coupon,
  User,
  OrderStatus,
} from '../types';
import {
  Shield,
  DollarSign,
  ShoppingBag,
  Users,
  Utensils,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'foods' | 'coupons' | 'users'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerMsg, setBannerMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');

  // Food Management Modal
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: 299,
    originalPrice: 349,
    categoryId: 'cat_biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    prepTimeMinutes: 20,
    calories: 450,
    spicyLevel: 1,
    tags: 'Popular',
  });

  // Coupon Creation Form Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPercent: 20,
    maxDiscountAmount: 150,
    minOrderAmount: 299,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, ordersRes, foodsRes, catsRes, couponsRes, usersRes] =
        await Promise.all([
          apiClient.get('/admin/stats'),
          apiClient.get('/admin/orders'),
          apiClient.get('/foods'),
          apiClient.get('/categories'),
          apiClient.get('/admin/coupons'),
          apiClient.get('/admin/users'),
        ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (foodsRes.data.success) setFoods(foodsRes.data.data);
      if (catsRes.data.success) setCategories(catsRes.data.data);
      if (couponsRes.data.success) setCoupons(couponsRes.data.data);
      if (usersRes.data.success) setUsersList(usersRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await apiClient.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setBannerMsg({
          success: true,
          text: `Order status transitioned to ${newStatus}`,
        });
      }
    } catch (err) {
      setBannerMsg({ success: false, text: getErrorMessage(err) });
    }
  };

  // Toggle food availability
  const handleToggleAvailability = async (foodId: string) => {
    try {
      const res = await apiClient.patch(`/admin/foods/${foodId}/toggle`);
      if (res.data.success) {
        setFoods((prev) =>
          prev.map((f) =>
            f.id === foodId ? { ...f, isAvailable: !f.isAvailable } : f
          )
        );
      }
    } catch (err) {
      setBannerMsg({ success: false, text: getErrorMessage(err) });
    }
  };

  // Delete food item
  const handleDeleteFood = async (foodId: string) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    try {
      const res = await apiClient.delete(`/admin/foods/${foodId}`);
      if (res.data.success) {
        setFoods((prev) => prev.filter((f) => f.id !== foodId));
        setBannerMsg({ success: true, text: 'Food item deleted successfully' });
      }
    } catch (err) {
      setBannerMsg({ success: false, text: getErrorMessage(err) });
    }
  };

  // Open Add/Edit Food Modal
  const handleOpenFoodModal = (food?: FoodItem) => {
    if (food) {
      setEditingFoodId(food.id);
      setFoodForm({
        name: food.name,
        description: food.description,
        price: food.price,
        originalPrice: food.originalPrice || food.price,
        categoryId: food.categoryId,
        image: food.image,
        isVeg: food.isVeg,
        prepTimeMinutes: food.prepTimeMinutes,
        calories: food.calories || 400,
        spicyLevel: food.spicyLevel,
        tags: food.tags || '',
      });
    } else {
      setEditingFoodId(null);
      setFoodForm({
        name: '',
        description: '',
        price: 299,
        originalPrice: 349,
        categoryId: categories[0]?.id || 'cat_biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        prepTimeMinutes: 20,
        calories: 450,
        spicyLevel: 1,
        tags: 'Special',
      });
    }
    setIsFoodModalOpen(true);
  };

  // Save food
  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFoodId) {
        const res = await apiClient.put(`/admin/foods/${editingFoodId}`, foodForm);
        if (res.data.success) {
          setBannerMsg({ success: true, text: 'Food item updated!' });
          setIsFoodModalOpen(false);
          fetchData();
        }
      } else {
        const res = await apiClient.post('/admin/foods', foodForm);
        if (res.data.success) {
          setBannerMsg({ success: true, text: 'Food item created!' });
          setIsFoodModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      setBannerMsg({ success: false, text: getErrorMessage(err) });
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/coupons', couponForm);
      if (res.data.success) {
        setBannerMsg({ success: true, text: 'New coupon created!' });
        setIsCouponModalOpen(false);
        setCouponForm({ code: '', discountPercent: 20, maxDiscountAmount: 150, minOrderAmount: 299 });
        fetchData();
      }
    } catch (err) {
      setBannerMsg({ success: false, text: getErrorMessage(err) });
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (code: string) => {
    try {
      await apiClient.delete(`/admin/coupons/${code}`);
      setCoupons((prev) => prev.filter((c) => c.code !== code));
      setBannerMsg({ success: true, text: 'Coupon removed' });
    } catch (err) {
      setBannerMsg({ success: false, text: getErrorMessage(err) });
    }
  };

  // Update user role
  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    try {
      const res = await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setBannerMsg({ success: true, text: `Role updated to ${newRole}` });
      }
    } catch (err) {
      setBannerMsg({ success: false, text: getErrorMessage(err) });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-cream-200 rounded-full flex items-center justify-center mx-auto text-3xl">
          🛡️
        </div>
        <h2 className="text-2xl font-black text-stone-900">Admin Authorization Required</h2>
        <p className="text-xs text-stone-500">
          Please log in with administrator credentials to access the CraveKart operational dashboard.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 bg-brand-red text-white text-xs font-bold rounded-full"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-3xl">
          🚫
        </div>
        <h2 className="text-2xl font-black text-stone-900">Access Denied (403)</h2>
        <p className="text-xs text-stone-500">
          Your account does not have administrator privileges. Only verified store operators can access this panel.
        </p>
      </div>
    );
  }

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.deliveryAddress.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-brand-orange-light text-brand-orange flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Central Command
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
            CraveKart Admin Operations
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Logged in as <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-cream-100 p-1.5 rounded-2xl border border-cream-200 gap-1 overflow-x-auto min-w-max">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-smooth ${
              activeTab === 'overview'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-smooth ${
              activeTab === 'orders'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-smooth ${
              activeTab === 'foods'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Menu Items ({foods.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-smooth ${
              activeTab === 'coupons'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-smooth ${
              activeTab === 'users'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Users ({usersList.length})
          </button>
        </div>
      </div>

      {bannerMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in ${
            bannerMsg.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {bannerMsg.success ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{bannerMsg.text}</span>
          </div>
          <button
            onClick={() => setBannerMsg(null)}
            className="text-stone-400 hover:text-stone-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-black">
                ₹
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 block uppercase">
                  Total Gross Revenue
                </span>
                <span className="text-2xl font-black text-stone-900">
                  ₹{stats?.totalRevenue || 0}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-red-light text-brand-red flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 block uppercase">
                  Total Orders Placed
                </span>
                <span className="text-2xl font-black text-stone-900">
                  {stats?.totalOrders || 0}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 block uppercase">
                  Pending Kitchen Orders
                </span>
                <span className="text-2xl font-black text-amber-700">
                  {stats?.pendingOrders || 0}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 block uppercase">
                  Registered Customers
                </span>
                <span className="text-2xl font-black text-stone-900">
                  {stats?.totalCustomers || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <h3 className="font-black text-base text-stone-900">
                Recent Orders Activity
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-brand-red hover:underline"
              >
                View All Orders
              </button>
            </div>

            <div className="divide-y divide-cream-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-stone-400 uppercase font-black tracking-wider pb-2">
                    <th className="py-2">Order ID</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Items</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Method</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 font-semibold text-stone-800">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-cream-50 transition-smooth">
                      <td className="py-3 font-mono font-black">{ord.orderNumber}</td>
                      <td className="py-3">
                        <p className="font-extrabold">{ord.customerName}</p>
                        <p className="text-[10px] text-stone-400">{ord.customerPhone}</p>
                      </td>
                      <td className="py-3">
                        {ord.items.map((i) => `${i.quantity}x ${i.foodName}`).join(', ')}
                      </td>
                      <td className="py-3 font-black text-brand-charcoal">
                        ₹{ord.totalAmount}
                      </td>
                      <td className="py-3">{ord.paymentMethod}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-cream-100 border border-cream-300">
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
            <div>
              <h3 className="font-black text-base text-stone-900">
                Order Fulfillment Queue ({filteredOrders.length})
              </h3>
              <p className="text-xs text-stone-500">
                Update status from Pending ➔ Preparing ➔ Out for Delivery ➔ Delivered
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter by ID, name, phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-cream-50 border border-cream-300 rounded-xl pl-8 pr-3 py-2 text-xs outline-none focus:border-brand-red"
                />
              </div>

              {/* Status filter dropdown */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs font-bold outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PREPARING">Preparing</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl bg-cream-50 border border-cream-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-stone-900">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400">
                      {new Date(ord.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="font-extrabold text-stone-900">
                    {ord.customerName} • {ord.deliveryAddress.phone}
                  </p>

                  <p className="text-stone-500">
                    {ord.deliveryAddress.street}, {ord.deliveryAddress.city}
                  </p>

                  <p className="text-stone-700 font-semibold pt-1">
                    Items:{' '}
                    {ord.items.map((i) => `${i.quantity}x ${i.foodName}`).join(', ')}
                  </p>

                  {ord.deliveryInstructions && (
                    <p className="text-brand-orange text-[11px] font-semibold">
                      Instructions: "{ord.deliveryInstructions}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:self-center">
                  <div>
                    <span className="text-stone-400 text-[10px] block uppercase">
                      Total ({ord.paymentMethod})
                    </span>
                    <span className="text-base font-black text-brand-red">
                      ₹{ord.totalAmount}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block uppercase mb-1">
                      Status Stepper
                    </label>
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                      }
                      className="bg-white border-2 border-brand-red/30 rounded-xl px-3 py-2 text-xs font-black text-stone-900 outline-none focus:border-brand-red cursor-pointer shadow-sm"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PREPARING">PREPARING</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FOODS TAB */}
      {activeTab === 'foods' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-cream-200 pb-4">
            <div>
              <h3 className="font-black text-base text-stone-900">
                Menu Products Catalog ({foods.length})
              </h3>
              <p className="text-xs text-stone-500">
                Add new products, adjust pricing, or toggle kitchen availability.
              </p>
            </div>

            <button
              onClick={() => handleOpenFoodModal()}
              className="px-4 py-2.5 bg-brand-red text-white rounded-xl text-xs font-bold hover:bg-brand-red-dark transition-smooth flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Food Item</span>
            </button>
          </div>

          {/* Food Items Table */}
          <div className="divide-y divide-cream-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 uppercase font-black pb-2">
                  <th className="py-2">Item</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Diet</th>
                  <th className="py-2">Available</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 font-semibold text-stone-800">
                {foods.map((food) => (
                  <tr key={food.id} className="hover:bg-cream-50 transition-smooth">
                    <td className="py-3 flex items-center gap-3">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-10 h-10 rounded-xl object-cover bg-cream-200"
                      />
                      <div>
                        <h4 className="font-extrabold text-stone-900">{food.name}</h4>
                        <span className="text-[10px] text-stone-400">★ {food.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 text-stone-600">{food.categoryName || 'Special'}</td>
                    <td className="py-3 font-black text-brand-charcoal">₹{food.price}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          food.isVeg
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {food.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleAvailability(food.id)}
                        className={`flex items-center gap-1 text-xs font-black ${
                          food.isAvailable ? 'text-emerald-600' : 'text-stone-400'
                        }`}
                      >
                        {food.isAvailable ? (
                          <>
                            <ToggleRight className="w-5 h-5" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenFoodModal(food)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-cream-100 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFood(food.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-cream-200 pb-4">
            <div>
              <h3 className="font-black text-base text-stone-900">
                Discount Coupons Management
              </h3>
              <p className="text-xs text-stone-500">
                Create and manage customer promo vouchers.
              </p>
            </div>

            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2.5 bg-brand-red text-white rounded-xl text-xs font-bold hover:bg-brand-red-dark transition-smooth flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-black text-sm text-stone-900 block">
                    {c.code}
                  </span>
                  <p className="text-xs text-stone-600 font-semibold mt-0.5">
                    {c.discountPercent}% OFF {c.maxDiscountAmount ? `(Up to ₹${c.maxDiscountAmount})` : ''}
                  </p>
                  <p className="text-[10px] text-stone-400">
                    Min Order: ₹{c.minOrderAmount}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteCoupon(c.code)}
                  className="p-2 text-stone-400 hover:text-rose-600 rounded-xl"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <div className="border-b border-cream-200 pb-4">
            <h3 className="font-black text-base text-stone-900">
              User Accounts & Role Permissions ({usersList.length})
            </h3>
            <p className="text-xs text-stone-500">
              Manage registered customers and assign administrator privileges.
            </p>
          </div>

          <div className="divide-y divide-cream-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 uppercase font-black pb-2">
                  <th className="py-2">User</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 font-semibold text-stone-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-cream-50 transition-smooth">
                    <td className="py-3 font-extrabold">{u.name}</td>
                    <td className="py-3 text-stone-500">{u.email}</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          u.role === 'ADMIN'
                            ? 'bg-brand-orange-light text-brand-orange-dark border border-orange-200'
                            : 'bg-cream-100 text-stone-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggleUserRole(u.id, u.role)}
                        className="px-3 py-1 bg-cream-100 hover:bg-stone-900 hover:text-white rounded-lg text-xs font-bold transition-smooth"
                      >
                        Switch to {u.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD/EDIT FOOD MODAL */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-cream-200 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-black text-base text-stone-900">
                {editingFoodId ? 'Edit Food Product' : 'Add New Food Product'}
              </h3>
              <button
                onClick={() => setIsFoodModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: Number(e.target.value) })}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={foodForm.originalPrice}
                    onChange={(e) => setFoodForm({ ...foodForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={foodForm.categoryId}
                    onChange={(e) => setFoodForm({ ...foodForm, categoryId: e.target.value })}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Diet Type</label>
                  <select
                    value={foodForm.isVeg ? 'veg' : 'nonveg'}
                    onChange={(e) => setFoodForm({ ...foodForm, isVeg: e.target.value === 'veg' })}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="nonveg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={foodForm.image}
                  onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={foodForm.prepTimeMinutes}
                    onChange={(e) => setFoodForm({ ...foodForm, prepTimeMinutes: Number(e.target.value) })}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={foodForm.calories}
                    onChange={(e) => setFoodForm({ ...foodForm, calories: Number(e.target.value) })}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tags</label>
                  <input
                    type="text"
                    value={foodForm.tags}
                    onChange={(e) => setFoodForm({ ...foodForm, tags: e.target.value })}
                    placeholder="Bestseller,Special"
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-red text-white rounded-xl font-black text-xs hover:bg-brand-red-dark transition-smooth mt-2"
              >
                {editingFoodId ? 'Save Changes' : 'Create Food Item'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-cream-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-black text-sm text-stone-900">Create New Coupon Code</h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Code (uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE30"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={couponForm.discountPercent}
                    onChange={(e) => setCouponForm({ ...couponForm, discountPercent: Number(e.target.value) })}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={couponForm.maxDiscountAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscountAmount: Number(e.target.value) })}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={couponForm.minOrderAmount}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })}
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-red text-white rounded-xl font-black text-xs hover:bg-brand-red-dark transition-smooth mt-2"
              >
                Save Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
