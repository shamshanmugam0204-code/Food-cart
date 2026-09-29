export type FulfillmentType = 'delivery' | 'pickup';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'upi' | 'card' | 'cod' | 'wallet';

export interface Location {
  id: string;
  area: string;
  city: string;
  full: string;
  pincode: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  image: string;
  coverImage: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  priceForTwo: number;
  deliveryTime: number;
  pickupTime: number;
  distance: string;
  address: string;
  area: string;
  isOpen: boolean;
  isVeg: boolean;
  hasQuickPick: boolean;
  pickupCounter?: string;
  offer?: string;
  tags: string[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  rating?: number;
  ratingCount?: number;
  prepTime: number;
  isAvailable: boolean;
  isBestseller?: boolean;
  customizations?: CustomizationGroup[];
}

export interface CustomizationGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect: number;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: SelectedCustomization[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface SelectedCustomization {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurant: Restaurant;
  items: CartItem[];
  fulfillmentType: FulfillmentType;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  estimatedTime: string;
  deliveryAddress?: string;
  pickupCounter?: string;
  pickupOtp?: string;
  qrCode?: string;
  statusHistory: StatusUpdate[];
}

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: string;
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'partner' | 'admin';
  addresses: Address[];
}

export interface Address {
  id: string;
  label: string;
  full: string;
  area: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
}

export interface DashboardMetrics {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  avgPrepTime: number;
  ordersChange: number;
  revenueChange: number;
}

export interface AnalyticsData {
  date: string;
  orders: number;
  revenue: number;
  delivery: number;
  pickup: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
  joinedDate: string;
  orders: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
