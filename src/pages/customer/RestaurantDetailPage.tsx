import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  MapPin,
  Share2,
  Heart,
  Zap,
  Store,
  Truck,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import {
  getRestaurant,
  getMenuByRestaurant,
  getMenuCategories,
} from '../../data/mock';
import { useCartStore, useOrdersStore, useUIStore } from '../../store';
import { FoodItemCard } from '../../components/customer/FoodItemCard';
import { CustomizationModal } from '../../components/customer/CustomizationModal';
import { EmptyState } from '../../components/common/EmptyState';
import { formatPrice, cn } from '../../lib/utils';
import type { MenuItem, SelectedCustomization } from '../../types';

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const restaurant = getRestaurant(id || '');

  const {
    items: cartItems,
    addItem,
    updateQuantity,
    getSubtotal,
    fulfillmentType,
    setFulfillmentType,
  } = useCartStore();
  const { toggleFavorite, isFavorite } = useOrdersStore();
  const { addNotification } = useUIStore();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItemForCustomization, setSelectedItemForCustomization] =
    useState<MenuItem | null>(null);
  const [scheduledSlot, setScheduledSlot] = useState<string>('Ready in 10-15 min');

  if (!restaurant) {
    return (
      <div className="container-app py-16">
        <EmptyState
          icon="search"
          title="Restaurant Not Found"
          description="The restaurant you're looking for doesn't exist or is currently unlisted."
          actionLabel="Explore Restaurants"
          actionHref="/explore"
        />
      </div>
    );
  }

  const menu = getMenuByRestaurant(restaurant.id);
  const categories = ['All', ...getMenuCategories(restaurant.id)];

  const filteredMenu = useMemo(() => {
    if (activeCategory === 'All') return menu;
    return menu.filter((item) => item.category === activeCategory);
  }, [menu, activeCategory]);

  const handleAddItem = (item: MenuItem) => {
    if (item.customizations && item.customizations.length > 0) {
      setSelectedItemForCustomization(item);
    } else {
      addItem(item, 1, []);
      addNotification({
        type: 'success',
        title: `Added ${item.name} to cart`,
      });
    }
  };

  const handleCustomizationAdd = (
    item: MenuItem,
    qty: number,
    customs: SelectedCustomization[],
    instructions?: string
  ) => {
    addItem(item, qty, customs, instructions);
    addNotification({
      type: 'success',
      title: `Added ${item.name} (${qty}) to cart`,
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addNotification({
      type: 'info',
      title: 'Link copied to clipboard',
    });
  };

  const favorite = isFavorite(restaurant.id);

  return (
    <div className="min-h-screen pb-12">
      {/* Cover Image & Quick Back */}
      <div className="relative h-60 sm:h-72 lg:h-80 w-full bg-gray-900">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="container-app absolute bottom-6 left-0 right-0 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {restaurant.rating}
              </span>
              <span className="text-xs text-gray-300">
                ({restaurant.reviewCount.toLocaleString()} reviews)
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-xs text-gray-200">
                {restaurant.cuisine.join(', ')}
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-xs text-gray-200">
                {formatPrice(restaurant.priceForTwo)} for two
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {restaurant.address}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(restaurant.id)}
              className={cn(
                'p-2.5 rounded-btn backdrop-blur-md transition-colors',
                favorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              )}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={cn('w-4 h-4', favorite && 'fill-current')} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-btn bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
              aria-label="Share restaurant"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Fulfillment selection & QuickPick banner */}
      <div className="bg-white border-b border-gray-100 sticky top-14 sm:top-16 z-30 shadow-sm">
        <div className="container-app py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-muted uppercase">Ordering for:</span>
            <div className="inline-flex bg-gray-100 rounded-btn p-1">
              <button
                onClick={() => setFulfillmentType('delivery')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  fulfillmentType === 'delivery'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                <Truck className="w-3.5 h-3.5" />
                Delivery ({restaurant.deliveryTime} min)
              </button>

              <button
                onClick={() => setFulfillmentType('pickup')}
                disabled={!restaurant.hasQuickPick}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  fulfillmentType === 'pickup'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : restaurant.hasQuickPick
                    ? 'text-brand-600 hover:text-brand-700'
                    : 'text-gray-400 cursor-not-allowed'
                )}
              >
                <Store className="w-3.5 h-3.5" />
                QuickPick ({restaurant.pickupTime} min)
              </button>
            </div>
          </div>

          {/* QuickPick details banner */}
          {fulfillmentType === 'pickup' && restaurant.hasQuickPick && (
            <div className="flex items-center gap-3 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-btn text-xs text-brand-900">
              <div className="flex items-center gap-1 font-semibold text-brand-700">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Skip the line active
              </div>
              <span className="text-brand-300">|</span>
              <div>
                Pickup at:{' '}
                <span className="font-bold">
                  {restaurant.pickupCounter || 'Counter 1'}
                </span>
              </div>
              <span className="text-brand-300">|</span>
              <select
                value={scheduledSlot}
                onChange={(e) => setScheduledSlot(e.target.value)}
                className="bg-white border border-brand-200 text-brand-800 rounded px-1.5 py-0.5 text-xs font-medium focus:outline-none"
              >
                <option value="Ready in 10-15 min">Immediate: ~{restaurant.pickupTime} min</option>
                <option value="In 30 mins">In 30 mins</option>
                <option value="In 1 hour">In 1 hour</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Categories + Menu Items + Desktop Mini Cart */}
      <div className="container-app pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Categories and Food Items */}
          <div className="lg:col-span-8">
            {/* Sticky Category Tabs */}
            <div className="sticky top-28 sm:top-32 bg-surface/95 backdrop-blur-sm z-20 pb-3 pt-1 border-b border-gray-200 mb-6 flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border',
                    activeCategory === cat
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white text-ink-secondary border-gray-200 hover:border-gray-300'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu List */}
            <div className="card p-4 sm:p-6 divide-y divide-gray-100">
              <div className="flex items-center justify-between pb-3">
                <h2 className="text-lg font-bold text-ink">
                  {activeCategory === 'All' ? 'Full Menu' : activeCategory}
                </h2>
                <span className="text-xs text-ink-muted">
                  {filteredMenu.length} items
                </span>
              </div>

              {filteredMenu.length === 0 ? (
                <div className="py-12 text-center text-ink-muted text-sm">
                  No items in this category.
                </div>
              ) : (
                filteredMenu.map((item) => (
                  <FoodItemCard
                    key={item.id}
                    item={item}
                    onAdd={handleAddItem}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Column: Desktop Sticky Mini Cart */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28">
            <div className="card p-5 border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-600" />
                  <h3 className="font-bold text-ink text-base">Your Cart</h3>
                </div>
                <span className="text-xs bg-gray-100 text-ink px-2 py-0.5 rounded-full font-semibold">
                  {cartItems.length} items
                </span>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-ink-faint">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-ink">Cart is empty</p>
                  <p className="text-xs text-ink-muted mt-1">
                    Add dishes from the menu to build your order.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 pr-1">
                    {cartItems.map((cartItem) => (
                      <div key={cartItem.id} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-ink truncate">
                            {cartItem.menuItem.name}
                          </p>
                          <p className="text-[11px] text-ink-muted">
                            {formatPrice(cartItem.totalPrice)}
                          </p>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 text-xs">
                          <button
                            onClick={() => updateQuantity(cartItem.id, Math.max(0, cartItem.quantity - 1))}
                            className="px-1 text-ink font-bold hover:text-brand-600"
                          >
                            -
                          </button>
                          <span className="px-1.5 font-semibold">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                            className="px-1 text-ink font-bold hover:text-brand-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-ink-secondary">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-ink">{formatPrice(getSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fulfillment</span>
                      <span className="font-medium text-emerald-600">
                        {fulfillmentType === 'pickup' ? 'QuickPick (Free)' : 'Delivery'}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/cart"
                    className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Proceed to Cart</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      <CustomizationModal
        item={selectedItemForCustomization}
        isOpen={Boolean(selectedItemForCustomization)}
        onClose={() => setSelectedItemForCustomization(null)}
        onAddToCart={handleCustomizationAdd}
      />
    </div>
  );
}
