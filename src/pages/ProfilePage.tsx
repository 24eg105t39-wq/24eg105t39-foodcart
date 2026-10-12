import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient, { getErrorMessage } from '../services/api';
import { Address } from '../types';
import {
  User as UserIcon,
  MapPin,
  Plus,
  Trash2,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal, refreshUser } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  // New Address form
  const [label, setLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [postalCode, setPostalCode] = useState('560038');

  const fetchAddresses = () => {
    if (isAuthenticated) {
      apiClient
        .get('/addresses')
        .then((res) => {
          if (res.data.success) {
            setAddresses(res.data.data);
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [isAuthenticated]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await apiClient.post('/addresses', {
        label,
        recipientName,
        phone,
        street,
        city,
        state,
        postalCode,
        isDefault: addresses.length === 0,
      });

      if (res.data.success) {
        setMsg({ success: true, text: 'Address saved to address book!' });
        setIsAddingAddress(false);
        setStreet('');
        fetchAddresses();
      }
    } catch (err) {
      setMsg({ success: false, text: getErrorMessage(err) });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await apiClient.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-cream-200 rounded-full flex items-center justify-center mx-auto text-3xl">
          👤
        </div>
        <h2 className="text-2xl font-black text-stone-900">Sign in to view profile</h2>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 bg-brand-red text-white text-xs font-bold rounded-full"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
          Profile & Address Book
        </h1>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            msg.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {msg.success ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* User Information Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-cream-300"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-stone-900">{user.name}</h2>
              {user.role === 'ADMIN' && (
                <span className="text-[10px] font-black text-brand-orange bg-brand-orange-light px-2.5 py-0.5 rounded-full border border-orange-200">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </p>
            {user.phone && (
              <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{user.phone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="bg-cream-100 px-4 py-3 rounded-2xl border border-cream-200 text-center sm:text-right">
          <span className="text-[10px] font-bold text-stone-400 block uppercase">
            Total Orders
          </span>
          <span className="text-xl font-black text-brand-red">
            {user.totalOrders || 0}
          </span>
        </div>
      </div>

      {/* Address Book Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-cream-200 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-red" />
            <h3 className="font-black text-base text-stone-900">
              Saved Delivery Addresses ({addresses.length})
            </h3>
          </div>

          <button
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="px-4 py-2 bg-cream-100 hover:bg-brand-red hover:text-white text-stone-800 text-xs font-bold rounded-xl border border-cream-300 transition-smooth flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingAddress ? 'Cancel' : 'Add New Address'}</span>
          </button>
        </div>

        {/* Add Address Form */}
        {isAddingAddress && (
          <form onSubmit={handleCreateAddress} className="p-5 bg-cream-50 rounded-2xl border border-cream-300 space-y-4 animate-in fade-in">
            <h4 className="text-xs font-bold text-stone-800 uppercase">New Address Details</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Tag / Label</label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work / Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Street Address</label>
              <input
                type="text"
                required
                placeholder="Door / Flat / Street address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
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
                  className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">PIN Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-brand-red-dark transition-smooth"
            >
              Save Address
            </button>
          </form>
        )}

        {/* Existing Addresses List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-2xl bg-cream-50 border border-cream-200 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-stone-900 bg-white px-2.5 py-0.5 rounded-lg border border-cream-300">
                    {a.label}
                  </span>
                  <button
                    onClick={() => handleDeleteAddress(a.id)}
                    className="text-stone-400 hover:text-rose-600 transition-smooth p-1"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-extrabold text-stone-800">{a.recipientName}</h4>
                <p className="text-xs text-stone-600 mt-0.5">{a.street}</p>
                <p className="text-xs text-stone-600">
                  {a.city}, {a.state} - {a.postalCode}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">Phone: {a.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
