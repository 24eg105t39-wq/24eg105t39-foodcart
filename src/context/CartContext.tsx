import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { getErrorMessage } from '../services/api';
import { FoodItem, CartItem, Coupon } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (food: FoodItem, quantity?: number) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  appliedCoupon: { code: string; discountPercent: number; discountAmount: number } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cravekart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('cravekart_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('cravekart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('cravekart_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('cravekart_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (food: FoodItem, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { food, quantity }];
    });
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.food.id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (foodId: string) => {
    setCartItems((prev) => prev.filter((item) => item.food.id !== foodId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('cravekart_cart');
    localStorage.removeItem('cravekart_coupon');
  };

  // Calculations
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = Math.round(
    cartItems.reduce((sum, item) => sum + item.food.price * item.quantity, 0) * 100
  ) / 100;

  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 40;

  // Coupon discount
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    discountAmount = Math.round(
      Math.min(appliedCoupon.discountAmount, subtotal) * 100
    ) / 100;
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.05 * 100) / 100; // 5% GST
  const totalAmount = Math.round(
    (taxableAmount + deliveryFee + taxAmount) * 100
  ) / 100;

  const applyCoupon = async (code: string) => {
    try {
      const res = await apiClient.post('/coupons/validate', {
        code: code.trim(),
        subtotal,
      });
      if (res.data.success) {
        setAppliedCoupon({
          code: res.data.data.code,
          discountPercent: res.data.data.discountPercent,
          discountAmount: res.data.data.discountAmount,
        });
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Coupon invalid' };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemCount,
        subtotal,
        deliveryFee,
        taxAmount,
        discountAmount,
        totalAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
