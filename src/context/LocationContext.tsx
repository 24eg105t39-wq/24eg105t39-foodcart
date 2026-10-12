import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Restaurant, UserLocation } from '../types';
import apiClient from '../services/api';

export interface LocationPreset {
  id: string;
  name: string;
  area: string;
  latitude: number;
  longitude: number;
}

export const LOCATION_PRESETS: LocationPreset[] = [
  { id: 'indiranagar', name: 'Indiranagar', area: '100ft Road, Indiranagar', latitude: 12.9784, longitude: 77.6408 },
  { id: 'koramangala', name: 'Koramangala', area: '5th Block, Koramangala', latitude: 12.9352, longitude: 77.6245 },
  { id: 'hsr', name: 'HSR Layout', area: 'Sector 4, HSR Layout', latitude: 12.9121, longitude: 77.6446 },
  { id: 'mgroad', name: 'MG Road / CBD', area: 'Lavelle Road, MG Road', latitude: 12.9756, longitude: 77.6066 },
  { id: 'jayanagar', name: 'Jayanagar', area: '3rd Block, Jayanagar', latitude: 12.9308, longitude: 77.5838 },
  { id: 'whitefield', name: 'Whitefield', area: 'ITPL Main Rd, Whitefield', latitude: 12.9698, longitude: 77.7499 },
];

// Fallback seed restaurants with realistic GPS coordinates
const DEFAULT_FALLBACK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest_01',
    name: 'Royal Biryani Darbar',
    slug: 'royal-biryani-darbar',
    description: 'Authentic Nawabi dum biryanis, kebabs, and aromatic Mughal gravies.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewsCount: 1420,
    cuisines: ['Biryani', 'Mughlai', 'North Indian'],
    address: '100ft Road, Indiranagar, Bengaluru',
    latitude: 12.9784,
    longitude: 77.6408,
    deliveryTimeMinutes: 25,
    deliveryFee: 30,
    minOrder: 199,
    isPureVeg: false,
    isOpen: true,
  },
  {
    id: 'rest_02',
    name: 'The Burger Loft & Co.',
    slug: 'the-burger-loft',
    description: 'Gourmet smashed beef & crispy chicken burgers, brioche buns and truffle fries.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewsCount: 980,
    cuisines: ['Burgers', 'Fast Food', 'Beverages'],
    address: '5th Block, Koramangala, Bengaluru',
    latitude: 12.9352,
    longitude: 77.6245,
    deliveryTimeMinutes: 20,
    deliveryFee: 25,
    minOrder: 149,
    isPureVeg: false,
    isOpen: true,
  },
  {
    id: 'rest_03',
    name: 'Little Napoli Trattoria',
    slug: 'little-napoli-trattoria',
    description: 'Neapolitan sourdough pizzas baked in firewood oven, pastas & gelato.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewsCount: 1150,
    cuisines: ['Italian', 'Pizzas', 'Pastas'],
    address: '12th Main, Indiranagar, Bengaluru',
    latitude: 12.9719,
    longitude: 77.6412,
    deliveryTimeMinutes: 30,
    deliveryFee: 40,
    minOrder: 249,
    isPureVeg: false,
    isOpen: true,
  },
  {
    id: 'rest_04',
    name: 'Zen Garden Wok & Bowls',
    slug: 'zen-garden-wok',
    description: 'Pan-Asian wok noodles, dim sums, Thai green curry and sushi bowls.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewsCount: 640,
    cuisines: ['Asian', 'Chinese', 'Thai'],
    address: 'Sector 4, HSR Layout, Bengaluru',
    latitude: 12.9121,
    longitude: 77.6446,
    deliveryTimeMinutes: 35,
    deliveryFee: 35,
    minOrder: 199,
    isPureVeg: false,
    isOpen: true,
  },
  {
    id: 'rest_05',
    name: 'Green Harvest Kitchen',
    slug: 'green-harvest-kitchen',
    description: '100% Pure vegetarian organic grain bowls, fresh salads and detox cold juices.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewsCount: 820,
    cuisines: ['Healthy', 'Salads', 'Pure Veg'],
    address: 'Lavelle Road, MG Road, Bengaluru',
    latitude: 12.9756,
    longitude: 77.6066,
    deliveryTimeMinutes: 25,
    deliveryFee: 20,
    minOrder: 150,
    isPureVeg: true,
    isOpen: true,
  },
  {
    id: 'rest_06',
    name: 'Chaat Chatore & Sweet Boutique',
    slug: 'chaat-chatore',
    description: 'Famous Old Delhi style chaats, pav bhaji, samosas, chole bhature and rasmalai.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewsCount: 1650,
    cuisines: ['Street Food', 'Desserts', 'Pure Veg'],
    address: '3rd Block, Jayanagar, Bengaluru',
    latitude: 12.9308,
    longitude: 77.5838,
    deliveryTimeMinutes: 20,
    deliveryFee: 25,
    minOrder: 99,
    isPureVeg: true,
    isOpen: true,
  },
];

function calcHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

interface LocationContextType {
  location: UserLocation;
  isDetecting: boolean;
  locationError: string | null;
  requestLiveGpsLocation: () => Promise<boolean>;
  selectLocationPreset: (preset: LocationPreset) => void;
  nearbyRestaurants: Restaurant[];
  loadingRestaurants: boolean;
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation>(() => {
    const saved = localStorage.getItem('cravekart_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // default fallback
      }
    }
    return {
      latitude: 12.9784,
      longitude: 77.6408,
      label: 'Indiranagar, Bengaluru',
      isLiveGps: false,
    };
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Fetch restaurants from backend with coordinates
  const fetchRestaurants = useCallback(async (lat: number, lng: number) => {
    setLoadingRestaurants(true);
    try {
      const res = await apiClient.get('/restaurants', {
        params: { latitude: lat, longitude: lng },
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setNearbyRestaurants(res.data.data);
      } else {
        throw new Error('Unexpected format');
      }
    } catch {
      // Fallback calculation using Haversine formula on client
      const calculated = DEFAULT_FALLBACK_RESTAURANTS.map((r) => {
        const distanceKm = calcHaversine(lat, lng, r.latitude, r.longitude);
        const dynamicDeliveryTime = Math.max(15, Math.min(60, Math.round(15 + distanceKm * 4)));
        return {
          ...r,
          distanceKm,
          deliveryTimeMinutes: dynamicDeliveryTime,
        };
      }).sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
      setNearbyRestaurants(calculated);
    } finally {
      setLoadingRestaurants(false);
    }
  }, []);

  // Request live GPS via browser Geolocation API
  const requestLiveGpsLocation = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return false;
    }

    setIsDetecting(true);
    setLocationError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Approximate area based on nearest preset
          let closestPreset = LOCATION_PRESETS[0];
          let minD = 9999;
          LOCATION_PRESETS.forEach((p) => {
            const d = calcHaversine(latitude, longitude, p.latitude, p.longitude);
            if (d < minD) {
              minD = d;
              closestPreset = p;
            }
          });

          const label = minD < 3 ? `📍 Near ${closestPreset.name}` : `📍 Live GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

          const newLoc: UserLocation = {
            latitude,
            longitude,
            label,
            isLiveGps: true,
          };

          setLocation(newLoc);
          localStorage.setItem('cravekart_location', JSON.stringify(newLoc));
          setIsDetecting(false);
          fetchRestaurants(latitude, longitude);
          resolve(true);
        },
        (err) => {
          setIsDetecting(false);
          let msg = 'Unable to retrieve location.';
          if (err.code === 1) msg = 'Location access was denied. Please allow permissions or select an area below.';
          else if (err.code === 2) msg = 'Location position is unavailable. Please choose an area below.';
          else if (err.code === 3) msg = 'Location request timed out. Please choose an area below.';
          setLocationError(msg);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, [fetchRestaurants]);

  // Select a preset location
  const selectLocationPreset = useCallback(
    (preset: LocationPreset) => {
      const newLoc: UserLocation = {
        latitude: preset.latitude,
        longitude: preset.longitude,
        label: preset.name,
        isLiveGps: false,
      };
      setLocation(newLoc);
      localStorage.setItem('cravekart_location', JSON.stringify(newLoc));
      setLocationError(null);
      setIsLocationModalOpen(false);
      fetchRestaurants(preset.latitude, preset.longitude);
    },
    [fetchRestaurants]
  );

  useEffect(() => {
    fetchRestaurants(location.latitude, location.longitude);
  }, [fetchRestaurants, location.latitude, location.longitude]);

  return (
    <LocationContext.Provider
      value={{
        location,
        isDetecting,
        locationError,
        requestLiveGpsLocation,
        selectLocationPreset,
        nearbyRestaurants,
        loadingRestaurants,
        selectedRestaurantId,
        setSelectedRestaurantId,
        isLocationModalOpen,
        setIsLocationModalOpen,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
