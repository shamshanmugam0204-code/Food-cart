import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem, SelectedCustomization, FulfillmentType, Location, Notification, User, Order } from '../types';
import { sampleUser, sampleOrders, locations, restaurants } from '../data/mock';

// ─── Cart Store ──────────────────────────────────────
interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  fulfillmentType: FulfillmentType;
  setFulfillmentType: (type: FulfillmentType) => void;
  addItem: (menuItem: MenuItem, quantity: number, customizations: SelectedCustomization[], specialInstructions?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getPlatformFee: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,
      fulfillmentType: 'delivery',

      setFulfillmentType: (type) => set({ fulfillmentType: type }),

      addItem: (menuItem, quantity, customizations, specialInstructions) => {
        const state = get();
        if (state.restaurantId && state.restaurantId !== menuItem.restaurantId) {
          // Different restaurant - clear cart first
          set({ items: [], restaurantId: null, restaurantName: null });
        }

        const customizationPrice = customizations.reduce((sum, c) => sum + c.price, 0);
        const totalPrice = (menuItem.price + customizationPrice) * quantity;
        const id = `${menuItem.id}-${Date.now()}`;

        const newItem: CartItem = {
          id,
          menuItem,
          quantity,
          customizations,
          specialInstructions,
          totalPrice,
        };

        // Find restaurant name from the menuItem's restaurantId
        const restaurant = restaurants.find((r) => r.id === menuItem.restaurantId);

        set((state) => ({
          items: [...state.items, newItem],
          restaurantId: menuItem.restaurantId,
          restaurantName: restaurant?.name || state.restaurantName,
        }));
      },

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          return {
            items: newItems,
            restaurantId: newItems.length === 0 ? null : state.restaurantId,
            restaurantName: newItems.length === 0 ? null : state.restaurantName,
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const customizationPrice = item.customizations.reduce((sum, c) => sum + c.price, 0);
              return {
                ...item,
                quantity,
                totalPrice: (item.menuItem.price + customizationPrice) * quantity,
              };
            }
            return item;
          }),
        })),

      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

      getSubtotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
      getDeliveryFee: () => (get().fulfillmentType === 'pickup' ? 0 : get().getSubtotal() > 499 ? 0 : 35),
      getPlatformFee: () => 10,
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'foodcart-cart' }
  )
);

// ─── UI Store ────────────────────────────────────────
interface UIState {
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isFilterDrawerOpen: boolean;
  isLocationSelectorOpen: boolean;
  activeModal: string | null;
  notifications: Notification[];
  setMobileMenu: (open: boolean) => void;
  setCartDrawer: (open: boolean) => void;
  setFilterDrawer: (open: boolean) => void;
  setLocationSelector: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  isFilterDrawerOpen: false,
  isLocationSelectorOpen: false,
  activeModal: null,
  notifications: [],

  setMobileMenu: (open) => set({ isMobileMenuOpen: open }),
  setCartDrawer: (open) => set({ isCartDrawerOpen: open }),
  setFilterDrawer: (open) => set({ isFilterDrawerOpen: open }),
  setLocationSelector: (open) => set({ isLocationSelectorOpen: open }),
  setActiveModal: (modal) => set({ activeModal: modal }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: `notif-${Date.now()}` },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

// ─── Auth Store ──────────────────────────────────────
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role?: 'customer' | 'partner' | 'admin') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (role = 'customer') => {
        const user = { ...sampleUser, role };
        set({ user, isAuthenticated: true });
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'foodcart-auth' }
  )
);

// ─── Location Store ──────────────────────────────────
interface LocationState {
  selectedLocation: Location;
  setLocation: (location: Location) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedLocation: locations[0],
      setLocation: (location) => set({ selectedLocation: location }),
    }),
    { name: 'foodcart-location' }
  )
);

// ─── Orders Store ────────────────────────────────────
interface OrdersState {
  orders: Order[];
  favorites: string[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: sampleOrders,
      favorites: ['r1', 'r4'],

      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        })),

      toggleFavorite: (restaurantId) =>
        set((state) => ({
          favorites: state.favorites.includes(restaurantId)
            ? state.favorites.filter((id) => id !== restaurantId)
            : [...state.favorites, restaurantId],
        })),

      isFavorite: (restaurantId) => get().favorites.includes(restaurantId),
    }),
    { name: 'foodcart-orders' }
  )
);
