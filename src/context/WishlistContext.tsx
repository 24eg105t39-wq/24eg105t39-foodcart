import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistIds: Set<string>;
  toggleWishlist: (foodId: string) => Promise<boolean>;
  isWishlisted: (foodId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('cravekart_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('cravekart_wishlist', JSON.stringify(Array.from(wishlistIds)));
  }, [wishlistIds]);

  // Sync with backend if logged in
  useEffect(() => {
    if (isAuthenticated) {
      apiClient
        .get('/wishlist')
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.data)) {
            const ids = new Set<string>(res.data.data.map((item: any) => item.id));
            setWishlistIds(ids);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const toggleWishlist = async (foodId: string): Promise<boolean> => {
    const isCurrentlySaved = wishlistIds.has(foodId);
    const updated = new Set(wishlistIds);

    if (isCurrentlySaved) {
      updated.delete(foodId);
    } else {
      updated.add(foodId);
    }
    setWishlistIds(updated);

    if (isAuthenticated) {
      try {
        await apiClient.post('/wishlist/toggle', { foodItemId: foodId });
      } catch {
        // Handled silently
      }
    }

    return !isCurrentlySaved;
  };

  const isWishlisted = (foodId: string) => wishlistIds.has(foodId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlistIds.size,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
