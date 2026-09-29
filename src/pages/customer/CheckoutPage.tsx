import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Store,
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useCartStore, useAuthStore, useOrdersStore, useUIStore } from '../../store';
import { getRestaurant } from '../../data/mock';
import { formatPrice, generateOrderNumber, generateOTP, simulateDelay, cn } from '../../lib/utils';
import type { PaymentMethod, Order } from '../../types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    restaurantId,
    restaurantName,
    fulfillmentType,
    getSubtotal,
    getDeliveryFee,
    getPlatformFee,
    clearCart,
  } = useCartStore();

  const { user } = useAuthStore();
  const { addOrder } = useOrdersStore();
  const { addNotification } = useUIStore();

  const restaurant = getRestaurant(restaurantId || 'r1');

  // Steps: 1: Details -> 2: Payment
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form states
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses[0]?.id || 'a1'
  );
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [pickupSlot, setPickupSlot] = useState('Immediate (~10-15 mins)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('arjun@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const platformFee = getPlatformFee();
  const grandTotal = subtotal + deliveryFee + platformFee;

  if (items.length === 0) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-xl font-bold text-ink mb-2">No items to checkout</h2>
        <p className="text-sm text-ink-muted mb-4">Please add items to your cart first.</p>
        <Link to="/explore" className="btn-primary">
          Explore Food
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await simulateDelay(1200);

    const orderNum = generateOrderNumber();
    const otp = generateOTP();
    const now = new Date();
    const readyMinutes = fulfillmentType === 'pickup' ? 12 : 35;
    const estDate = new Date(now.getTime() + readyMinutes * 60000);
    const estimatedTimeString = estDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      restaurant: restaurant || {
        id: restaurantId || 'r1',
        name: restaurantName || 'Restaurant',
        slug: 'restaurant',
        image: '',
        coverImage: '',
        cuisine: [],
        rating: 4.5,
        reviewCount: 100,
        priceForTwo: 500,
        deliveryTime: 30,
        pickupTime: 10,
        distance: '1.5 km',
        address: 'Koramangala, Bengaluru',
        area: 'Koramangala',
        isOpen: true,
        isVeg: false,
        hasQuickPick: true,
        pickupCounter: 'Counter 2',
        tags: [],
      },
      items: [...items],
      fulfillmentType,
      status: 'placed',
      subtotal,
      deliveryFee,
      platformFee,
      discount: 0,
      total: grandTotal,
      paymentMethod,
      createdAt: now.toISOString(),
      estimatedTime: estimatedTimeString,
      pickupCounter: restaurant?.pickupCounter || 'Counter 2',
      pickupOtp: otp,
      qrCode: `${orderNum}-${otp}`,
      deliveryAddress:
        fulfillmentType === 'delivery'
          ? user?.addresses.find((a) => a.id === selectedAddressId)?.full ||
            'Flat 302, Coral Apartments, Koramangala 4th Block'
          : undefined,
      statusHistory: [
        {
          status: 'placed',
          timestamp: now.toISOString(),
          message:
            fulfillmentType === 'pickup'
              ? 'QuickPick order placed. Sent to outlet kitchen.'
              : 'Delivery order placed successfully.',
        },
      ],
    };

    addOrder(newOrder);
    clearCart();
    setIsProcessing(false);

    addNotification({
      type: 'success',
      title: 'Order Placed Successfully!',
      message: `Order #${orderNum} confirmed`,
    });

    navigate(`/order-confirmation/${newOrder.id}`);
  };

  return (
    <div className="container-app py-8 max-w-4xl">
      {/* Header & Stepper */}
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-ink mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
        <h1 className="text-2xl font-bold text-ink">Checkout</h1>

        {/* Stepper bar */}
        <div className="flex items-center gap-2 mt-4 text-xs font-semibold">
          <button
            onClick={() => setCurrentStep(1)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors',
              currentStep === 1
                ? 'bg-brand-500 text-white'
                : 'bg-emerald-50 text-emerald-700'
            )}
          >
            <span>1</span>
            <span>{fulfillmentType === 'pickup' ? 'Pickup Details' : 'Delivery Address'}</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => setCurrentStep(2)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors',
              currentStep === 2
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-ink-muted'
            )}
          >
            <span>2</span>
            <span>Payment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Step Content */}
        <div className="md:col-span-7 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              {fulfillmentType === 'pickup' ? (
                /* QuickPick Pickup Details */
                <div className="card p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <Store className="w-5 h-5 text-brand-600" />
                    <div>
                      <h2 className="text-base font-bold text-ink">QuickPick Collection Point</h2>
                      <p className="text-xs text-ink-muted">Skip the line and collect directly</p>
                    </div>
                  </div>

                  <div className="bg-brand-50 border border-brand-200 rounded-btn p-3.5">
                    <p className="text-xs uppercase font-bold text-brand-700">Pickup Counter</p>
                    <p className="text-base font-bold text-ink mt-0.5">
                      {restaurant?.pickupCounter || 'Counter 2'} — {restaurant?.name}
                    </p>
                    <p className="text-xs text-ink-muted mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      {restaurant?.address}
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-btn text-xs text-emerald-800">
                    <p className="font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      No delivery charge for QuickPick pickup orders!
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Pickup Time Slot
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="input-field text-xs"
                    >
                      <option value="Immediate (~10-15 mins)">Immediate (~10-15 mins)</option>
                      <option value="In 30 minutes">In 30 minutes</option>
                      <option value="In 45 minutes">In 45 minutes</option>
                      <option value="In 1 hour">In 1 hour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Contact Phone (for pickup SMS & OTP)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Delivery Address Selection */
                <div className="card p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <MapPin className="w-5 h-5 text-brand-600" />
                    <div>
                      <h2 className="text-base font-bold text-ink">Select Delivery Address</h2>
                      <p className="text-xs text-ink-muted">Estimated delivery in {restaurant?.deliveryTime || 30} mins</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {user?.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={cn(
                          'p-3.5 border rounded-btn cursor-pointer transition-all',
                          selectedAddressId === addr.id
                            ? 'border-brand-500 bg-brand-50/30 ring-1 ring-brand-500'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase text-ink">{addr.label}</span>
                          {selectedAddressId === addr.id && (
                            <CheckCircle2 className="w-4 h-4 text-brand-600" />
                          )}
                        </div>
                        <p className="text-xs text-ink-secondary mt-1">{addr.full}</p>
                        <p className="text-[11px] text-ink-muted mt-0.5">{addr.city} - {addr.pincode}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Delivery Instructions
                    </label>
                    <input
                      type="text"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="e.g. Leave with security, do not ring doorbell..."
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            /* Payment Selection */
            <div className="card p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  <div>
                    <h2 className="text-base font-bold text-ink">Payment Method</h2>
                    <p className="text-xs text-ink-muted">Choose your preferred payment mode</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-brand-600 font-medium hover:underline"
                >
                  Edit details
                </button>
              </div>

              {/* Payment Options */}
              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={cn(
                    'p-3.5 border rounded-btn cursor-pointer transition-all',
                    paymentMethod === 'upi'
                      ? 'border-brand-500 bg-brand-50/20 ring-1 ring-brand-500'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-brand-600" />
                      <span className="text-sm font-semibold text-ink">UPI / QR (Instant)</span>
                    </div>
                    {paymentMethod === 'upi' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <label className="block text-[11px] font-medium text-ink-muted mb-1">
                        UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={cn(
                    'p-3.5 border rounded-btn cursor-pointer transition-all',
                    paymentMethod === 'card'
                      ? 'border-brand-500 bg-brand-50/20 ring-1 ring-brand-500'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-ink">Credit / Debit Card</span>
                    </div>
                    {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 text-xs">
                      <input
                        type="text"
                        placeholder="Card Number: 4532 •••• •••• 8912"
                        className="input-field text-xs"
                        defaultValue="4532 8921 7842 8912"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="input-field text-xs"
                          defaultValue="08/28"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          className="input-field text-xs"
                          defaultValue="789"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Wallet Option */}
                <div
                  onClick={() => setPaymentMethod('wallet')}
                  className={cn(
                    'p-3.5 border rounded-btn cursor-pointer transition-all',
                    paymentMethod === 'wallet'
                      ? 'border-brand-500 bg-brand-50/20 ring-1 ring-brand-500'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-sm font-semibold text-ink">FoodCart Wallet</span>
                        <p className="text-[11px] text-emerald-600 font-medium">Balance: ₹1,500</p>
                      </div>
                    </div>
                    {paymentMethod === 'wallet' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </div>
                </div>

                {/* Cash on Delivery / Pay at Pickup */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={cn(
                    'p-3.5 border rounded-btn cursor-pointer transition-all',
                    paymentMethod === 'cod'
                      ? 'border-brand-500 bg-brand-50/20 ring-1 ring-brand-500'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Banknote className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-ink">
                        {fulfillmentType === 'pickup' ? 'Pay at Counter' : 'Cash on Delivery'}
                      </span>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="btn-primary w-full py-3 text-base font-bold flex items-center justify-center gap-2 mt-6 shadow-md"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Pay {formatPrice(grandTotal)} & Confirm</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-ink-muted">
                100% Secure Checkout powered by FoodCart Pay.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Order Review Summary */}
        <div className="md:col-span-5 card p-5 space-y-4 sticky top-20">
          <h3 className="text-sm font-bold text-ink pb-2 border-b border-gray-100 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-xs font-semibold text-brand-600 uppercase">
              {fulfillmentType === 'pickup' ? 'QuickPick' : 'Delivery'}
            </span>
          </h3>

          <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 text-xs">
            {items.map((i) => (
              <div key={i.id} className="py-2 flex justify-between gap-2">
                <span className="text-ink-secondary truncate">
                  {i.quantity}x {i.menuItem.name}
                </span>
                <span className="font-semibold text-ink flex-shrink-0">
                  {formatPrice(i.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-ink-secondary">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-medium text-emerald-600">
                {fulfillmentType === 'pickup' ? '₹0 (QuickPick)' : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span className="font-medium text-ink">{formatPrice(platformFee)}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="font-bold text-sm text-ink">Total Payable</span>
            <span className="font-bold text-lg text-ink">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
