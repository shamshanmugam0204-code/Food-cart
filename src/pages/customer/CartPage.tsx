import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Tag,
  ArrowRight,
  Store,
  Truck,
  CheckCircle,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { useCartStore, useUIStore } from '../../store';
import { coupons } from '../../data/mock';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { formatPrice, cn } from '../../lib/utils';
import type { Coupon } from '../../types';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    restaurantName,
    restaurantId,
    fulfillmentType,
    setFulfillmentType,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getPlatformFee,
  } = useCartStore();

  const { addNotification } = useUIStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [pendingType, setPendingType] = useState<'delivery' | 'pickup' | null>(null);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const platformFee = getPlatformFee();

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      discountAmount = appliedCoupon.discountValue;
    } else {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee - discountAmount);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError('');

    const found = coupons.find((c) => c.code === code);
    if (!found) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (subtotal < found.minOrder) {
      setCouponError(`Min order of ${formatPrice(found.minOrder)} required for ${found.code}`);
      return;
    }

    setAppliedCoupon(found);
    setCouponCode(found.code);
    addNotification({
      type: 'success',
      title: `Coupon ${found.code} applied!`,
      message: `You saved ${formatPrice(
        found.discountType === 'flat'
          ? found.discountValue
          : Math.min((subtotal * found.discountValue) / 100, found.maxDiscount || 9999)
      )}`,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleFulfillmentToggle = (newType: 'delivery' | 'pickup') => {
    if (newType === fulfillmentType) return;
    setPendingType(newType);
    setShowSwitchDialog(true);
  };

  const confirmSwitch = () => {
    if (pendingType) {
      setFulfillmentType(pendingType);
      addNotification({
        type: 'info',
        title: `Switched to ${pendingType === 'pickup' ? 'QuickPick (Pickup)' : 'Home Delivery'}`,
      });
    }
    setShowSwitchDialog(false);
    setPendingType(null);
  };

  if (items.length === 0) {
    return (
      <div className="container-app py-16">
        <EmptyState
          icon="cart"
          title="Your Cart is Empty"
          description="Looks like you haven't added any dishes to your cart yet. Explore delicious options near you!"
          actionLabel="Explore Restaurants"
          actionHref="/explore"
        />
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Shopping Cart</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Ordering from <span className="font-semibold text-ink">{restaurantName || 'Restaurant'}</span>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items & Fulfillment Choice */}
        <div className="lg:col-span-8 space-y-6">
          {/* Fulfillment Mode Switcher Card */}
          <div className="card p-4 sm:p-5 border-brand-100 bg-brand-50/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-ink">Choose Fulfillment Mode</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  {fulfillmentType === 'pickup'
                    ? 'QuickPick: Pick up at counter without queue. Delivery fee is ₹0!'
                    : 'Standard Delivery directly to your doorstep.'}
                </p>
              </div>

              <div className="inline-flex bg-white border border-gray-200 rounded-btn p-1 shadow-sm flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleFulfillmentToggle('delivery')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                    fulfillmentType === 'delivery'
                      ? 'bg-ink text-white shadow-sm'
                      : 'text-ink-secondary hover:text-ink'
                  )}
                >
                  <Truck className="w-3.5 h-3.5" />
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => handleFulfillmentToggle('pickup')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                    fulfillmentType === 'pickup'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-brand-600 hover:text-brand-700'
                  )}
                >
                  <Store className="w-3.5 h-3.5" />
                  QuickPick (₹0 Fee)
                </button>
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="card p-4 sm:p-6 divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={
                            item.menuItem.isVeg ? 'veg-indicator' : 'nonveg-indicator'
                          }
                        />
                        <h4 className="font-semibold text-sm text-ink">{item.menuItem.name}</h4>
                      </div>
                      <p className="text-xs font-semibold text-brand-600 mt-0.5">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Customizations summary */}
                  {item.customizations.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-ink-muted">
                      {item.customizations.map((c) => (
                        <span key={c.optionId} className="bg-gray-100 px-1.5 py-0.5 rounded">
                          {c.optionName} {c.price > 0 ? `(+${formatPrice(c.price)})` : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.specialInstructions && (
                    <p className="text-[11px] text-amber-700 mt-1 italic">
                      Note: "{item.specialInstructions}"
                    </p>
                  )}

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-btn bg-gray-50 text-xs shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 text-ink font-bold hover:text-brand-600"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2 font-semibold text-ink">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-ink font-bold hover:text-brand-600"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add more items link */}
            <div className="pt-4 mt-2">
              <Link
                to={restaurantId ? `/restaurant/${restaurantId}` : '/explore'}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add more items from {restaurantName || 'menu'}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Coupons & Bill Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-ink">Offers & Coupons</h3>
            </div>

            {appliedCoupon ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-btn p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {appliedCoupon.code} Applied
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {appliedCoupon.description}
                  </p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Enter Coupon Code"
                    className="input-field text-xs uppercase font-medium py-2 flex-1"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={!couponCode.trim()}
                    className="btn-secondary text-xs px-3 py-2 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" /> {couponError}
                  </p>
                )}

                {/* Available Coupons suggestion */}
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  <p className="text-[11px] font-semibold text-ink-muted uppercase">
                    Available Offers
                  </p>
                  {coupons.slice(0, 2).map((c) => (
                    <div
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      className="p-2 border border-dashed border-gray-200 rounded-btn hover:border-brand-400 hover:bg-brand-50/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-600">{c.code}</span>
                        <span className="text-[10px] text-brand-700 font-semibold uppercase">
                          Apply
                        </span>
                      </div>
                      <p className="text-[10px] text-ink-muted mt-0.5">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink mb-4 pb-2 border-b border-gray-100">
              Bill Details
            </h3>

            <div className="space-y-2 text-xs text-ink-secondary">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery Fee</span>
                {fulfillmentType === 'pickup' ? (
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    FREE (QuickPick)
                  </span>
                ) : deliveryFee === 0 ? (
                  <span className="font-semibold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-medium text-ink">{formatPrice(deliveryFee)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-medium text-ink">{formatPrice(platformFee)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-ink-muted">To Pay</p>
                <p className="text-lg font-bold text-ink">{formatPrice(grandTotal)}</p>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {fulfillmentType === 'pickup' && (
              <div className="mt-3 bg-amber-50 border border-amber-200 p-2.5 rounded-btn text-[11px] text-amber-800 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>You save delivery fee with QuickPick! Show QR code to pick up.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Switch Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showSwitchDialog}
        title="Switch Order Type?"
        message={`Do you want to switch your order to ${
          pendingType === 'pickup' ? 'QuickPick (Pickup at Counter)' : 'Home Delivery'
        }?`}
        confirmLabel="Yes, Switch"
        onConfirm={confirmSwitch}
        onCancel={() => {
          setShowSwitchDialog(false);
          setPendingType(null);
        }}
      />
    </div>
  );
}
