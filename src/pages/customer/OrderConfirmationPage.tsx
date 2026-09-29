import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Home, Clock, Store, MapPin } from 'lucide-react';
import { useOrdersStore } from '../../store';
import { QRCodeCard } from '../../components/customer/QRCodeCard';
import { formatPrice } from '../../lib/utils';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useOrdersStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-xl font-bold text-ink">Order Not Found</h2>
        <Link to="/" className="btn-primary mt-4">
          Back to Home
        </Link>
      </div>
    );
  }

  const isQuickPick = order.fulfillmentType === 'pickup';

  return (
    <div className="container-app py-10 max-w-2xl">
      {/* Success banner */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          Your order is confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          {isQuickPick
            ? 'Your QuickPick order has been received by the kitchen.'
            : 'The restaurant is preparing your food for delivery.'}
        </p>
      </div>

      {/* Main Order Card */}
      <div className="space-y-6">
        {isQuickPick ? (
          /* QuickPick QR & OTP Card */
          <div>
            <QRCodeCard
              orderNumber={order.orderNumber}
              otp={order.pickupOtp || '438912'}
              counter={order.pickupCounter || 'Counter 2'}
              estimatedTime={order.estimatedTime}
              restaurantName={order.restaurant.name}
            />

            <div className="card p-4 mt-4 bg-surface-card border-gray-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-ink-secondary">
                <span>Restaurant Outlet:</span>
                <span className="font-semibold text-ink">{order.restaurant.name}</span>
              </div>
              <div className="flex items-center justify-between text-ink-secondary">
                <span>Counter Location:</span>
                <span className="font-bold text-brand-600">
                  {order.pickupCounter || 'Counter 2'}
                </span>
              </div>
              <div className="flex items-center justify-between text-ink-secondary">
                <span>Estimated Ready Time:</span>
                <span className="font-semibold text-ink">{order.estimatedTime}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Delivery Confirmation Card */
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <p className="text-xs text-ink-muted uppercase font-semibold">Order Number</p>
                <p className="text-lg font-bold text-ink">{order.orderNumber}</p>
              </div>
              <span className="badge-brand">Home Delivery</span>
            </div>

            <div className="space-y-3 text-xs text-ink-secondary">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink">Delivering to:</p>
                  <p className="text-ink-muted mt-0.5">
                    {order.deliveryAddress || 'Flat 302, Coral Apartments, Koramangala 4th Block'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-ink">Estimated Arrival: </span>
                  <span>{order.estimatedTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-ink">Restaurant: </span>
                  <span>{order.restaurant.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Items Summary */}
        <div className="card p-5">
          <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">
            Items Ordered ({order.items.length || 2})
          </h3>
          <div className="space-y-2 text-xs">
            {order.items.length > 0 ? (
              order.items.map((i) => (
                <div key={i.id} className="flex justify-between text-ink-secondary">
                  <span>
                    {i.quantity}x {i.menuItem.name}
                  </span>
                  <span className="font-medium text-ink">{formatPrice(i.totalPrice)}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between text-ink-secondary">
                <span>2x Chicken Biryani, 1x Filter Coffee</span>
                <span className="font-medium text-ink">{formatPrice(order.total)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-ink text-sm">
              <span>Paid via {order.paymentMethod.toUpperCase()}</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/track-order/${order.id}`}
            className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
          >
            <span>{isQuickPick ? 'Track Order Status' : 'Track Delivery'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="btn-secondary py-3 text-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
