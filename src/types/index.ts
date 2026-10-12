export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  addresses?: Address[];
  totalOrders?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  itemCount?: number;
}

export interface Review {
  id: string;
  foodItemId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  categoryId: string;
  categoryName?: string;
  restaurantId?: string;
  restaurantName?: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  rating: number;
  reviewsCount: number;
  prepTimeMinutes: number;
  calories?: number | null;
  spicyLevel: number;
  tags?: string | null;
  reviews?: Review[];
  related?: FoodItem[];
  isWishlisted?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  bannerImage: string;
  rating: number;
  reviewsCount: number;
  cuisines: string[];
  address: string;
  latitude: number;
  longitude: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  minOrder: number;
  isPureVeg: boolean;
  isOpen: boolean;
  distanceKm?: number;
  menu?: FoodItem[];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  label: string;
  isLiveGps: boolean;
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
}

export interface Address {
  id: string;
  userId?: string;
  label: string;
  recipientName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscountAmount?: number | null;
  minOrderAmount: number;
  isActive: boolean;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  foodItemId: string;
  foodName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: {
    recipientName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  items: OrderItem[];
  subtotalAmount: number;
  deliveryFee: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: 'COD' | 'ONLINE';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  transactionId?: string;
  deliveryInstructions?: string;
  estimatedDeliveryMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingStep {
  key: string;
  label: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface TrackingData {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  estimatedDeliveryMinutes: number;
  deliveryPartner: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
  steps: TrackingStep[];
  order: Order;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalFoodItems: number;
  recentOrders: Order[];
}
